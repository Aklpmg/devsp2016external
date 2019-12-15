import * as React from 'react';
import styles from './Main.module.scss';
import { IQuestionProps, IQuestionState } from './IQuestionProps';
import { escape } from '@microsoft/sp-lodash-subset';
// import { ItemsContext } from './Questions';

// styles - grid
//  state, onChange - update state > to parent - eventHandler
//  actions - global state?
//  re-render

// can i just make this a functional component?
// Child Component
// Keep the state in the Parent
// props.state props.setState  : pass in  the parent state value and function (onChange will call the parent setState function)

// what values am I passing into a question?
interface IQuestion1Props {
  handleChange: any;
  title: string;
  id?: number;
  comments?: string;
  value?: string;
  response?: string;
  link1?: string;
  link2?: string;
 }

export const Question: React.FC<IQuestion1Props> = ({ handleChange, title, id, comments, value, response, link1, link2 }) => {
  // handleChange - needs to know which column?
  // value
  // response
  // upload file - what should this do exactly? - in here, an upload file control will actually upload the file
  // and then it needs to tell the parent it has done this - put it somewhere tmpStorage?
  // flow: if attachFile link exists then move the file from tmpStorage to the right place
  // but if in the parent - as it is items, as soon as this changes .... all of the children will re-render?
  // unless I tell it not to - or unless it is a performance issue!  I can still compare the props coming in and if it hasn't changed for this one

  // const [items, setItems] = React.useContext(ItemsContext)

  const onHandleChange = (e: any) => {
     console.log('Question - handleChange');   
    // console.log(e.target.name);
    // console.log(e.target.value);
    // console.log(e.target.dataset.id);
    handleChange(id, e.target.name, e.target.value);
    // console.log(items);
  };

  const onHandleFileUpload = (e: any) => {
    console.log('file');
  };

  const click = (e: any) => {
    handleChange(1, 'Value', 'new value');
  };

  return(
    <React.Fragment>
      <div className={styles.item1}>
        {title}
      </div>
      <div className={styles.item}>
        value: <input type='text' data-id={id} name='Value' value={value} onChange={onHandleChange}/>
      </div>
      <div className={styles.item}>
        response: <input type='text' data-id={id} name='Response' value={response} onChange={onHandleChange}/>
      </div>      
    </React.Fragment>
  );
};

/*
export default class Question extends React.Component < IQuestionProps, IQuestionState > {
  public constructor(props: IQuestionProps, state: IQuestionState) {
    super(props);

    this.state = {
      title: this.props.title,
      id: this.props.id,
      value: this.props.value,
      comments: this.props.comments,
      response: this.props.response,
      link1: this.props.link1,
      link2: this.props.link2
    };

    // so is it really worth passing the state back up to the parent on each call?
    // I should just pass in what? the eventHandler to call - what am I updating? I don't need to keep the state in here as well?
    //  unless I am liable to have multiple screens?  in which case .... have a local state hook?
  }

  public render(): React.ReactElement<IQuestionProps> {
    return(
      <React.Fragment>
        <div className={styles.item1}>
          {this.props.title}
        </div>
        <div className={styles.item}>
          {this.props.value}
          <input type='text'/>
        </div>
        <div className={styles.item}>
          {this.props.response}
        </div>
        <div className={styles.item}>
          {this.props.comments}
        </div>
        <div className={styles.item}>
          {this.props.link1}<br/>
          {this.props.link2}
        </div>
     </React.Fragment>
    );
  }
}
*/
