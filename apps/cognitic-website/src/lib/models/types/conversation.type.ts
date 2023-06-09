export type RepositoryOption = {
  name: string;
  url: string;
  version?: string;
  [key: string]: any;
};

// Model used to create a new agent
export type NewConversationDTO = {
  content: string;
  repository: RepositoryOption;
};

// Model retrieved from backend
export type ConversationDTO = {
  id: string;
  title: string;
  repository: RepositoryOption;
  messages: Array<ChatMessageDTO>;
  created_at: string; // datetime string;
};

export type ChatMessageDTO = {
  id: string; // uuidv4
  conversation_id: string;
  content: string;
  role: 'system' | 'user' | 'assistant';
  created_at: string; // datetime string;
  user_feedback: string | null;
};
