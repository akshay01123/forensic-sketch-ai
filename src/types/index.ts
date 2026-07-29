export type Message = {
  id: number;
  from: 'user' | 'assistant';
  text: string;
  ts: number;
};
