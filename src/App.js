import logo from './logo.svg';
import './App.css';



import React from 'react';

class CourseContents extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        name: props.name,
        code: props.code,
        desc: props.desc
      }
  }

  render() {
      return (
        <div className="course-contents">
          <li>Name: this.props.name</li>
          <li>Course Code: this.props.code</li>
          <li>Description: this.props.desc</li>
        </div>
      );
  }
}

class Course extends React.Component {
  constructor(props) {
      super(props);
      <CourseContents name={this.props.name} code={this.props.code} desc={this.props.desc} />
      this.state = {
        name: props.name
      }
  }

  showContents() {
  }

  hideContents() {

  }

  render() {
      return (
        <button className="course" onMouseOver={() => this.showContents()}>
          {this.state.name}
        </button>
      );
  }
}



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
        <Course name="Computer Science I" code="CSCI-1100" desc="An introduction to computer programming ..." />  
      </header>
    </div>
  );
}

export default App;
