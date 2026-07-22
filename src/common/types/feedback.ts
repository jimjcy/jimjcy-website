export interface getFeedbackRow {
  id: number;
  username: string;
  status: number;
  statusString?: string;
  title: string;
  date: string;
  description: string;
  reply: string;
}
export interface getFeedbackResult {
  status: boolean;
  result: getFeedbackRow[];
}
