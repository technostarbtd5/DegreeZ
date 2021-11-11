//import { Grid, Typography } from '@material-ui/core';
import React, {Component} from 'react';
import Schedule from '../Schedule/Schedule.js';


const DUMMY_SCHEDULE = [
    {
        term: "Fall",
        year: "2019",
        courses: [
            {
                department: "CSCI",
                code: "1100",
            },
            {
                department: "CSCI",
                code: "1200",
            },
        ],
    },
    {
        term: "Spring",
        year: "2020",
        courses: [
            
        ],
    },
    {
        term: "Summer",
        year: "2020",
        courses: [
            
        ],
    },
    {
        term: "Fall",
        year: "2020",
        courses: [
            
        ],
    },
    {
        term: "Spring",
        year: "2021",
        courses: [
            
        ],
    },
    {
        term: "Summer",
        year: "2021",
        courses: [
            
        ],
    },
]


class CreateScheduleButton extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <button onClick={() => this.props.newSchedule()}>
                Create Schedule
            </button>
        )
    }
}

class RemoveScheduleButton extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <button onClick={() => this.props.removeSchedule()}>
                Remove Schedule
            </button>
        )
    }
}

class ScheduleInterface extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schedule_loaded: false,
            schedule: null,
            last_action: null
        }
        this.newSchedule = this.newSchedule.bind(this);
        this.removeSchedule = this.removeSchedule.bind(this);
    }

    newSchedule(major = null) {
        var copied_schedule = JSON.parse(JSON.stringify(DUMMY_SCHEDULE)); // Ugly, but it deepcopies DUMMY_SCHEDULE
        this.setState({schedule_loaded: true, schedule: copied_schedule});
    }

    removeSchedule() {
        this.setState({schedule_loaded: false});
    }

    saveSchedule() {
        if(this.state.schedule_loaded){
            this.setState({last_action: ["saveSchedule"]});
        }
    }

    loadSchedule() {
        if(!this.state.schedule_loaded){
            var input = document.createElement('input');
            input.type = 'file';

            input.onchange = e => {
                var file = e.target.files[0]
                var reader = new FileReader();
                reader.readAsText(file, 'UTF-8');
                reader.onload = readerEvent => {
                    var content = readerEvent.target.result;
                    var Loaded_Schedule = JSON.parse(content);
                    this.setState({schedule_loaded: true, schedule: Loaded_Schedule});
                }
            }

            input.click();
        }
    }

    addSemester(semester) {
        if(this.state.schedule_loaded){
            this.setState({last_action: ["addSemester", semester]});
        }
    }
    
    removeSemester(semester) {
        if(this.state.schedule_loaded){
            this.setState({last_action: ["removeSemester", semester]});
        }
    }

    addCourse(semester, course) {
        if(this.state.schedule_loaded){
            this.setState({last_action: ["addCourse", semester, course]});
        }
    }

    removeCourse(semester, course) {
        if(this.state.schedule_loaded){
            this.setState({last_action: ["removeCourse", semester, course]});
        }
    }

    render() {
        return (
            <div className="ScheduleInterface">
                {this.state.schedule_loaded
                    ? <div>
                        <RemoveScheduleButton removeSchedule={this.removeSchedule}/>

                        <button onClick={() => this.saveSchedule()}> SaveSchedule </button>
                        <button onClick={() => this.addSemester({term:"Summer",year:"2099"})}> AddSemester </button>
                        <button onClick={() => this.removeSemester({term:"Summer",year:"2099"})}> RemoveSemester </button>
                        <button onClick={() => this.addCourse({term:"Summer",year:"2099"}, {department: "CSCI", code: "1200"})}> AddCourse </button>
                        <button onClick={() => this.removeCourse({term:"Summer",year:"2099"}, {department: "CSCI", code: "1200"})}> RemoveCourse </button>

                        <Schedule schedule={this.state.schedule} last_action={this.state.last_action}/>
                    </div>
                    : <div>
                        <CreateScheduleButton newSchedule={this.newSchedule}/>

                        <button onClick={() => this.loadSchedule()}> LoadSchedule </button>
                    </div>
                }
            </div>
        )
    }
}


export default ScheduleInterface