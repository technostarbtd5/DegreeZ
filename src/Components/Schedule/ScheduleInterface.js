import React, { Component } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { Button } from '@material-ui/core';
import Schedule from '../Schedule/Schedule.js';
import Sidebar from '../Sidebar/Sidebar.js';
import NewScheduleDialog from './NewScheduleDialog.js';
import COURSE_LIST from '../../Data/Courses.json';


/**
 * Get next semester given current semester.
 * @param {Object} currentSemester Must have 'term' and 'year' fields specified.
 * @returns Semester object with just term and year specified
 */
function nextSemester(currentSemester) {
    const { term, year } = currentSemester;
    const nextSem = {term, year};
    switch(term) {
        case 'Spring':
            nextSem.term = 'Summer';
            break;
        case 'Summer':
            nextSem.term = 'Fall';
            break;
        case 'Fall':
            nextSem.term = 'Spring';
            nextSem.year = String(Number(year) + 1);
            break;
        default:
            break;
    }
    return nextSem;
}

/**
 * Generate a blank schedule.
 * @param {Object} startingSemester Must have 'term' and 'year' fields specified. 
 * @param {Number} numSemesters Number of semesters to generate.
 * @returns Array of semester objects.
 */
function generateSchedule(startingSemester, numSemesters = 11) {
    let activeSemester = startingSemester;
    const schedule = [{
        term: 'Transfer Credits',
        year: '',
        courses: [],
    }];
    for(let i = 0; i < numSemesters; i++) {
        const { term, year } = activeSemester;
        schedule.push({
            term,
            year: String(year),
            courses: [],
        });
        activeSemester = nextSemester(activeSemester);
    }
    return schedule;
}


