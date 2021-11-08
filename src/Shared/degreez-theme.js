import { red, blue } from '@material-ui/core/colors';
import { createTheme } from '@material-ui/core/styles';

const degreez_theme = createTheme({
  palette: {
    primary: {
      main: red[700],
    },
    secondary: {
      main: blue[900],
    },
  },
});

export default degreez_theme;