//import { Grid, Typography } from '@material-ui/core';
import React, {Component} from 'react';

const DUMMY_MAJORS_LIST = {
    "CSCI": ["1100", "1200"]
}

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

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            majors: DUMMY_MAJORS_LIST,
            courses: DUMMY_COURSE_LIST,
        }
    }

    getAllCourses() {
        // TODO
    }

    getMajorCourses(major) {
        // TODO
    }

    getCourse(course) {
        // TODO
    }

    render() {
        return (
            <div className="Sidebar">
                
            </div>
        )
    }
}


export default Sidebar