class ScheduleInterface extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scheduleLoaded: false,
            schedule: null,
            takingCourses: [],
            creatingSchedule: false,
        }
    }
    

    /**
     * Creates a blank schedule starting from startingSemester.
     * @param {Object} startingSemester Semester object with 'year' and 'term' fields specified. 
     * @modifies {Schedule} Creates a blank schedule 
     */
    newSchedule(startingSemester) {
        const schedule = generateSchedule(startingSemester);
        this.setState({scheduleLoaded: true, schedule, creatingSchedule: false, takingCourses: []});
    }

    setCreatingSchedule(creatingSchedule) {
        this.setState({creatingSchedule});
    }


    /**
     * Function to remove the current schedule
     * @modifies {Schedule} Deletes the current schedule being implemented
     */
    removeSchedule() {
        this.setState({scheduleLoaded: false, schedule: null, takingCourses: []});
    }


    /**
     * Function that saves the current schedule into a text format
     * @param {Schedule} Object Schedule to be saved 
     * @param {*} FileName Name to be saved under
     * @param {*} Type Type of file to be saved as
     * @returns a text file containing the data from schedule, named as FileName
     */
    saveSchedule(Object = this.state.schedule, FileName='DegreeZ Schedule', Type=Text) {
        if(!this.state.scheduleLoaded) {
            return;
        }
        
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
        if(this.state.scheduleLoaded) {
            return;
        }

        const input = document.createElement('input');
        input.type = 'file';

        input.onchange = e => {
            const file = e.target.files[0]
            const reader = new FileReader();
            reader.readAsText(file, 'UTF-8');
            reader.onload = readerEvent => {
                const content = readerEvent.target.result;
                const loadedSchedule = JSON.parse(content);

                // Generate list of all courses taken so that we can update requirements in sidebar
                const newTakingCourses = [];
                for(let i = 0; i < loadedSchedule.length; i++) {
                    for(let g = 0; g < loadedSchedule[i].courses.length; g++) {
                        newTakingCourses.push(loadedSchedule[i].courses[g]);
                    }
                }

                this.setState({scheduleLoaded: true, schedule: loadedSchedule, takingCourses: newTakingCourses});
            }
        }

        input.click();
    }


   /**
    * Helper function to get a semesters index in the schedule. 
    * @param {term:String, year:String} semester term and year of the semester to be located  
    * @returns the index of the semester in the current schedule or -1 if not found
    */
    getSemesterIndex(semester) {
        const sched = this.state.schedule;
        for(let i = 0; i < sched.length; i++) {
            const sem = sched[i];
            if(sem.term === semester.term && sem.year === semester.year) {
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
        for(let i = 0; i < list.length; i++) {
            const cour = list[i];
            if(cour.department === course.department && cour.code === course.code) {
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
        if(!this.state.scheduleLoaded) {
            return;
        }

        const sched = this.state.schedule;
        const lastSem = sched[sched.length-1];

        let nextTerm;
        let nextYear;
        if(!semester) {
            nextYear = parseInt(lastSem.year, 10);
            switch(lastSem.term) {
                case 'Fall':
                    nextTerm = 'Spring';
                    nextYear++;
                    break;
                case 'Spring':
                    nextTerm = 'Summer';
                    break;
                case 'Summer':
                    nextTerm = 'Fall';
                    break;
                default:
                    break;
            }
        } else {
            nextTerm = semester.term;
            nextYear = semester.year;
        }
        
        sched.push({
            term: nextTerm,
            year: nextYear.toString(),
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
        if(!this.state.scheduleLoaded) {
            return;
        }

        const sched = this.state.schedule;
        if(sched.length > 2) {
            const semIndex = (index || sched.length-1);

            // Remove all courses from semester before removing semester itself
            const thisSem = sched[semIndex];
            while(thisSem.courses.length > 0) {
                this.removeCourse(thisSem, thisSem.courses[0]);
            }

            sched.splice(semIndex, 1);
            this.setState({schedule: sched});
        }
    }
    

    /**
     * Helper function to add a course to a schedule
     * @param {String} semester 
     * @param {Course} course 
     * @param {Number} index optional index to place course in, defaults to end of semester
     * @modifies {this.state.schedule} Adds a class into the schedule at the signified index
     */
    addCourse(semester, course, index = null) {
        if(!this.state.scheduleLoaded) {
            return;
        }

        const semIndex = this.getSemesterIndex(semester);
        if(semIndex >= 0) {
            const sched = this.state.schedule;

            if(index == null) {
                index = sched[semIndex].courses.length;
            }
            sched[semIndex].courses.splice(index, 0, course);
            
            this.setState({schedule: sched});

            // Update list of all courses we are taking
            const takingCourIndex = this.getCourseIndex(this.state.takingCourses, course);
            if(takingCourIndex === -1) {
                this.state.takingCourses.push(course);
                this.setState({takingCourses: this.state.takingCourses});
            }
        }
    }
    
        
    /**
     * Helper function to remove a course from a semester
     * @param {String} semester 
     * @param {Course} course 
     * @modifies {this.state.schedule} Removes a class from the schedule at the signified index
     */
    removeCourse(semester, course) {
        if(!this.state.scheduleLoaded) {
            return;
        }

        const semIndex = this.getSemesterIndex(semester);
        if(semIndex >= 0) {
            const sched = this.state.schedule;
            const courIndex = this.getCourseIndex(sched[semIndex].courses, course);
            if(courIndex >= 0) {
                sched[semIndex].courses.splice(courIndex, 1);
                this.setState({schedule: sched});

                // Update list of all courses we are taking
                const takingCourIndex = this.getCourseIndex(this.state.takingCourses, course);
                if(takingCourIndex >= 0) {
                    this.state.takingCourses.splice(takingCourIndex, 1);
                    this.setState({takingCourses: this.state.takingCourses});
                }
            }
        }
    }


    /**
     * Function that connects a course being dragged and dropped into a semester in the schedule or into the sidebar and deleted.
     * @param {*} result 
     * @returns 
     */
    onDragEnd = (result) => {
        const { source, destination, draggableId } = result;
      
        if(!draggableId || !source || !destination) {
            return;
        }
      
        const courseTerms = draggableId.split('-');
        const sourceTerms = source.droppableId.split('-');
        const destTerms = destination.droppableId.split('-');

        if(destTerms[0] === 'semester') {
            if(sourceTerms[0] === 'semester') {
                this.removeCourse(
                    {term: sourceTerms[1], year: sourceTerms[2]},
                    {department: courseTerms[0], code: courseTerms[1]}
                );
            }
            this.addCourse(
                {term: destTerms[1], year: destTerms[2]},
                {department: courseTerms[0], code: courseTerms[1]},
                destination.index
            );
        } else if(sourceTerms[0] === 'semester' && destTerms[0] === 'sidebar') {
            this.removeCourse(
                {term: sourceTerms[1], year: sourceTerms[2]},
                {department: courseTerms[0], code: courseTerms[1]}
            );
        }
    }


    /**
     * Rendering function for displaying the schedule and appropriate buttons for functionality
     */
    render() {
        const { creatingSchedule, scheduleLoaded, schedule, takingCourses } = this.state;
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>

                <div className='scheduleInterface'>
                    {scheduleLoaded
                        ? <div>
                            <div className='scheduleButtonBar'>
                                <Button variant='contained' color='primary' onClick={() => this.removeSchedule()}> Remove Schedule </Button>
                                <Button variant='contained' color='primary' onClick={() => this.saveSchedule()}> Save Schedule </Button>
                                <Button variant='contained' color='primary' onClick={() => this.addSemester()}> Add Semester </Button>
                                <Button variant='contained' color='primary' onClick={() => this.removeSemester()}> Remove Semester </Button>
                            </div>

                            <Schedule schedule={schedule} allCourses={COURSE_LIST} />
                        </div>
                        : <div>
                            <div className='scheduleButtonBar'>
                                <Button variant='contained' color='primary' onClick={() => this.setCreatingSchedule(true)}> Create Schedule </Button>
                                <Button variant='contained' color='primary' onClick={() => this.loadSchedule()}> Load Schedule </Button>
                            </div>
                        </div>
                    }
                </div>

                <NewScheduleDialog
                    open={creatingSchedule}
                    onCancel={() => this.setCreatingSchedule(false)}
                    onCreateSchedule={(semester, year) => this.newSchedule({term: semester, year})}
                />

                <Sidebar courses={takingCourses} allCourses={COURSE_LIST} />

            </DragDropContext>
        )
    }
}


export default ScheduleInterface;