import { Grid, Typography } from '@material-ui/core';
//import { ViewCarousel } from '@material-ui/icons';
import React, {Component} from 'react';
import CourseTile from '../Course/CourseTile.js';
import { Droppable } from "react-beautiful-dnd";
import { checkCompletion } from '../../Shared/RequirementHelper.js';
import { isEqual } from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

const styles = theme => ({
    semester: {
        minHeight: 100
    },
    semesterText: {
        padding: 10
    },
    noCoursesText: {
        color: grey[500]
    }
});

/**
 * Get whether a course is offered in a semester
 * @param {Object} semester semester object 
 * @param {Object} courseData courseData object
 * @returns truthy if course is offered in this semester, falsy otherwise
 */
function isValidSemester(semester, courseData) {
    if (semester.year % 2) {
        switch (semester.term) {
            case "Fall":
                return courseData?.semesters?.fallOdd || courseData?.semesters?.fall;
            case "Spring":
                return courseData?.semesters?.springOdd || courseData?.semesters?.spring;
            case "Summer":
                return courseData?.semesters?.summerOdd || courseData?.semesters?.summer;
            default:
                return false;
        }
    } else {
        switch (semester.term) {
            case "Fall":
                return courseData?.semesters?.fallEven || courseData?.semesters?.fall;
            case "Spring":
                return courseData?.semesters?.springEven || courseData?.semesters?.spring;
            case "Summer":
                return courseData?.semesters?.summerEven || courseData?.semesters?.summer;
            default:
                return false;
        }
    }
}

/**
 * Get all errors associated with a given course in a given semester, if any
 * @param {Object[]} schedule Array of semester objects
 * @param {Number} activeSemesterIndex Index in schedule of the course's semester
 * @param {Object} courseData courseData object
 * @param {String} department
 * @param {String} code
 * @returns String of all applicable errors. Returns empty string if no errors exist.
 */
function getErrorMessages(schedule, activeSemesterIndex, courseData,  department, code) {
    const prereqs = courseData?.prereqs || {};
    const coreqs = courseData?.coreqs || {};
    const previousSemestersCourses = schedule.filter((_, index) => index < activeSemesterIndex).map(semester => semester.courses || []).flat();
    const currentSemesterCourses = schedule[activeSemesterIndex]?.courses || [];
    const errorMsg = [];
    if (schedule[activeSemesterIndex].term == "Transfer Credits") return ""; // Transfer credits should not error!
    if (!isEqual(prereqs, {}) && !checkCompletion(prereqs, previousSemestersCourses)) {
        errorMsg.push("Missing prerequisite(s)!");
    }
    if (!isEqual(coreqs, {}) && !checkCompletion(coreqs, currentSemesterCourses)) {
        errorMsg.push("Missing corequisite(s)!");
    }
    if (errorMsg.length) {
        errorMsg.push("You may need a requirement override form.");
    }
    if (!isValidSemester(schedule[activeSemesterIndex], courseData)) {
        errorMsg.push(`${department} ${code} - ${courseData.name} is not normally offered in this semester!`);
    }
    return errorMsg.join(" ");
}

/**
 * Function for rendering and displaying a schedule in the schedule interface.
 */
class Schedule extends Component {
    render() {
        const {schedule, allCourses, classes} = this.props;
        return (
            <div className="Schedule">
                {schedule.map((semester, activeSemesterIndex) => 
                    <div className={classes.semester}>
                        <Droppable droppableId={`semester-${semester.term}-${semester.year}`} direction="horizontal">
                            {(provided, snapshot) =>
                                <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                >

                                <Grid container alignItems="center">
                                    <Grid item xs={2}>
                                        <Typography variant="h5" className={classes.semesterText}>
                                            {semester.term} {semester.year}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={10}>
                                        <Grid container justifyContent="space-evenly">
                                            {semester.courses?.length ? semester.courses?.map((course, index) => {
                                                const {department, code} = course;
                                                const courseData = allCourses?.[department]?.[code] || {};
                                                return <Grid item>
                                                    <CourseTile courseData={courseData} department={department} code={code} index={index} errorMsg={getErrorMessages(schedule, activeSemesterIndex, courseData, department, code)} />
                                                </Grid>
                                            }) :
                                            <Typography variant="h5" className={classes.noCoursesText}>
                                                No Courses
                                            </Typography>
                                            }
                                        </Grid>
                                    </Grid>
                                    
                                </Grid>

                                {provided.placeholder}
                                
                            </div>}
                        </Droppable>
                    </div>
                )}
            </div>
        )
    }
}

// export default withStyles(styles)(Schedule);
// export default Schedule;
export default withStyles(styles)(Schedule);