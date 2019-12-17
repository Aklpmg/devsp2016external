import * as React from 'react';
import styles from './Main.module.scss';
import { IQuestionProps, IQuestionState } from './IQuestionProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { sp } from '@pnp/sp';

// import { ItemsContext } from './Questions';
//  re-render

// a separate component for each Question - takes in QuestionId as a parameter plus other values? - required for uploading the document?
//  or should it call it's parent function to do the actual uploading?  call the parent function with the File object?
// todo: remove/delete a document
/*
<ul>
        {currentFiles && currentFiles.map(file => (
          <li>file.name</li>
        ))}
      </ul>
*/

export const Question: React.FC<IQuestionProps> = ({ clickme, handleChange, handleFiles, id, etag, title, description, value, response, comments, sectionL1, sectionL2, sectionL3, docCount, docFolderLink }) => {
  // check props have changed before re-rendering
  // link to the file by the unique document id? how to get this back? else if i change the filename?
  //    warnings - if the file already exists - or just rename it ?  send a notification to ... kpmg person?

  // handleChange - needs to know which column?
  // value
  // response
  // upload file - what should this do exactly? - in here, an upload file control will actually upload the file
  // and then it needs to tell the parent it has done this - put it somewhere tmpStorage?
  // flow: if attachFile link exists then move the file from tmpStorage to the right place
  // but if in the parent - as it is items, as soon as this changes .... all of the children will re-render?
  // unless I tell it not to - or unless it is a performance issue!  I can still compare the props coming in and if it hasn't changed for this one

  // const [items, setItems] = React.useContext(ItemsContext)

  // the inputs are controlled so they are synced with the state!
  const onHandleChange = (e: any) => {
    console.log('Question - handleChange');
    // console.log(e.target.name);
    // console.log(e.target.value);
    // console.log(e.target.dataset.id);
    handleChange(id, e.target.name, e.target.value);
    // console.log(items);
  };

  const onHandleBlur = (e: any) => {
    console.log('Question - onHandleBlur');
    console.log(e.target.name);
    console.log(e.target.value);
    // console.log(e.target.dataset.id);
    // I should save this control
   // console.log(items);
  };

  const onHandleFiles = (files: any) => {
    // will receive all of the files - why not just create the contol in here
    // call the parent with an array of files? plus the questionId and sectionL values .... if I know the questionId, why not just look up the other values from the parent!
    //  do the section level values even need to be passed into here?
    console.log('Question | onHandleFiles');
    handleFiles(id, files);
  };

  const click = (e: any) => {
    console.log('docFolderLink: ', docFolderLink);
  };

  const setFile = (files: any) => {
    handleFiles(1, files);
  };

  const onFileUpload = (file: any) => {
    console.log('onFileUpload');
    console.log(file);
  };

  return(
    <React.Fragment>
      <div className={styles.item1}>
        {id} | {title}
      </div>
      <div className={styles.item2}>
        <input type='text' data-id={id} name='Value' value={value} onChange={onHandleChange} onBlur={onHandleBlur}/>
      </div>
      <div className={styles.item3}>
        <select onChange={onHandleChange} name='Response'>
          <option value=''></option>
          <option value='Comments added'>Comments Added</option>
          <option value='Relevant information attached'>Relevant information attached</option>
          <option value='Relevant information to be provided via email'>Relevant information to be provided via email</option>
          <option value='KPMG to obtain from my accounting software'>KPMG to obtain from my accounting software</option>
          <option value='Not applicable'>Not applicable</option>
        </select>
      </div>
      <div className={styles.item4}>
        <textarea data-id={id} name='Comments' value={comments} onChange={onHandleChange} onBlur={onHandleBlur}/>
      </div>
      <div className={styles.item5}>
        {docCount}
        {docFolderLink &&
          <a href={docFolderLink.Url} target='_blank' data-interception='off' rel='noopener noreferrer'>upload files</a>
        }
      </div>
    </React.Fragment>
  );
};

// <ChildFilesDropZone questionId={id} sectionL1={sectionL1} sectionL2={sectionL2} sectionL3={sectionL3}/>

/*
{docCount}
        {docFolderLink &&
          <a href={docFolderLink.Url} target='_blank' data-interception='off' rel='noopener noreferrer'>upload files</a>
        }

<input type="file" name="file" multiple onChange={(e) => setFile(e.target.files)} />
  <button onClick={click}>clickme</button>
  <ParentFilesDropZone handleFiles={onHandleFiles}/>

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
