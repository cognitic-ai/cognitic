<script lang="ts">
  import SvelteMarkdown from 'svelte-markdown';
  import CodePreviewRenderer from '$lib/features/ConversationThread/components/CodePreviewRenderer.svelte';
  import type { IFileContentItem } from 'cognitic-models';
  import { selectedRepositoryStore } from '$lib/shared/stores/recentRepositories';

  export let file: IFileContentItem;

  $: message = '```\n' + file.fileContent + '```\n';
  $: prefix = $selectedRepositoryStore?.url || '';
  $: paths = file.filePath.replace(prefix, '').split('/');
</script>

<div
  class="bg-background-primaryActive label-mini sticky top-0 flex h-7 w-full items-center overflow-x-scroll px-3"
>
  {#each paths.slice(0, -1) as path}
    <span class="text-content-secondary">{path}</span>
    <span class="text-content-secondary mx-1">/</span>
  {/each}
  <span class="text-content-primary">{paths[paths.length - 1]}</span>
</div>

<SvelteMarkdown
  source={message}
  renderers={{
    code: CodePreviewRenderer
  }}
/>
