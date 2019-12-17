import * as React from 'react';
import styles from './Main.module.scss';
import { IQuestionProps, IQuestionState } from './IQuestionProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { sp } from '@pnp/sp';
import { Dropdown, DropdownMenuItemType, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';

// import { ItemsContext } from './Questions';
//  re-render

export const Question: React.FC<IQuestionProps> = ({ clickme, handleChange, handleFiles, id, etag, title, description, value, response, comments, sectionL1, sectionL2, sectionL3, docCount, docFolderLink }) => {
  // check props have changed before re-rendering
  // const [items, setItems] = React.useContext(ItemsContext)

  // the inputs are controlled so they are synced with the state!
  
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

interface IDropdownControlledExampleState {
    selectedItem?: { key: string | number | undefined };
  }
  
  const _onChange = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    console.log(`Selection change: ${item.text} ${item.selected ? 'selected' : 'unselected'}`);
    console.log(item.data);
    handleChange(id, 'Response', item.text);    
    
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
        <Dropdown                
          data-id = {id}
          data-name = 'Response'          
          onChange={_onChange}
          placeholder="Select an option"
          options={[
            { key: 'Comments added', text: 'Comments added' },
            { key: 'Relevant information attached', text: 'Relevant information attached' },
            { key: 'Relevant information to be provided via email', text: 'Relevant information to be provided via email' },
            { key: 'KPMG to obtain from my accounting software', text: 'KPMG to obtain from my accounting software' },
            { key: 'Not applicable', text: 'Not applicable' }
          ]}          
        />
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

        <select onChange={onHandleChange} name='Response'>
          <option value=''></option>
          <option value='Comments added'>Comments Added</option>
          <option value='Relevant information attached'>Relevant information attached</option>
          <option value='Relevant information to be provided via email'>Relevant information to be provided via email</option>
          <option value='KPMG to obtain from my accounting software'>KPMG to obtain from my accounting software</option>
          <option value='Not applicable'>Not applicable</option>
        </select>

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
<ul>
        {currentFiles && currentFiles.map(file => (
          <li>file.name</li>
        ))}
      </ul>
*/
