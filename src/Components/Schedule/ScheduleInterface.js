
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
    
    /**
     * Creates a blank schedule
     * @param {String} major creates an empty schedule with a given major (Currently defaults to CSCI major) 
     * @modifies {Schedule} Creates a blank schedule 
     */
    newSchedule(major = null) {
        var copied_schedule = JSON.parse(JSON.stringify(DUMMY_SCHEDULE)); 
        this.setState({schedule_loaded: true, schedule: copied_schedule});
    }
    /**
     * Function to remove the current schedule
     * @modifies {Schedule} Deletes the current schedule being implemented
     */
    removeSchedule() {
        this.setState({schedule_loaded: false, schedule: null});
    }

    /**
     * Function that saves the current schedule into a text format
     * @param {Schedule} Object Schedule to be saved 
     * @param {*} FileName Name to be saved under
     * @param {*} Type Type of file to be saved as
     * @returns a text file containing the data from schedule, named as FileName
     */
    saveSchedule(Object = this.state.schedule, FileName="DegreeZ Schedule", Type=Text) {
        if(!this.state.schedule_loaded){return;}
        
        const JSONSTR = JSON.stringify(Object);
        const file = new Blob([JSONSTR], {type: Type});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(file);
        a.download = FileName;
        a.click();
        URL.revokeObjectURL(a.href);
    }
    /**
     *Function that loads an existing text file into a schedule.
     *@modifies {Schedule} 
     */
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

   /**
    * Helper function to get a semesters index in the schedule. 
    * @param {term:String, year:String} semester term and year of the semester to be located  
    * @returns the index of the semester in the current schedule or -1 if not found
    */
    getSemesterIndex(semester) {
        for (var i = 0; i < this.state.schedule.length; i++) {
            const sem = this.state.schedule[i];
            if (sem.term === semester.term && sem.year === semester.year) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Helper function that given a course and list of courses, finds the index of that course in the list.  
     * @param {Courses[]} list 
     * @param {Course} course 
     * @returns integer of the index of course in list or -1 if not present.
     **/
    getCourseIndex(list, course) {
        for (var i = 0; i < list.length; i++) {
            const cour = list[i];
            if (cour.department === course.department && cour.code === course.code) {
                return i;
            }
        }
        return -1;
    }
    

    /**
     * Helper function that adds a semester with the given information or the next possible one.
     * @param {term:String, year:String} semester signifies which term and year to create in the schedule. If not included create the next possible semester
     * @modifies the current schedule to include the semester given
     */
    addSemester(semester = null) {
        if(!this.state.schedule_loaded){return;}

        var sched = this.state.schedule;
        const last_sem = sched[this.state.schedule.length-1];

        var next_term;
        var next_year;
        if (!semester) {
            next_year = parseInt(last_sem.year, 10);
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
            year: next_year.toString(),
            courses: []
        });
        this.setState({schedule: sched});
    }
    
    /**
     * Removes a given semester or the latest one added from the current schedule
     * @param {Number} index semester to be removed
     * @modifies {this.state.scheule} removes semester with index and its associated classes
     */
    removeSemester(index = null) {
        if(!this.state.schedule_loaded){return;}

        var sched = this.state.schedule;
        if (sched.length > 0) {
            const sem_index = (index || sched.length-1);

            // Remove all courses from semester before removing semester itself
            var this_sem = this.state.schedule[sem_index];
            for (var i = 0; i < this_sem.courses.length; i++) {
                this.removeCourse(this_sem, this_sem.courses[i]);
            }

            sched.splice(sem_index, 1);
            this.setState({schedule: sched});
        }
    }
    
    /**
     * Helper function to add a course to a schedule
     * @param {String} semester 
     * @param {Course} course 
     * @modifies {this.state.schedule} Adds a class into the schedule at the signified index
     */
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
    
        
    /***  
    * Given a semester {term:String, year:String}, returns the index of the semester within the schedule
    */
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


    /**
     * Function that connects a course being dragged and dropped into a semeser in the schedule or into the sidebar and deleted.
     * @param {*} result 
     * @returns 
     */
    onDragEnd = (result) => {
        const { source, destination, draggableId } = result;
      
        if (!destination) {
            return;
        }
      
        const course_terms = draggableId.split('-');
        const source_terms = source.droppableId.split('-');
        const dest_terms = destination.droppableId.split('-');

        if (source.droppableId === destination.droppableId) {
            return;
        } else {
            if (dest_terms[0] === "semester") {
                if (source_terms[0] === "semester") {
                    this.removeCourse(
                        {term: source_terms[1], year: source_terms[2]},
                        {department: course_terms[0], code: course_terms[1]}
                    );
                }
                this.addCourse(
                    {term: dest_terms[1], year: dest_terms[2]},
                    {department: course_terms[0], code: course_terms[1]}
                );
            } else if (source_terms[0] === "semester" && dest_terms[0] === "sidebar") {
                this.removeCourse(
                    {term: source_terms[1], year: source_terms[2]},
                    {department: course_terms[0], code: course_terms[1]}
                );
            }
        }
    }
    /**
     * Rendering function for displaying the schedule and appropriate buttons for functionality
     */
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