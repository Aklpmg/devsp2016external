import * as React from 'react';
import styles from './Main.module.scss';
import { IQuestionsProps } from './IQuestionsProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { sp } from '@pnp/sp';
import { DefaultButton, PrimaryButton, Stack, IStackTokens } from 'office-ui-fabric-react';
import { Question } from './Question';
import { data } from './questionsdata';

import { makeData } from './makeData';
// import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
// import { Modal } from 'office-ui-fabric-react/lib/Modal';

// import IFrameDialog from './OpenDialog';

// Assume only one user at a time filling out the form!
// But each time I update a listItem, the etag value will change!
//  after each update will need to retrieve the etag value again! and update the state!

interface IItem {
  id: number;
  etag: string;
  title: string;
  description: string;
  value: string;
  response: string;
  comments: string;
  sectionL1: string;
  sectionL2: string;
  sectionL3: string;
  docCount: number;
  docFolderLink: string;
  hasValue: boolean;
  hasDocument: boolean;
  isDirty: boolean;
}

// export const ItemsContext = React.createContext({})
interface Array<IItem> {
  find(predicate: (value: IItem, index: number, obj: Array<IItem>) => boolean, thisArg?: any): IItem | undefined;
  map(predicate: (value: IItem, index: number, obj: Array<IItem>) => IItem): Array<IItem>;
}

export const Questions: React.FC<IQuestionsProps> = (props) => {
  type MyType = Array<IItem>;

  const [items, setItems] = React.useState<IItem[]>([]);
  const [qComp, setQComp] = React.useState();
  const selectFields: string[] = ['Id','Title','QuestionDescription','Value','Response','Comments','SectionL1','SectionL2','SectionL3','DocFolderLink','hasValue','hasDocument'];
  // /*
  const fetchItems = async () => {
    console.log('fetchItems');
    // const items = new Array<IItem>();
    const items: IItem[] = [];
    // get all the items from a sharepoint list
    const data = await sp.web.lists.getByTitle('Questions').items.select(selectFields.join(',')).get();
    // console.log(data);
    for (const k in data) {
      const item = data[k];
      items.push({
        id: item.Id,
        etag: item['odata.etag'],
        title: item.Title,
        description: item.QuestionDescription,
        value: item.Value,
        response: item.Response,
        comments: item.Comments,
        sectionL1: item.SectionL1,
        sectionL2: item.SectionL2,
        sectionL3: item.SectionL3,
        docCount: 0,
        docFolderLink: item.DocFolderLink,
        hasValue: item.hasValue,
        hasDocument: item.hasDocument,
        isDirty: false
      });
    }
    console.log(items);
    setItems(items);
  };

  const findItem = (id: number) => {
    const i = items;
    return i.find(item => item.id === id);
  };

  React.useEffect(() => {
    // when the component first loads, do what?  take the data and do what with it?  should only run this once!
    fetchItems();
    // updateQuestionComponent(data);
  }, []);

  const display = (e: any) => {
    console.log('display');
    console.log(items[0].docCount);
  };

  const upd = (e: any) => {
  };

  const clickme = (e: any) => {
  };

  const handleValueChange = (id, field, value) => {
    console.log(`parent handleChange: ${id} ${field} ${value}`);
    // console.log(items);
    // console.log(id, field, value);
    // console.log(items[0]);
    // console.log(items[1]);
    // as soon as I update the state - all of the children will re-render!
    const nextState = items.map(a => a.id === id ? { ...a, [field]: value } : a);
    setItems(nextState);
     console.log(nextState[0]);
    // console.log(nextState[1]);
    // updateQuestionComponent(nextState);
  };

  // if the dropdown value changes then also set isDirty=true
  const handleDropdownChange = (id, field, value) => {
    console.log(`parent dropdownChange: ${id} | ${field} | ${value}`);
    const nextState = items.map(a => a.id === id ? { ...a, [field]: value, isDirty: true } : a);
    setItems(nextState);
    console.log(nextState[0]);
    // console.log(nextState[1]);
  };

  // ddl will be onChange only else on Validation change? fire as well? conflicts? updating the value and the isDirty field on the same item!
  const handleIsDirty = (id: number) => {
    console.log('Parent - isDirty', id);
    const nextState = items.map(a => a.id === id ? { ...a, isDirty: true } : a);
    setItems(nextState);
    console.log(nextState[0]);
  };

  const saveItem = async (id: number) => {
    // is it fast enough to update the last item - eg type comments, click save > onBlur fires the handleIsDirty which sets the item state to dirty
    //  but I am already in this button so what if this item state hasn't been updated before the filtering in here?
    //  how do I wait for all state changes to have happened?
    // if onblur - but will be saving twice if update 2 values - value and comments/response,... update/refresh isDirty flag
  };

  // batch the item updates: is there a limit?
  //  saving spinner ....
  const saveItems = async(saveItems: IItem[]) => {
    const list = sp.web.lists.getByTitle('Questions');
    const entityTypeFullName = await list.getListItemEntityTypeFullName();
    console.log(entityTypeFullName);

    const batch = sp.web.createBatch();

    // note requirement of "*" eTag param - or use a specific eTag value as needed
    const len = saveItems.length;
    for (let i = 0; i <= len - 1; i++) {
      const item = saveItems[i];
      const updObj = {
        Value: item.value,
        Comments: item.comments,
        Response: item.response
      };

      list.items.getById(item.id).inBatch(batch).update(updObj, '*', entityTypeFullName).then(a => {
        console.log(`item updated: `, item.id);
        console.log(a);
      });
    }

    // all done: - stop the spinner
    await batch.execute();
    console.log('Batch All done');
    // reset the states - vs refetch:
    await fetchItems(); // will this reset everything?
    // stop the spinner .... saving ....
  };

  const handleSave = async (e: any) => {
    console.log('Save - IsDirty');
    // get the dirty items
    //    loop - async, concurrent? update
    const filtered = items.filter((item, idx) => item.isDirty);
    console.log(filtered);
    await saveItems(filtered);
  };

  // Sections - foreaqch Section, get the list of questions and display under a Heading - do the questions need a sectionLevel id value?
  //    questions should only show up under their lowest section level
  return(
    <div className={styles.questions}>
       <DefaultButton text='Save' onClick={handleSave}/>
        <button onClick={clickme}>clickme</button>
        <div className={styles.container}>
            {items.map(item => (
              <Question handleChange={handleValueChange} handleDropdownChange={handleDropdownChange} handleIsDirty={handleIsDirty} clickme={clickme}
              key={item.id} id={item.id} title={item.title} description={item.description}
              value={item.value} comments={item.comments} response={item.response}
              docCount={item.docCount} docFolderLink={item.docFolderLink}
              hasValue={item.hasValue} hasDocument={item.hasDocument}>
              </Question>
            ))}
        </div>
    </div>
   );
};

