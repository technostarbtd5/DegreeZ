import React from 'react';

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
        this.setState({ contents_visible: true });
    }

    hideContents() {
        this.setState({ contents_visible: false });
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

export default Course