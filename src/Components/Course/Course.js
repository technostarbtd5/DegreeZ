import React, {Component} from 'react';
import {Card, CardContent, CardActions, IconButton} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    expand: {
        // transform: 'rotate(0deg)',
        marginLeft: 'auto',
        marginRight: 'auto',
        // transition: theme.transitions.create('transform', {
        //   duration: theme.transitions.duration.shortest,
        // }),
      },
    //   expandOpen: {
    //     transform: 'rotate(180deg)',
    //   },
});

class CourseContents extends Component {
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

class MinimalCourse extends Component {
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

class Course extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contents_visible: false
        }
        this.setContentsVisible = this.setContentsVisible.bind(this);
    }

    // showContents() {
    //     this.setState({ contents_visible: true });
    // }

    // hideContents() {
    //     this.setState({ contents_visible: false });
    // }
    setContentsVisible(visible) {
        this.setState({ contents_visible: visible });
    }

    render() {
        // if (this.state.contents_visible) {
        //     return (
        //         <div className="course">
        //             <MinimalCourse name={this.props.name} showContents={this.showContents} hideContents={this.hideContents} />
        //             <CourseContents name={this.props.name} code={this.props.code} desc={this.props.desc} />
        //         </div>
        //     );
        // }
        // return (
        //     <div className="course">
        //         <MinimalCourse name={this.props.name} showContents={this.showContents} hideContents={this.hideContents} />
        //     </div>
        // );
        const {name, code, desc, classes} = this.props;
        const {contents_visible} = this.state;
        return (
            <Card>
                <CardContent>
                <MinimalCourse name={name} showContents={() => false} hideContents={() => false} />
                </CardContent>
                <CardActions>
                    <IconButton 
                        className={classes.expand}
                        onClick={() => this.setContentsVisible(!contents_visible)}
                    >
                        {contents_visible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                </CardActions>
            </Card>
        )
    }
}

export default withStyles(styles)(Course);