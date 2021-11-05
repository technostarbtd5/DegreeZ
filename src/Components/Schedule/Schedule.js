import { Grid, Typography } from '@material-ui/core';
import React, {Component} from 'react';
import CourseTile from '../Course/CourseTile.js';

const DUMMY_SCHEDULE = [
    {
        term: "Fall",
        year: "2019",
        courses: [
            {
                department: "CSCI",
                code: "1100",
            },
            {
                department: "CSCI",
                code: "1200",
            },
        ],
    },
    {
        term: "Spring",
        year: "2020",
        courses: [
            {
                department: "CSCI",
                code: "1100",
            },
            {
                department: "CSCI",
                code: "1200",
            },
        ],
    },
    {
        term: "Summer",
        year: "2020",
        courses: [
            {
                department: "CSCI",
                code: "1100",
            },
            {
                department: "CSCI",
                code: "1200",
            },
        ],
    },
    {
        term: "Fall",
        year: "2020",
        courses: [
            {
                department: "CSCI",
                code: "1100",
            },
            {
                department: "CSCI",
                code: "1200",
            },
        ],
    },
    {
        term: "Spring",
        year: "2021",
        courses: [
            {
                department: "CSCI",
                code: "1100",
            },
            {
                department: "CSCI",
                code: "1200",
            },
        ],
    },
    {
        term: "Summer",
        year: "2021",
        courses: [
            {
                department: "CSCI",
                code: "1100",
            },
            {
                department: "CSCI",
                code: "1200",
            },
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

class Schedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schedule: DUMMY_SCHEDULE,
        }
    }

    render() {
        const {schedule} = this.state;
        const allCourses = DUMMY_COURSE_LIST;
        return (
            <>
                {schedule.map(semester => 
                    <Grid container>
                        <Grid item xs={2}>
                            <Typography variant="h5">
                                {semester.term} {semester.year}
                            </Typography>
                        </Grid>
                        <Grid item xs={10}>
                            <Grid container justifyContent="space-evenly">
                                {semester.courses?.map(course => {
                                    const {department, code} = course;
                                    const courseString = `${department} ${code}`;
                                    const {name, desc} = allCourses?.[department]?.[code] || {};
                                    return <Grid item>
                                        <CourseTile name={name} desc={desc} code={courseString}/>
                                    </Grid>
                                })}
                            </Grid>
                        </Grid>
                        
                    </Grid>
                )}
            </>
        )
    }
}

export default Schedule