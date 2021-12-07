import React, {Component} from 'react';
import { Dialog, DialogActions, Button, DialogContent, DialogContentText, DialogTitle, Grid, Select, MenuItem, InputLabel } from '@material-ui/core';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib


class NewScheduleDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: new Date(),
      semester: 'Fall',
    };
  }

  setYear(year) {
    this.setState({year});
  }

  setSemester(semester) {
    this.setState({semester});
  }

  render() {
    const { open, onCancel, onCreateSchedule } = this.props;
    const { year, semester } = this.state;
    return <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Create New Schedule</DialogTitle>
      <DialogContent>
        <DialogContentText>Select starting semester.</DialogContentText>
        <Grid container>
          <Grid item>
            <InputLabel id='semester-select'></InputLabel>
            <Select 
              labelID='semester-select'
              value={semester}
              onChange={event => this.setSemester(event.target.value)}
            >
              <MenuItem value='Spring'>Spring</MenuItem>
              <MenuItem value='Summer'>Summer</MenuItem>
              <MenuItem value='Fall'>Fall</MenuItem>
            </Select>
          </Grid>
          <Grid item>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                views={['year']}
                value={year}
                onChange={date => this.setYear(date)}
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color='primary'>
          Cancel
        </Button>
        <Button onClick={() => onCreateSchedule(semester, year.getFullYear())} color='primary'>
          Create Schedule
        </Button>
      </DialogActions>
    </Dialog>
  }
}


export default NewScheduleDialog;