//import { Grid, Typography } from '@material-ui/core';
import React, {Component} from 'react';
import Schedule from '../Schedule/Schedule.js';

class ScheduleInterface extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schedule_loaded: false
        }
    }

    newSchedule(major = null) {
        this.setState({schedule_loaded: true});
    }

    saveSchedule() {
        // TODO
    }

    loadSchedule() {
        // TODO
    }

    removeSchedule() {
        // TODO
    }

    addSemester(semester) {
        // TODO
    }
    
    removeSemester(semester) {
        // TODO
    }

    addCourse(course) {
        // TODO
    }

    removeCourse(course) {
        // TODO
    }

    render() {
        return (
            <div className="ScheduleInterface">
                {this.state.schedule_loaded ? <Schedule /> : <button onClick={() => this.newSchedule()}> New Schedule </button>}
            </div>
        )
    }
}


export default ScheduleInterface