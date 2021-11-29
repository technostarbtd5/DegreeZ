import { Grid, Typography } from '@material-ui/core';
//import { ViewCarousel } from '@material-ui/icons';
import React, {Component} from 'react';
import CourseTile from '../Course/CourseTile.js';
import { Droppable } from "react-beautiful-dnd";
import { checkCompletion } from '../../Shared/RequirementHelper.js';
import { isEqual } from 'lodash';

/**
 * Get whether a course is offered in a semester
 * @param {Object} semester semester object 
 * @param {Object} courseData courseData object
 * @returns truthy if course is offered in this semester, falsy otherwise
 */
function isValidSemester(semester, courseData) {
    console.log(semester);
    console.log(courseData);
    if (semester.year % 2) {
        switch (semester.term) {
            case "Fall":
                return courseData?.semesters?.fallOdd || courseData?.semesters?.fall;
            case "Spring":
                return courseData?.semesters?.springOdd || courseData?.semesters?.spring;
            case "Summer":
                return courseData?.semesters?.summerOdd || courseData?.semesters?.summer;
        }
    } else {
        switch (semester.term) {
            case "Fall":
                return courseData?.semesters?.fallEven || courseData?.semesters?.fall;
            case "Spring":
                return courseData?.semesters?.springEven || courseData?.semesters?.spring;
            case "Summer":
                return courseData?.semesters?.summerEven || courseData?.semesters?.summer;
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
        const {schedule, allCourses} = this.props;
        return (
            <div className="Schedule">
                {schedule.map((semester, activeSemesterIndex) => 
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
                                            const courseData = allCourses?.[department]?.[code] || {};
                                            return <Grid item>
                                                <CourseTile courseData={courseData} department={department} code={code} index={index} errorMsg={getErrorMessages(schedule, activeSemesterIndex, courseData, department, code)} />
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