import React, { Component } from 'react';
import { Drawer, Accordion, AccordionSummary, AccordionDetails, Grid } from '@material-ui/core';
import { cloneDeepWith, some } from 'lodash';
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

function CourseTileFromCode(props) {
    const {department, code, index, reqName} = props;
    return <CourseTile code={`${department} ${code}`} reqName={reqName} index={index}/>
}

function Requirement(props) {
    const classes = useStyles();
    const {requirement, courses} = props;
    const {department, code} = requirement;
    const requirementInCourses = some(courses, {department, code});
    //console.log(requirementInCourses);
    if (requirementInCourses) {
        //console.log(courses);
        //console.log({department, code});
    }
    if (isCourse(requirement)) {
        if (requirement.requirementName) {
            return <Accordion className = {classes.drawer}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Typography>{requirement.requirementName}{requirement.optional && " (optional)"}:</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {!requirementInCourses && <CourseTileFromCode department={requirement.department} code={requirement.code} reqName={props.reqName} index={props.index}/>}
                </AccordionDetails>
            </Accordion>
        } else {
            return requirementInCourses ? <></> : <CourseTileFromCode department={requirement.department} code={requirement.code} reqName={props.reqName} index={props.index}/>
        }
    } else {
        const requirementComplete = checkCompletion(requirement, courses);
        const requirementStarted = getLeaves(requirement).filter(course => some(courses, {department: course.department, code: course.code})).length > 0;
        return <Accordion className = {classes.drawer}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
            >
                {requirementComplete ? <CheckIcon className={classes.iconComplete} /> : (
                    requirementStarted ? 
                    <DonutLargeIcon className={classes.iconInProgress} /> :
                    <CloseIcon className={classes.iconNotStarted} />
                )}
                <Typography>{requirement.requirementName}{requirement.optional && " (optional)"}:{requirement.nOf && requirement.n && ` ${requirement.n} of:`}{requirement.allOf && " All of:"}</Typography>
            </AccordionSummary>
            <AccordionDetails>

                <Droppable droppableId={`sidebar-${requirement.requirementName}`} isDropDisabled={!requirement.dropEnabled} direction="vertical">
                    {(provided, snapshot) =>
                        <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        >

                        <Grid>
                            {getRequirements(requirement).map((subReq,index) => <Requirement requirement={subReq} courses={courses} reqName={requirement.requirementName} index={index} />)}
                        </Grid>

                        {provided.placeholder}

                        </div>}
                </Droppable>

            </AccordionDetails>
        </Accordion>
    }
}

console.log(CSCI);

export default function PermanentDrawer() {
const classes = useStyles() 
  return (
    <div>
        <Drawer
        className = {classes.drawer}
        variant = "permanent"
        anchor = "right">
            <div>
            
                {/* <Typography align="center" variant="h6">Classes    List:</Typography>
                <CourseTile name={"Computer Science I"} desc={"An introduction to computer programming ..."} code={"CSCI1100"}/>
                <CourseTile name={"Data Structures"} desc={"Programming concepts: functions, parameter passing, ..."} code={"CSCI1200"}/>
                <CourseTile name={"Calculus 1"} desc={"Functions, limits, continuity, derivatives, ..."} code={"MATH1010"}/>
                <CourseTile name={"Calculus 2"} desc={"Techniques and applications of integration, polar coordinates."} code={"MATH1020"}/> */}
                <Requirement requirement={CSCI} courses={[{department: "CSCI", code: "1200"}, {department: "CSCI", code: "4020"}, {department: "CSCI", code: "4030"}, {department: "CSCI", code: "4040"}, {department: "CSCI", code: "4440"}]} />
            </div>
        </Drawer>
    </div>
  );
}
