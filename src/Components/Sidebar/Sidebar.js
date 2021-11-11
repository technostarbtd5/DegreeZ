import * as React from 'react';
import Drawer from '@material-ui/core/Drawer';

import { makeStyles, Typography } from '@material-ui/core';
import CourseTile from '../Course/CourseTile';
const drawerWidth = 480
const useStyles = makeStyles({
    drawer:{
        width: drawerWidth

    },
    drawerPaper:{
        width: drawerWidth

    }
})





export default function PermanentDrawer() {
const classes = useStyles() 
  return (
    <div>
        <Drawer
        className = {classes.drawer}
        variant = "permanent"
        anchor = "right">
            <div>
              
                <Typography align="center" variant="h6">Classes    List:</Typography>
                <CourseTile name={"Computer Science I"} desc={"An introduction to computer programming ..."} code={"CSCI1100"}/>
                <CourseTile name={"Data Structures"} desc={"Programming concepts: functions, parameter passing, ..."} code={"CSCI1200"}/>
                <CourseTile name={"Calculus 1"} desc={"Functions, limits, continuity, derivatives, ..."} code={"MATH1010"}/>
                <CourseTile name={"Calculus 2"} desc={"Techniques and applications of integration, polar coordinates."} code={"MATH1020"}/>
            </div>
        </Drawer>
    </div>
  );
}
