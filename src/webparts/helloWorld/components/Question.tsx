import * as React from 'react';
import styles from './Main.module.scss';
import { IQuestionProps, IQuestionState } from './IQuestionProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { sp } from '@pnp/sp';
import { Dropdown, DropdownMenuItemType, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Link } from 'office-ui-fabric-react/lib/Link';
// import { ItemsContext } from './Questions';
//  re-render

interface IDropdownControlledExampleState {
  selectedItem?: { key: string | number | undefined };
}

export const Question: React.FC<IQuestionProps> = ({ clickme, handleChange, handleDropdownChange, handleIsDirty, id, title, description, value, response, comments, docCount, docFolderLink, hasValue, hasDocument }) => {
  // check props have changed before re-rendering
  // const [items, setItems] = React.useContext(ItemsContext)

  // the inputs are controlled so they are synced with the state!
  const click = (e: any) => {
    console.log('docFolderLink: ', docFolderLink);
  };

  const _valueChange = (e: React.FormEvent<HTMLInputElement>, newValue?: string) => {
    const ele: any = e.target;
    // console.log(ele.dataset);
    handleChange(id, ele.dataset.field, newValue);
  };

  const _dropdownChange = (e: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
    // console.log(`Selection change: ${item.text} ${item.selected ? 'selected' : 'unselected'}`);
    const ele: any = e.target;
    // console.log(`child dropdownChange: ${id} | ${ele.dataset.field} | ${item.text}`);
    handleDropdownChange(id, ele.dataset.field, item.text);
  };

  const _isDirty = (e: any) => {
    handleIsDirty(id);
  };

  return(
    <React.Fragment>
      <div className={styles.item1}>
        {id} | {description}
      </div>
      <div className={styles.item2}>
        {hasValue &&
          <TextField data-id={id} data-field='value' value={value} onChange={_valueChange} onBlur={_isDirty}/>
        }
      </div>
      <div className={styles.item3}>
        <Dropdown
          data-id = {id}
          data-field = 'response'
          defaultSelectedKey = {response}
          onChange = {_dropdownChange}
          placeholder = 'Select an option'
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
        <TextField data-id={id} data-field='comments' value={comments} onChange={_valueChange} onBlur={_isDirty} multiline rows={2} autoAdjustHeight/>
      </div>
      <div className={styles.item5}>
        {docCount}
        {docFolderLink &&
          <Link href={docFolderLink.Url} target='_blank' data-interception='off' rel='noopener noreferrer'>upload files</Link>
        }
      </div>
    </React.Fragment>
  );
};

// <ChildFilesDropZone questionId={id} sectionL1={sectionL1} sectionL2={sectionL2} sectionL3={sectionL3}/>
// <a href={docFolderLink.Url} target='_blank' data-interception='off' rel='noopener noreferrer'>upload files</a>
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
