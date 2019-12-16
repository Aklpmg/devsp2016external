import * as React from 'react';
import styles from './Main.module.scss';
import { IQuestionsProps } from './IQuestionsProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { sp } from '@pnp/sp';
import { Question } from './Question';
import { data } from './questionsdata';

import { makeData } from './makeData';
import { FilePicker } from 'react-file-picker'

import Dropzone from 'react-dropzone'
import { useDropzone } from 'react-dropzone'

// Assume only one user at a time filling out the form!

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
function MyDropzone() {
  // upload the document straight away vs saving the info for use later
  //  size of the document - if quite big then storing it locally first?
  const onDrop = React.useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      console.log('MyDropzone - files | file: ');
      console.log(file);
      sp.web.getFolderByServerRelativeUrl("/sites/kpoc/Docs/").files.add(file.name, file, true).then(_ => console.log('done'));      

      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
      // Do whatever you want with the file contents
        const binaryStr = reader.result;
        console.log(binaryStr);                    
      }
      reader.readAsArrayBuffer(file);
    })    
  }, [])

  const {getRootProps, getInputProps} = useDropzone({onDrop});

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop some files here, or click to select files</p>
    </div>
  )
}

// export const ItemsContext = React.createContext()
export const Questions: React.FC<IQuestionsProps> = (props) => {
  const [items, setItems] = React.useState([]);
  const [qComp, setQComp] = React.useState();


  ///*
  const fetchItems = async () => {
    // get all the items from a sharepoint list
    //const response = await sp.web.lists.getByTitle('Questions').items.select('Title','Value','Response','Comments','L1','L2','L3','Link1','Link2').get().then(function(data) {
      const response = await sp.web.lists.getByTitle('Questions').items.select('Id','Title','QuestionDescription','Value','Response','Comments','SectionL1','SectionL2','SectionL3','Link1','Link2').get().then(function(data) {
      let items: Array<object> = [];
      console.log(data);
      // format of files - a collection of links else cannot delete them!  store as json?  but then can't just look at the list
      //  a custom field control
      for (let k in data) {        
        let item = data[k];        
        items.push({
          Id: item.Id,
          Title: item.Title,
          Description: item.QuestionDescription,
          Value: item.Value,
          Response: item.Response,
          Comments: item.Comments,
          SectionL1: item.SectionL1,
          SectionL2: item.SectionL2,
          SectionL3: item.SectionL3,
          Link1: item.Link1,
          Link2: item.Link2,
          Files: []
        });
      }
      return items;
    });
    setItems(response);
    // const response = await get('/users');
    // setItems(response.data);
  };
  //*/
 /*
  const fetchItems = () => {
    setItems(data);
  };
  */
  const handleValueChange = (id, name, value) => {
    console.log('parent - handleValueChange');
    console.log(items);
    // console.log(id, name, value);
    // as soon as I update the state - all of the children will re-render!
    const nextState = items.map(a => a.Id === id ? { ...a, [name]: value } : a);
    setItems(nextState);
    // updateQuestionComponent(nextState);
  };

  const handleFilesUpload = (id, files, sectionL1) => {
    console.log('Questions | Parent - handleFilesUpload');
    console.log(id);
    // lookup the section level values based on the Question?

    files.forEach((file) => {      
      console.log(file.name);
      sp.web.getFolderByServerRelativeUrl("/sites/kpoc/Docs/").files.add(file.name, file, true)
      .then(f => {
        f.file.getItem().then(item => {
          console.log(item);
          console.log(item['OData__dlc_DocId']);
          item.update({
              QuestionID: id,
              SectionL1: sectionL1
          });
        });
      });
    })
  }

  React.useEffect(() => {
    // when the component first loads, do what?  take the data and do what with it?  should only run this once!
    fetchItems();
    // updateQuestionComponent(data);
  }, []);

  const updateQuestionComponent = (data) => {
    const c = data.map((item, key) =>
      <Question handleChange={handleValueChange} handleFiles={handleFilesUpload}
      key={item.Id} id={item.Id} title={item.Title} description={item.Description}
      value={item.Value} comments={item.Comments} response={item.Response} link1={item.Link1} link2={item.Link2}
      sectionL1={item.SectionL1} sectionL2={item.SectionL2} sectionL3={item.SectionL3}>
    </Question>);
    setQComp(c);
  };

  const display = (e: any) => {
    console.log('display');
    console.log(items);
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

  return(
    <div className={styles.questions}>
      <MyDropzone/>
      <input type='file'/>
      <FilePicker
        extensions={['txt']}
        onChange = { FileObject => console.log(FileObject) }
        onError = { errMsg => console.log(errMsg) }
      >
        <button>
          Click to upload 
        </button>
      </FilePicker>

      <div className={styles.container}>
          {items.map(item => (
            <Question handleChange={handleValueChange} handleFiles={handleFilesUpload}
            key={item.Id} id={item.Id} title={item.Title} description={item.Descripiton}
            value={item.Value} comments={item.Comments} response={item.Response} link1={item.Link1} link2={item.Link2} currentFiles={item.Files}
            sectionL1={item.SectionL1} sectionL2={item.SectionL2} sectionL3={item.SectionL3}>
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
interface IReactGetItemsState{
  items: [];
}
