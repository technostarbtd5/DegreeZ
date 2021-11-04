import logo from './logo.svg';
import './App.css';



import React from 'react';



function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        <Schedule />  

      </header>
    </div>
  );
}

export default App;













class CourseContents extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        visible: false,
        name: props.name,
        code: props.code,
        desc: props.desc
      }
  }

  render() {
      return (
        <label className="course-contents">
          <ol class="course-contents">
            <li>Name: {this.props.name}</li>
            <li>Code: {this.props.code}</li>
            <li>Description: {this.props.desc}</li>
          </ol>
        </label>
      );
  }
}

class MinimalCourse extends React.Component {
  constructor(props) {
      super(props);
      this.state = {}
  }

  render() {
      return (
        <button className="course-button" onMouseEnter={this.props.showContents} onMouseLeave={this.props.hideContents}>
          {this.props.name}
        </button>
      );
  }
}

class Course extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        contents_visible: false
      }
      this.showContents = this.showContents.bind(this);
      this.hideContents = this.hideContents.bind(this);
  }

  showContents() {
    this.setState({contents_visible: true});
  }

  hideContents() {
    this.setState({contents_visible: false});
  }

  render() {
      if (this.state.contents_visible) {
        return (
          <div className="course">
            <MinimalCourse name={this.props.name} showContents={this.showContents} hideContents={this.hideContents} />
            <CourseContents name={this.props.name} code={this.props.code} desc={this.props.desc} />
          </div>
        );
      }
      return (
        <div className="course">
          <MinimalCourse name={this.props.name} showContents={this.showContents} hideContents={this.hideContents} />
        </div>
      );
  }
}



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
      for (var i = 0; i < course_list.length; i++){
        let next = course_list.at(i);
        courses.push(<Course name={next.name} code={next.code} desc={next.desc} />  );
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
            {this.props.term+"\n"+this.props.year}
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
      for (var i = 0; i < semester_list.length; i++){
        let next = semester_list.at(i);
        semesters.push(<Semester term={next.term} year={next.year} />  );
      }
      return (
        <div className="schedule">
          {semesters}
        </div>
      );
  }
}