import './App.css';
import { ThemeProvider } from '@material-ui/styles';
import degreez_theme from './Shared/degreez-theme';
import ScheduleInterface from './Components/Schedule/ScheduleInterface.js';


function App() {
  return (
    <ThemeProvider theme={degreez_theme}>
      <ScheduleInterface />
    </ThemeProvider>
  );
}


export default App;
