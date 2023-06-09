<script lang="ts">
  import { notificationStore } from '$lib/features/Notifications/store/notifications';
  import type { Conversation } from '$lib/models/classes/Conversation.class';
  import { NotificationType, Position } from '$lib/models/enums/notifications';
  import { onDestroy, onMount } from 'svelte';
  import ChatMessage from '../components/ChatMessage.svelte';
  import { trackEvent } from '$lib/core/services/tracking';
  import * as Sentry from '@sentry/svelte';
  import { _ } from 'svelte-i18n';
  import ConversationWrapper from './Wrapper.svelte';
  import Button from '$lib/shared/components/Button.svelte';
  import { Log } from '$lib/core/services/logging';
  import type {
    ChatMessageDTO,
    ChatMode,
    CompletionResponse
  } from '$lib/models/types/conversation.type';
  import { selectedEntities } from '$lib/features/CodebaseSidebar/stores/selection';
  import type { IFileContentItem } from 'cognitic-models';
  import { initialFileTreeFile } from '$lib/shared/stores/selectedRepository';
  import { openModal } from '$lib/features/SubscribeModal/layout/SubscribeModal.svelte';
  import { fetchStream } from '$lib/features/ConversationThread/utils/streaming';
  import type { EventSourceMessage } from '@microsoft/fetch-event-source';
  import {
    recentRepositories,
    selectedRepositoryStore
  } from '$lib/shared/stores/recentRepositories';
  import { user } from '$lib/shared/stores/user';

  export let conversation: Conversation;
  let loading: boolean = false;
  let answer: string = '';
  let wrapContainer: ConversationWrapper;
  let streamController: AbortController;
  let chatModeValue: ChatMode;
  let techStackValue: string = conversation.value.repository.description || '';

  export async function handleSubmit(query: string, messageId?: string) {
    closeEventSource();
    trackEvent('New message', {
      message: query,
      conversationId: conversation.value.id,
      chatMode: chatModeValue
    });
    streamController = new AbortController();
    answer = '';
    loading = true;

    conversation.addMessage({ role: 'user', content: query }, messageId);

    const contents: [IFileContentItem] = await window.electron.getContents(
      $selectedEntities.map((selection) => selection.filePath)
    );
    const documents = contents.map((content) => {
      return {
        page_content: content.fileContent,
        metadata: {
          file_path: content.filePath
        }
      };
    });

    const body = {
      ...conversation.value,
      documents: documents,
      root_directory: $initialFileTreeFile,
      technology_description: techStackValue,
      chat_mode: chatModeValue
    };

    await fetchStream('/chat/stream', {
      body,
      streamController,
      onOpen,
      onMessage,
      onClose: closeEventSource,
      onError
    });
  }

  async function onOpen(res: Response) {
    if (res.status === 429) {
      const retryAfter = res.headers.get('x-rate-limit-reset'); // in seconds
      if (!isPremium) openModal();
      if (!retryAfter) throw new Error('Rate limit exceeded.');
      const nextDate = Date.now() + parseInt(retryAfter) * 1000;
      throw new Error(
        `Current limit exceeded. Next request available at: ${new Date(
          nextDate
        ).toLocaleString()}`
      );
    }
  }

  function onError(err: any) {
    handleError(err);
    throw err;
  }

  function onMessage(e: EventSourceMessage) {
    scrollToBottom();
    try {
      loading = false;
      const completionResponse = JSON.parse(e.data) as CompletionResponse;
      const content = completionResponse.msg;

      if (completionResponse.done) {
        if (completionResponse.id) {
          const metadata = completionResponse.metadata || undefined;
          conversation.addMessage(
            { role: 'assistant', content: content, metadata },
            completionResponse.id
          );
        }
        return;
      }

      if (completionResponse.error) {
        throw new Error(content);
      }

      if (content) {
        answer = (answer ?? '') + content;
      }
    } catch (err) {
      handleError(err);
    }
  }

  function closeEventSource() {
    streamController?.abort();
    answer = '';
    loading = false;
  }

  function scrollToBottom(force: boolean = false) {
    if (wrapContainer) {
      wrapContainer.scrollToBottom(force);
    }
  }

  function handleError(error: any) {
    loading = false;
    let msg = $_('notifications.chatAPIError');
    if (error instanceof Error) {
      // Handle message processing errors
      Log.ERROR('Message processing error', error);
      msg = error.message;
    } else {
      Log.ERROR('Unknown error event', error);
      try {
        const errMessage = JSON.parse(error.data);
        msg = errMessage.detail;
      } catch {
        // Do nothing
        Log.ERROR('Unknown error', error);
      }
    }

    closeEventSource();
    notificationStore.addNotification({
      type: NotificationType.GeneralError,
      position: Position.BottomRight,
      message: msg
    });
    Sentry.captureMessage(msg);
  }

  function handleEdit(
    e: CustomEvent<{ message: ChatMessageDTO; content: string }>
  ) {
    const { message, content } = e.detail;
    const index = conversation.value.messages.findIndex(
      (m) => m.id === message.id
    );
    if (index === -1) {
      return;
    }

    const messagesToDelete = [];
    for (let i = index; i < conversation.value.messages.length; i++) {
      messagesToDelete.push(conversation.value.messages[i]);
    }
    for (const m of messagesToDelete) {
      conversation.deleteMessage(m);
    }

    handleSubmit(content, message.id);
    trackEvent('Edit message', {
      messageId: message.id,
      message: message.content,
      conversationId: conversation.value.id,
      messageIndex: index,
      deletedMessageCount: messagesToDelete.length
    });
  }

  onMount(async () => {
    // when chaning conversation inside the same repository, we dont want to loose the description
    conversation.value.repository.description =
      $selectedRepositoryStore?.description;
    recentRepositories.setSelected(conversation.value.repository);

    let m = conversation.value.messages;
    if (m.length > 0 && m[m.length - 1].role === 'user') {
      handleSubmit(m[m.length - 1].content, m[m.length - 1].id);
    }
    scrollToBottom(true);
  });

  onDestroy(() => {
    closeEventSource();
  });

  $: isPremium = user.isPremium($user);
</script>

<ConversationWrapper
  bind:chatModeValue
  bind:techStackValue
  on:submit={(e) => {
    handleSubmit(e.detail);
  }}
  on:feedback={(e) => {
    const { message, feedback } = e.detail;
    conversation.addFeedback(message, feedback);
    trackEvent('Feedback message', {
      messageId: message.id,
      conversationId: conversation.value.id,
      feedback: e.detail
    });
  }}
  on:deleteMessage={(e) => {
    const message = e.detail;
    conversation.deleteMessage(message);
    trackEvent('Delete message', {
      from: message.role,
      message: message.content,
      conversationId: conversation.value.id
    });
  }}
  on:edit={handleEdit}
  {loading}
  submitDisabled={answer !== ''}
  bind:this={wrapContainer}
  messages={$conversation.messages}
>
  <svelte:fragment>
    {#if answer}
      <ChatMessage type="system" message={answer} />
    {/if}
  </svelte:fragment>

  <svelte:fragment slot="footer">
    {#if answer}
      <Button
        class="bg-background-primary mx-auto"
        variant="tertiary"
        type="button"
        on:click={() => {
          conversation.addMessage({ role: 'assistant', content: answer });
          closeEventSource();
        }}
      >
        {$_('conversation.stop')}
      </Button>
    {/if}
  </svelte:fragment>
</ConversationWrapper>
