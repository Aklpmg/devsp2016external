import * as React from 'react';
import styles from './HelloWorld.module.scss';
import { IQuestionProps } from './IQuestionProps';
import { escape } from '@microsoft/sp-lodash-subset';

//styles - grid
//  state, onChange - update state > to parent - eventHandler
//  actions - global state?
//  re-render

export default class Question extends React.Component < IQuestionProps, {} > {
  public render(): React.ReactElement<IQuestionProps> {
    return(
     <React.Fragment>
       aaa {this.props.title}
     </React.Fragment>
    );
  }
}
