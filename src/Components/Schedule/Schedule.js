import React from 'react';
import Course from './../Course/Course.js';

let semester_list = [
    {
        term: "Fall",
        year: "2019"
    },
    {
        term: "Spring",
        year: "2020"
    },
    {
        term: "Summer",
        year: "2020"
    },
    {
        term: "Fall",
        year: "2020"
    },
    {
        term: "Spring",
        year: "2021"
    },
    {
        term: "Summer",
        year: "2021"
    }
]

let course_list = [
    {
        name: "Computer Science I",
        code: "CSCI-1100",
        desc: "An introduction to computer programming ..."
    },
    {
        name: "Data Structures",
        code: "CSCI-1200",
        desc: "Programming concepts: functions, parameter passing, ..."
    }
]



class SemesterCourses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        var courses = [];
        for (var i = 0; i < course_list.length; i++) {
            let next = course_list.at(i);
            courses.push(<Course name={next.name} code={next.code} desc={next.desc} />);
        }
        return (
            <div className="semester-courses">
                {courses}
            </div>
        );
    }
}

class Semester extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className="semester">
                <div className="semester-name">
                    {this.props.term + "\n" + this.props.year}
                </div>
                <SemesterCourses term={this.props.term} year={this.props.year} />
            </div>
        );
    }
}




class Schedule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        var semesters = [];
        for (var i = 0; i < semester_list.length; i++) {
            let next = semester_list.at(i);
            semesters.push(<Semester term={next.term} year={next.year} />);
        }
        return (
            <div className="schedule">
                {semesters}
            </div>
        );
    }
}

export default Schedule