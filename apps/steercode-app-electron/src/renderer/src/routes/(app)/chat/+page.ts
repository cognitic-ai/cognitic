import { trackPage } from '$lib/core/services/tracking';
import {
  conversationsStore,
  selectedConversationId
} from '$lib/shared/stores/conversations';

export function load({ url }) {
  const searchParams = new URLSearchParams(url.search);
  const id = searchParams.get('id');
  if (!id) throw new Error('Missing conversation id');
  trackPage('Conversation', { conversationId: id });
  selectedConversationId.set(id);
  conversationsStore.fetchById(id);
  return {
    id
  };
}
