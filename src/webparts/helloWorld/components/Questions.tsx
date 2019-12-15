import * as React from 'react';
import styles from './Main.module.scss';
import { IQuestionsProps } from './IQuestionsProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { sp } from '@pnp/sp';
import { Question } from './Question';
import { data } from './questionsdata';

import { useTable } from 'react-table';
import { makeData } from './makeData';

export interface IReactGetItemsState {
  items: string[];
}

interface IEditableCell {
  cell: any;
  row: any;
  column: any;
  updateMyData: any;
}

// Create an editable cell renderer
const EditableCell: React.FC<IEditableCell> = ({
    cell: { value: initialValue },
    row: { index },
    column: { id },
    updateMyData
    // This is a custom function that we supplied to our table instance
  }) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  const onChange = e => {
    console.log('EditableCell-onchange');
    console.log(e.target.value);
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    console.log('EditableCell-onBlur');
    updateMyData(index, id, value);
  };

  // If the initialValue is changed externall, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return <input value={value} onChange={onChange} onBlur={onBlur} />;
};

interface ITableProps {
  columns: any;
  data: any;
  updateMyData: any;
 }

const Table: React.FC<ITableProps> = ({ columns, data, updateMyData }) => {
// function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({
    columns,
    data,
    updateMyData
  });

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(
          (row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })
        }
      </tbody>
    </table>
  );
};

interface IFC {
  title: string;
}

const FC: React.FC<IFC> = ({ title }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        columns: [
          {
            Header: 'First Name',
            accessor: 'firstName',
            Cell: EditableCell
          },
          {
            Header: 'Last Name',
            accessor: 'lastName'
          }
        ]
      },
      {
        Header: 'Info',
        columns: [
          {
            Header: 'Age',
            accessor: 'age'
          },
          {
            Header: 'Visits',
            accessor: 'visits'
          },
          {
            Header: 'Status',
            accessor: 'status'
          },
          {
            Header: 'Profile Progress',
            accessor: 'progress'
          }
        ]
      }
    ],
    []
  );

  // const data = React.useMemo(() => makeData;);
  const [data, setData] = React.useState(() => makeData);
  const [originalData] = React.useState(data);

  console.log('data');
  console.log(makeData);

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

  return(
    <Table columns={columns} data={makeData} updateMyData={updateMyData} />
  );
};

// export const ItemsContext = React.createContext()
// Make questions a functional component? useHooks to set the state? pass in the data for now?
// so it's being re-started, ie const [items, setItems] = React.useState([]); is being called onClick from child:
export const Questions: React.FC<IQuestionsProps> = (props) => {
  const [items, setItems] = React.useState([]);
  const [qComp, setQComp] = React.useState();

  /*
  const fetchItems = async () => {
    const response = await get('/users');
    setItems(response.data);
  };
  */
  
  const fetchItems = () => {    
    setItems(data);
  };

  //why does this not know the state?
  const handleValueChange = (id, name, value) => {
    console.log('parent - handleValueChange');
    console.log(items);
    // console.log(id, name, value);
    // as soon as I update the state - all of the children will re-render!
    const nextState = items.map(a => a.Id === id ? { ...a, [name]: value } : a);    
    setItems(nextState);
    // updateQuestionComponent(nextState);
  };

  React.useEffect(() => {
    // when the component first loads, do what?  take the data and do what with it?  should only run this once!    
    fetchItems();
    //updateQuestionComponent(data);
  }, []);

  const updateQuestionComponent = (data) => {
    const c = data.map((item, key) => 
      <Question handleChange={handleValueChange}
      key={item.Id} id={item.Id} title={item.Title} value={item.Value}
      comments={item.Comments} response={item.Response} link1={item.Link1} link2={item.Link2}>
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

  const qComponent = data.map((item, key) =>
      <Question
        handleChange={handleValueChange}
        key={item.Id} id={item.Id} title={item.Title} value={item.Value}
        comments={item.Comments} response={item.Response} link1={item.Link1} link2={item.Link2}></Question>
  );

  return(
    <div className={styles.questions}>
      <button onClick={upd}>upd</button>
      <button onClick={display}>disp</button>
      <div className={styles.container}>
          <ul>
            {items.map(item => (
              <Question handleChange={handleValueChange}
              key={item.Id} id={item.Id} title={item.Title} value={item.Value}
              comments={item.Comments} response={item.Response} link1={item.Link1} link2={item.Link2}></Question>
            ))}
          </ul>
      </div>
    </div>
   );
};

// <ItemsContext.Provider value={[items, setItems]}>

export default class Questions1 extends React.Component < IQuestionsProps, {} > {
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

  const handleValueChange = (id, name, value) => {
    console.log('parent - handleValueChange');
    console.log(id, name, value);
  }

  public render(): React.ReactElement<IQuestionsProps> {
    const qComponent = data.map((item, key) =>
        <Question
          handleChange={this.handleValueChange}
          key={item.Id} id={item.Id} title={item.Title} value={item.Value}
          comments={item.Comments} response={item.Response} link1={item.Link1} link2={item.Link2}></Question>
    );
    return(
     <div className={styles.questions}>
       <div className={styles.container}>
        {qComponent}
       </div>
     </div>
    );
  }
}
