import * as React from 'react';
import styles from './Main.module.scss';
import { IHelloWorldProps } from './IHelloWorldProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { Questions } from './Questions';

export default class HelloWorld extends React.Component < IHelloWorldProps, {} > {
  public render(): React.ReactElement<IHelloWorldProps> {
    return(
      <div className = { styles.parent } >
        <p>{escape(this.props.description)}</p>
        aaa
        <Questions description='q' context={this.props.context}/>
      </div>
    );
  }
}
