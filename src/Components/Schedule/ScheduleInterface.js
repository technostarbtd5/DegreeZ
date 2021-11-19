//import { Grid, Typography } from '@material-ui/core';
import React, {Component} from 'react';
import { DragDropContext } from "react-beautiful-dnd";
import Schedule from '../Schedule/Schedule.js';
import Sidebar from '../Sidebar/Sidebar.js';


const DUMMY_SCHEDULE = [
    {
        term: "Fall",
        year: "2019",
        courses: [
            
        ],
    },
]

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


class ScheduleInterface extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schedule_loaded: false,
            schedule: null,
            takingCourses: []
        }
    }

    newSchedule(major = null) {
        var copied_schedule = JSON.parse(JSON.stringify(DUMMY_SCHEDULE)); // Ugly, but it deepcopies DUMMY_SCHEDULE
        this.setState({schedule_loaded: true, schedule: copied_schedule});
    }

    removeSchedule() {
        this.setState({schedule_loaded: false, schedule: null});
    }

    saveSchedule(Object, FileName, Type) {
        if(!this.state.schedule_loaded){return;}
        
        const JSONSTR = JSON.stringify(Object);
        const file = new Blob([JSONSTR], {type: Type});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(file);
        a.download = FileName;
        a.click();
        URL.revokeObjectURL(a.href);
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

    // Given a course {department:String, code:String}, returns the index of the course within the list
    getCourseIndex(list, course) {
        for (var i = 0; i < list.length; i++) {
            const cour = list[i];
            if (cour.department === course.department && cour.code === course.code) {
                return i;
            }
        }
        return -1;
    }
    
    // Attempts to add a semester to the schedule
    addSemester(semester = null) {
        if(!this.state.schedule_loaded){return;}

        var sched = this.state.schedule;
        const last_sem = sched[this.state.schedule.length-1];

        var next_term;
        var next_year = last_sem.year;
        if (!semester) {
            switch(last_sem.term) {
                case "Fall":
                    next_term = "Spring";
                    next_year++;
                    break;
                case "Spring":
                    next_term = "Summer";
                    break;
                case "Summer":
                    next_term = "Fall";
                    break;
                default:
                    break;
            }
        } else {
            next_term = semester.term;
            next_year = semester.year;
        }
        
        sched.push({
            term: next_term,
            year: next_year,
            courses: []
        });
        this.setState({schedule: sched});
    }
    
    // Attempts to remove a semester from the schedule
    removeSemester(index = null) {
        if(!this.state.schedule_loaded){return;}

        var sched = this.state.schedule;
        if (sched.length > 0) {
            const sem_index = (index || sched.length-1);
            sched.splice(sem_index, 1);
            this.setState({schedule: sched});
        }
    }
    
    // Attempts to add a course to a semester
    addCourse(semester, course) {
        if(!this.state.schedule_loaded){return;}

        const sem_index = this.getSemesterIndex(semester);
        if (sem_index >= 0) {
            var sched = this.state.schedule;
            sched[sem_index].courses.push(course);
            this.setState({schedule: sched});

            // Update list of all courses we are taking
            const taking_cour_index = this.getCourseIndex(this.state.takingCourses, course);
            if (taking_cour_index === -1) {
                this.state.takingCourses.push(course);
                this.setState({takingCourses: this.state.takingCourses});
            }
        }
    }
    
    // Attempts to remove a course from a semester
    removeCourse(semester, course) {
        if(!this.state.schedule_loaded){return;}

        const sem_index = this.getSemesterIndex(semester);
        if (sem_index >= 0) {
            var sched = this.state.schedule;
            const cour_index = this.getCourseIndex(sched[sem_index].courses, course);
            if (cour_index >= 0) {
                sched[sem_index].courses.splice(cour_index, 1);
                this.setState({schedule: sched});

                // Update list of all courses we are taking
                const taking_cour_index = this.getCourseIndex(this.state.takingCourses, course);
                if (taking_cour_index >= 0) {
                    this.state.takingCourses.splice(taking_cour_index, 1);
                    this.setState({takingCourses: this.state.takingCourses});
                }
            }
        }
    }



    onDragEnd = (result) => {
        const { source, destination, draggableId } = result;
        console.log(result);
      
        // dropped outside the list
        if (!destination) {
            return;
        }
      
        const course_terms = draggableId.split('-');
        const source_terms = source.droppableId.split('-');
        const dest_terms = destination.droppableId.split('-');
        if (source.droppableId === destination.droppableId) {
      
        } else {
            console.log(source_terms);
            console.log(dest_terms);
            console.log(course_terms);

            if (dest_terms[0] === "semester") {
                this.addCourse(
                    {term: dest_terms[1], year: dest_terms[2]},
                    {department: course_terms[0], code: course_terms[1]}
                );
            } else if (dest_terms[0] === "sidebar") {
                this.removeCourse(
                    {term: source_terms[1], year: source_terms[2]},
                    {department: course_terms[0], code: course_terms[1]}
                );
            }
        }
    }

    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>

                <div className="ScheduleInterface">
                    {this.state.schedule_loaded
                        ? <div>
                            <button onClick={() => this.removeSchedule()}> Remove Schedule </button>
                            <button onClick={() => this.saveSchedule()}> Save Schedule </button>
                            <button onClick={() => this.addSemester()}> Add Semester </button>
                            <button onClick={() => this.removeSemester()}> Remove Semester </button>

                            <Schedule schedule={this.state.schedule} allCourses={DUMMY_COURSE_LIST} />
                        </div>
                        : <div>
                            <button onClick={() => this.newSchedule()}> Create Schedule </button>
                            <button onClick={() => this.loadSchedule()}> Load Schedule </button>
                        </div>
                    }
                </div>

                <Sidebar courses={this.state.takingCourses}/>

            </DragDropContext>
        )
    }
}


export default ScheduleInterface