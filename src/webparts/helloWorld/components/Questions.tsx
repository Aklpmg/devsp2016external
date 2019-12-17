import * as React from 'react';
import styles from './Main.module.scss';
import { IQuestionsProps } from './IQuestionsProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { sp } from '@pnp/sp';
import { Question } from './Question';
import { data } from './questionsdata';

import { makeData } from './makeData';
// import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
// import { Modal } from 'office-ui-fabric-react/lib/Modal';

// import IFrameDialog from './OpenDialog';

// import ColorPickerDialog from './OpenDialog';

// Assume only one user at a time filling out the form!
// But each time I update a listItem, the etag value will change!
//  after each update will need to retrieve the etag value again! and update the state!

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
*/
interface IItem {
  Id: number;
  Etag: string;
  Title: string;
  Description: string;
  Value: string;
  Response: string;
  Comments: string;
  SectionL1: string;
  SectionL2: string;
  SectionL3: string;
  DocCount: number;
  DocFolderLink: string;
}

// export const ItemsContext = React.createContext({})

export const Questions: React.FC<IQuestionsProps> = (props) => {
  const [items, setItems] = React.useState([]);
  const [qComp, setQComp] = React.useState();

  // /*
  const fetchItems = async () => {
    console.log('fetchItems');
    // get all the items from a sharepoint list
    // const response = await sp.web.lists.getByTitle('Questions').items.select('Title','Value','Response','Comments','L1','L2','L3','Link1','Link2').get().then(function(data) {
      const response = await sp.web.lists.getByTitle('Questions').items.select('Id','Title','QuestionDescription','Value','Response','Comments','SectionL1','SectionL2','SectionL3','DocFolderLink').get().then(function(data) {
      let items: IItem[] = [];
      console.log(data);
      // format of files - a collection of links else cannot delete them!  store as json?  but then can't just look at the list
      //  a custom field control
      for (let k in data) {
        const item = data[k];
        // console.log(item['odata.etag']);
        // console.log(item.DocIds);
        items.push({
          Id: item.Id,
          Etag: item['odata.etag'],
          Title: item.Title,
          Description: item.QuestionDescription,
          Value: item.Value,
          Response: item.Response,
          Comments: item.Comments,
          SectionL1: item.SectionL1,
          SectionL2: item.SectionL2,
          SectionL3: item.SectionL3,
          DocCount: 0,
          DocFolderLink: item.DocFolderLink
        });
      }
      return items;
    });
    // console.log(response);
    setItems(response);
    // const response = await get('/users');
    // setItems(response.data);
  };
  // */
 /*
  const fetchItems = () => {
    setItems(data);
  };
  */
  const handleValueChange = (id, name, value) => {
    console.log('parent - handleValueChange');
    console.log(items); 
    console.log(id, name, value);
    console.log(items[0]);
    // as soon as I update the state - all of the children will re-render!
    const nextState = items.map(a => a.Id === id ? { ...a, [name]: value } : a);
    setItems(nextState);
    console.log(nextState[0]);
    // updateQuestionComponent(nextState);
  };

  interface Array<IItem> {
    find(predicate: (value: IItem, index: number, obj: Array<IItem>) => boolean, thisArg?: any): IItem | undefined;
  }

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

  const findItem = (id: number) => {
    const i: Array<IItem> = items;
    return i.find(item => item.Id === id);
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

  React.useEffect(() => {
    // when the component first loads, do what?  take the data and do what with it?  should only run this once!
    fetchItems();
    // updateQuestionComponent(data);
  }, []);

  const display = (e: any) => {
    console.log('display');
    console.log(items[0].DocCount);
  };

  const upd = (e: any) => {
    setItems([{'Title': 'q1upd',
    'Id': 1,
    'Value': 'aupd',
    'Comments': 'cupd',
    'Response': 'dupd',
    'Links': null,
    'Link1': null,
    'Link2': null,
    'Link3': null,
    'Link4': null,
    'LInk5': null
    }]);
  };

  // Sections - foreaqch Section, get the list of questions and display under a Heading - do the questions need a sectionLevel id value?
  //    questions should only show up under their lowest section level
  // hmm when it opens up the dialog box!??
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
    /*
            dialog.show().then(() => {
              // Dialog.alert(`Message from Custom Dailog-->`);
            });
            */    
    // Dialog.alert('Hello world');
    // Dialog.alert('1');
    console.log(2);
  };
  const closeModal = (e: any) => {
    setShowModal(false);    
  };
  
  const [hide, setHide] = React.useState(true);

  return(
    <div className={styles.questions}>
        <button onClick={clickme}>clickme</button>
        <div className={styles.container}>
            {items.map(item => (
              <Question handleChange={handleValueChange} handleFiles={handleFilesUpload} clickme={clickme} etag={item.Etag}
              key={item.Id} id={item.Id} title={item.Title} description={item.Descripiton}
              value={item.Value} comments={item.Comments} response={item.Response}
              sectionL1={item.SectionL1} sectionL2={item.SectionL2} sectionL3={item.SectionL3}
              docCount={item.DocCount} docFolderLink={item.DocFolderLink}>
              </Question>
            ))}
        </div>
    </div>
   );
};

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
*/
