import './App.css';
import { ThemeProvider } from '@material-ui/styles';
import degreez_theme from './Shared/degreez-theme';

import { DragDropContext } from "react-beautiful-dnd";

import ScheduleInterface from './Components/Schedule/ScheduleInterface.js';
import Sidebar from './Components/Sidebar/Sidebar.js';

function onDragEnd(result) {
  const { source, destination, draggableId } = result;
  console.log(result);

  // dropped outside the list
  if (!destination) {
    return;
  }

  const course_terms = draggableId.split('-');
  const dest_terms = destination.droppableId.split('-');
  if (source.droppableId === destination.droppableId) {

  } else {
    if (dest_terms[0] === "semester") {
      console.log(dest_terms[1]);
      console.log(dest_terms[2]);
      // add course to destination
      // remove course from source
    } else if (dest_terms[0] === "sidebar") {
      console.log(dest_terms[1]);
      // add course to destination
      // remove course from source
    }
  }
}

function App() {
  return (
    <ThemeProvider theme={degreez_theme}>

      <DragDropContext onDragEnd={onDragEnd}>
        <ScheduleInterface />
        <Sidebar />
      </DragDropContext>

    </ThemeProvider>
  );
}

export default App;
