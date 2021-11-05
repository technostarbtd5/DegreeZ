import logo from './logo.svg';
import './App.css';
import { ThemeProvider } from '@material-ui/styles';
import degreez_theme from './Shared/degreez-theme';

import Schedule from './Components/Schedule/Schedule.js';

function App() {
  return (
    <ThemeProvider theme={degreez_theme}>
      {/* <div className="App">
        <header className="App-header"> */}
          {/* <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a> */}

          <Schedule /> 
        {/* </header>
      </div> */}
    </ThemeProvider>
  );
}

export default App;
