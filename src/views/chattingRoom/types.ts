export interface ChatRow {
  id: number;
  username: string;
  type: string;
  content: string;
  date: string;
}

export interface ChatResult {
  result: ChatRow[];
  id: string;
}
