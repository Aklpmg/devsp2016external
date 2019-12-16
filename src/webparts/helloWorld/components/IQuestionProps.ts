export interface IQuestionProps {
  handleChange: any;
  handleFiles: any;
  id: number;  
  title: string;
  description: string;  
  value?: string;
  response?: string;
  comments?: string;  
  link1?: string;
  link2?: string;
  currentFiles?: any;
  sectionL1?: string;
  sectionL2?: string;
  sectionL3?: string;
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
