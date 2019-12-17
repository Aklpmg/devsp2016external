export interface IQuestionProps {
  handleChange: any;
  handleDropdownChange: any;
  handleIsDirty: any;
  clickme: any;
  id: number;
  title: string;
  description: string;
  value?: string;
  response?: string;
  comments?: string;
  docCount?: number;
  docFolderLink?: any;
  hasValue: boolean;
  hasDocument: boolean;
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
