import { Grid, Typography } from '@material-ui/core';
//import { ViewCarousel } from '@material-ui/icons';
import React, {Component} from 'react';
import CourseTile from '../Course/CourseTile.js';
import { Droppable } from "react-beautiful-dnd";

const DUMMY_COURSE_LIST = {
    "CSCI": {
        "1100": {
            name: "Computer Science I",
            desc: "An introduction to computer programming ..."
        },
        "1200": {
            name: "Data Structures",
            desc: "Programming concepts: functions, parameter passing, ..."
        },
    },
}

class Schedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schedule: this.props.schedule,
        }
    }

    saveFile(Object, FileName, Type) {
        const JSONSTR = JSON.stringify(Object);
        const file = new Blob([JSONSTR], {type: Type});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(file);
        a.download = FileName;
        a.click();
        URL.revokeObjectURL(a.href);
    }

    componentDidUpdate(prevProps) {
        var last_action = this.props.last_action;
        if(prevProps.last_action !== last_action) {
            switch(last_action[0]) {
                case "saveSchedule":
                    this.saveFile(this.state.schedule, "DegreeZ Schedule", 'text/plain');
                    break;
                case "addSemester":
                    this.addSemester(last_action[1]);
                    break;
                case "removeSemester":
                    this.removeSemester(last_action[1]);
                    break;
                case "addCourse":
                    this.addCourse(last_action[1], last_action[2]);
                    break;
                case "removeCourse":
                    this.removeCourse(last_action[1], last_action[2]);
                    break;
                default:
                    break;
            }
        }
    }
    
    // Given a semester {term:String, year:String}, returns the index of the semester within the schedule
    getSemesterIndex(semester) {
        for (var i = 0; i < this.state.schedule.length; i++) {
            const sem = this.state.schedule[i];
            if (sem.term === semester.term && sem.year === semester.year) {
                return i;
            }
        }
        return -1;
    }

    // Given a course {department:String, code:String}, returns the index of the course within the semester
    getCourseIndex(semester, course) {
        for (var i = 0; i < semester.length; i++) {
            const cour = semester[i];
            if (cour.department === course.department && cour.code === course.code) {
                return i;
            }
        }
        return -1;
    }
    
    // Attempts to add a semester to the schedule
    addSemester(semester) {
        const sem_index = this.getSemesterIndex(semester);
        if (sem_index === -1) {
            var sched = this.state.schedule;
            sched.push({
                term: semester.term,
                year: semester.year,
                courses: []
            });
            this.setState({schedule: sched});
        }
    }
    
    // Attempts to remove a semester from the schedule
    removeSemester(semester) {
        const sem_index = this.getSemesterIndex(semester);
        if (sem_index >= 0) {
            var sched = this.state.schedule;
            sched.splice(sem_index, 1);
            this.setState({schedule: sched});
        }
    }
    
    // Attempts to add a course to a semester
    addCourse(semester, course) {
        const sem_index = this.getSemesterIndex(semester);
        if (sem_index >= 0) {
            var sched = this.state.schedule;
            sched[sem_index].courses.push(course);
            this.setState({schedule: sched});
        }
    }
    
    // Attempts to remove a course from a semester
    removeCourse(semester, course) {
        const sem_index = this.getSemesterIndex(semester);
        if (sem_index >= 0) {
            var sched = this.state.schedule;
            const cour_index = this.getCourseIndex(sched[sem_index].courses, course);
            if (cour_index >= 0) {
                sched[sem_index].courses.splice(cour_index, 1);
                this.setState({schedule: sched});
            }
        }
    }

    render() {
        const {schedule} = this.state;
        const allCourses = DUMMY_COURSE_LIST;
        return (
            <div className="Schedule">
                {schedule.map(semester => 
                    <Droppable droppableId={`semester-${semester.term}-${semester.year}`} direction="horizontal">
                        {(provided, snapshot) =>
                            <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            >

                            <Grid container>
                                <Grid item xs={2}>
                                    <Typography variant="h5">
                                        {semester.term} {semester.year}
                                    </Typography>
                                </Grid>
                                <Grid item xs={10}>
                                    <Grid container justifyContent="space-evenly">
                                        {semester.courses?.map((course, index) => {
                                            const {department, code} = course;
                                            const courseString = `${department} ${code}`;
                                            const {name, desc} = allCourses?.[department]?.[code] || {};
                                            return <Grid item>
                                                <CourseTile name={name} desc={desc} code={courseString} index={index}/>
                                            </Grid>
                                        })}
                                    </Grid>
                                </Grid>
                                
                            </Grid>

                            {provided.placeholder}
                            
                        </div>}
                    </Droppable>
                )}
            </div>
        )
    }
}

export default Schedule