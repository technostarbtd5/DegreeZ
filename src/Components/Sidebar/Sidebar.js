import React from 'react';
import { Drawer, Accordion, AccordionSummary, AccordionDetails, Grid, Tooltip } from '@material-ui/core';
import { some } from 'lodash';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CheckIcon from '@material-ui/icons/Check';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import CloseIcon from '@material-ui/icons/Close';
import { red, yellow, green } from '@material-ui/core/colors';
import { checkCompletion, isCourse, getRequirements, getLeaves } from '../../Shared/RequirementHelper';
import CSCI from "../../Data/CSCI.json";

import { Droppable } from "react-beautiful-dnd";

import { makeStyles, Typography } from '@material-ui/core';
import CourseTile from '../Course/CourseTile';
/**
 * Helper for styling and use of the sidebar for degree requirements and courses.
 */
const drawerWidth = 480
const useStyles = makeStyles({
    drawer:{
        width: drawerWidth
    },
    drawerPaper:{
        width: drawerWidth
    },
    iconNotStarted: {
        color: red[700]
    },
    iconInProgress: {
        color: yellow[600]
    },
    iconComplete: {
        color: green[600]
    }

})


/**
 * Helper function for displaying degree requirements in the sidebar,
 */
function Requirement(props) {
    const classes = useStyles();
    const {requirement, courses, allCourses} = props;
    const {department, code} = requirement;

    if (isCourse(requirement)) {
        const requirementInCourses = some(courses, {department, code});
        const courseData = allCourses?.[department]?.[code] || {};

        if (requirement.requirementName) {
            return <Accordion className = {classes.drawerPaper}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Typography>{requirement.requirementName}{requirement.optional && " (optional)"}:</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {!requirementInCourses && <CourseTile courseData={courseData} department={requirement.department} code={requirement.code} index={props.index} reqName={props.reqName}/>}
                </AccordionDetails>
            </Accordion>
        } else {
            return requirementInCourses ? <></> : <CourseTile courseData={courseData} department={requirement.department} code={requirement.code} index={props.index} reqName={props.reqName}/>
        }

    } else {
        const requirementComplete = checkCompletion(requirement, courses);
        const requirementStarted = getLeaves(requirement).filter(course => some(courses, {department: course.department, code: course.code})).length > 0;

        return <Accordion className = {classes.drawer}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
            >
                {requirementComplete ? 
                    <Tooltip title="Requirement complete">
                        <CheckIcon className={classes.iconComplete} />
                    </Tooltip>
                 : (
                    requirementStarted ? 
                    <Tooltip title="Requirement in progress">
                        <DonutLargeIcon className={classes.iconInProgress} />
                    </Tooltip> :
                    <Tooltip title="Requirement not started">
                        <CloseIcon className={classes.iconNotStarted} />
                    </Tooltip>
                )}
                <Typography>{requirement.requirementName}{requirement.optional && " (optional)"}:{(requirement.nOf && requirement.n && ` ${requirement.n} of:`) || false}{requirement.allOf && " All of:"}</Typography>
            </AccordionSummary>
            <AccordionDetails>

                <Grid>
                    {getRequirements(requirement).map((subReq,index) => <Requirement requirement={subReq} courses={courses} allCourses={allCourses} reqName={requirement.requirementName} index={index} />)}
                </Grid>

            </AccordionDetails>
        </Accordion>

    }
}

/**
 * Function for creating the right drawer or sidebar used to house degree requirements and 
 * classes to choose from to fill said requirements.
 */
export default function PermanentDrawer(props) {
    const classes = useStyles();
    const {courses, allCourses} = props;
    const freeElectiveRequirement = {
        "nOf": Object.entries(allCourses)?.map(([department, deptCourses]) => 
            Object.keys(deptCourses)?.map(code => ({department, code})) ?? []
        )?.flat() ?? [],
        "n": 0,
        "requirementName": "Free Electives",
        "optional": true,
    }
    return (
        <Drawer
        className = {classes.drawer}
        variant = "permanent"
        anchor = "right">

            <Droppable key={`sidebar`} droppableId={`sidebar`} direction="vertical">
                {(provided, snapshot) =>
                    <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    >
                    
                    <Requirement requirement={CSCI} courses={courses} allCourses={allCourses} />
                    <Requirement requirement={freeElectiveRequirement} courses={courses} allCourses={allCourses} />

                    {provided.placeholder}

                    </div>}
            </Droppable>

        </Drawer>
    );
}
