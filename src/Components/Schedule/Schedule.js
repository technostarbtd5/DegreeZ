import { Grid, Typography } from '@material-ui/core';
//import { ViewCarousel } from '@material-ui/icons';
import React, {Component} from 'react';
import CourseTile from '../Course/CourseTile.js';
import { Droppable } from "react-beautiful-dnd";

class Schedule extends Component {
    /*constructor(props) {
        super(props);
        this.state = {}
    }*/

    render() {
        const {schedule, allCourses} = this.props;
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
                                            const {name, desc} = allCourses?.[department]?.[code] || {};
                                            return <Grid item>
                                                <CourseTile name={name} desc={desc} department={department} code={code} index={index}/>
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