/*
  Load/Filter questions by section

  DataHelper functions:
    service/mockdata
    onLoad convert data types: from null to empty string, etc ...
    onSave convert data types?

  UI:
    Modal
    Spinner on saving/loading
    Tabs

  Get Item/Doc Count - just let all the calls go off and update as required? allow editing to begin?
    but both trying to update the state? - does it matter, I am only update the other field values - docCount shouldn't update isDirty

  Only display fields - hasValue, hasDocuments

  Save - if onblur is too slow > sets isDirty (last field might not get updated):
    compare original to current state to determine which items need to be updated

  Link to document eg bloodstock vs open folder and description - fill in document?  

  % complete

  Generation:
    folders: properties
    list: default folder values
    Question title and description (title=255char limit)
      hasValue, hasDocument
    Generate xls document with sheep/bloodstock tables if required, create document from central templates?
    Source: submit requests for new site ....
*/

/*
<button onClick={upd}>upd</button>
      <button onClick={display}>disp</button>
*/
// <ItemsContext.Provider value={[items, setItems]}>
interface IReactGetItemsState {
  items: [];
}

/*
const updItem = await sp.web.lists.getByTitle('questions').items.getById(id).update({
      'DocIds': docIds
    }, '*');
    const newEtag = updItem.data["odata.etag"];

      const updateQuestionComponent = (data) => {
    const c = data.map((item, key) =>
      <Question handleChange={handleValueChange} handleFiles={handleFilesUpload} etag={item.Etag}
      key={item.Id} id={item.Id} title={item.Title} description={item.Description}
      value={item.Value} comments={item.Comments} response={item.Response}
      sectionL1={item.SectionL1} sectionL2={item.SectionL2} sectionL3={item.SectionL3}
      docCount={item.DocCount}>
    </Question>);
    setQComp(c);
  };

  <button onClick={display}>disp</button>
      <MyDropzone/>
      <input type='file'/>

      "react-dropzone": "^10.2.1",
    "react-file-upload": "0.0.4"

     // upload the files to the designated libary, return a list of new docIds
  // update the metadata
  //  return a list of newDocIds
  // vs just add as attachments, flow to do all of this?
  async function dbProcessFiles(id, files, sectionL1) {
    console.log('dbProcessFiles Start');
    let colDocIds: string[] = [];

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      console.log('file start: ', file.name);
      const f = await sp.web.getFolderByServerRelativeUrl('/sites/kpoc/Docs/').files.add(file.name, file, true);
      const item = await f.file.getItem();
      const newDocId = item['OData__dlc_DocId'];
      colDocIds.push(newDocId);

      await item.update({
        QuestionID: id,
        SectionL1: sectionL1
      },'*');
      console.log('file end: ', file.name);
    }
    console.log('dbProcessFiles End');
    return colDocIds;
  }

*/

/*
  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    console.log('updateMyData: ');
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value
          };
        }
        return row;
      })
    );
  };

  // upload the files then update the list item:
  //  but still need to know the new document count of the library!??
  const xhandleFilesUpload = async (id, files) => {
    console.log('Questions | Parent - handleFilesUpload 1');
    console.log(items);
    const item = findItem(id);
    console.log(item);
    const docCount = item.DocCount + 1;
    console.log(docCount);
    // what is the new item count?
    // console.log(newEtag);

    const nextState = items.map(a => a.Id === id ? { ...a, DocCount: docCount } : a);
    console.log(nextState);
    setItems(nextState);
  };

    const handleFilesUpload = async (id, files) => {
    console.log('Questions | Parent - handleFilesUpload 3');
    console.log(files);
    console.log('id: ', id);
    const item = findItem(id);
//    console.log(item);
    const docCount = item.DocCount + 1;
    console.log('docCount: ', docCount);
    // what is the new item count?
    // console.log(newEtag);

    const nextState = items.map(a => a.Id === id ? { ...a, DocCount: docCount } : a);
    console.log(nextState);
    setItems(nextState);
  };

  const myRef = React.createRef();
  const [showModal, setShowModal] = React.useState(false);
  const clickme = (e) => {
    console.log('clickme');
    // setHide(false);
    // setShowModal(true);
    // const dia: IFrameDialog = new IFrameDialog('http://www.google.com');
    // console.log(dia);
    // dia.show();
    // const dialog: ColorPickerDialog = new ColorPickerDialog();

    // Dialog.alert('Hello world');
    // Dialog.alert('1');

*/
