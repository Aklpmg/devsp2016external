import * as React from 'react';
import styles from './Main.module.scss';
import { IQuestionProps, IQuestionState } from './IQuestionProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { useDropzone } from 'react-dropzone'
import { sp } from '@pnp/sp';

// import { ItemsContext } from './Questions';
//  re-render

// a separate component for each Question - takes in QuestionId as a parameter plus other values? - required for uploading the document?
//  or should it call it's parent function to do the actual uploading?  call the parent function with the File object?
// todo: remove/delete a document
interface IChildDropZoneProps {
  questionId: number;  
  sectionL1?: string;
  sectionL2?: string;
  sectionL3?: string;
}

// todo: if the document has the same name and goes against another question, the document will be overwritten! 
// move the data calls ....
const ChildFilesDropZone: React.FC<IChildDropZoneProps> = ({questionId, sectionL1, sectionL2, sectionL3}) => {
  // upload the document straight away vs saving the info for use later
  //  size of the document - if quite big then storing it locally first?
  const onDrop = React.useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      console.log('ChildFilesDropZone - files | file: ');
      console.log(file.name);
      sp.web.getFolderByServerRelativeUrl("/sites/kpoc/Docs/").files.add(file.name, file, true)
      .then(f => {
        f.file.getItem().then(item => {
          item.update({
              QuestionID: questionId,
              SectionL1: sectionL1
          });
        });
      });
    })
  }, [])

  const {getRootProps, getInputProps} = useDropzone({onDrop});

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>ChildFilesDropZone - display the filenames after upload ...</p>
    </div>
  )
}

interface IParentDropZoneProps {
  handleFiles: any;
  currentFiles?: any;
}

// upload plus display - or 2 separate controls?
// after the files have been uploaded ... display the current fileNames
const ParentFilesDropZone: React.FC<IParentDropZoneProps> = ({handleFiles, currentFiles}) => {
  // what is being passed back to the parent? the files only
  const onDrop = React.useCallback((acceptedFiles) => {
    handleFiles(acceptedFiles);    
  }, [])

  const {getRootProps, getInputProps} = useDropzone({onDrop});

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>add documents</p>
      <ul>
        {currentFiles && currentFiles.map(file => (
          <li>file.name</li>
        ))}
      </ul>
    </div>
  )
}

export const Question: React.FC<IQuestionProps> = ({ handleChange, handleFiles, id, title, description, value, response, comments, link1, link2, currentFiles, sectionL1, sectionL2, sectionL3 }) => {
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

  const onHandleChange = (e: any) => {
     console.log('Question - handleChange');
    // console.log(e.target.name);
    // console.log(e.target.value);
    // console.log(e.target.dataset.id);
    handleChange(id, e.target.name, e.target.value);
    // console.log(items);
  };

  const onHandleFiles = (files: any) => {
    // will receive all of the files - why not just create the contol in here
    // call the parent with an array of files? plus the questionId and sectionL values .... if I know the questionId, why not just look up the other values from the parent!
    //  do the section level values even need to be passed into here?
    console.log('Question | onHandleFiles');
    handleFiles(id, files, sectionL1);    
  };

  const click = (e: any) => {
    handleChange(1, 'Value', 'new value');
  };

  return(
    <div className={styles.row}>
      <div className={styles.col}>
        {id} | {title}
      </div>
      <div className={styles.col}>
        <input type='text' data-id={id} name='Value' value={value} onChange={onHandleChange}/>
      </div>
      <div className={styles.col}>
        <input type='text' data-id={id} name='Response' value={response} onChange={onHandleChange}/>
      </div>
      <div className={styles.col}>
        comments: {comments}
      </div>
      <div className={styles.col}>
        <ParentFilesDropZone handleFiles={onHandleFiles} currentFiles={currentFiles}/>
      </div>
    </div>
  );
};

// <ChildFilesDropZone questionId={id} sectionL1={sectionL1} sectionL2={sectionL2} sectionL3={sectionL3}/>

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
