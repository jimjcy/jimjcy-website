export interface AiChatMessage {
  index: number;
  result: string;
  id: string;
}
export interface AiChatList {
  id?: number;
  role: string;
  content: string;
  rawcontent: string;
}
