import * as React from 'react';
import styles from './HelloWorld.module.scss';
import { IQuestionsProps } from './IQuestionsProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { sp } from '@pnp/sp';
import Question from './Question';
import { data } from './questionsdata';

export interface IReactGetItemsState {
  items: string[];
}

export default class Questions extends React.Component < IQuestionsProps, {} > {
  public constructor(props: IQuestionsProps, state: IReactGetItemsState) {
    super(props);
    this.state = {
      items: data
    };
  }

  /*
  public async componentDidMount(): Promise<void> {
    let items: string[];
    // get all the items from a sharepoint list
    const reacthandler = this;

    sp.web.lists.getByTitle('Questions').items.select('Title').get().then(function(data) {
      for (let k in data) {
        // items.push({key:data[k].Title, text:data[k].Title});
        items.push(data[k].Title);
      }
      reacthandler.setState({ items });
      console.log(items);
      return items;
    });
  }
  */

  public render(): React.ReactElement<IQuestionsProps> {
    const qComponent = data.map((item, key) =>
        <Question key={item.Id} id={item.Id} title={item.Title}></Question>
    );
    return(
     <div>
       {qComponent}
     </div>
    );
  }
}
