export interface IQuestionProps {
  title: string;
  id?: number;
  comments?: string;
  value?: string;
  response?: string;
  link1?: string;
  link2?: string;
}

export interface IQuestionState {
  title: string;
  id?: number;
  comments?: string;
  value?: string;
  response?: string;
  link1?: string;
  link2?: string;
}
