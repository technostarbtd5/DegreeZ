import React, {Component} from 'react';
import { Draggable } from 'react-beautiful-dnd';
import {Card, CardContent, CardActions, IconButton, Typography, Collapse, Tooltip} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { withStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import { isEqual } from 'lodash';
import clsx from  'clsx';
import { requirementToStringArray } from '../../Shared/RequirementHelper';


const styles = theme => ({
    centered: {
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    tile: {
        width: 240,
        margin: 10,
    },
    error: {
        backgroundColor: red[50],
        boxShadow: `0 0 5px ${red[700]}`
    },
    requirement: {
        whiteSpace: 'pre'
    }
});

/**
 * CourseTile is an object that holds all relevant information about a class.
 * Course data read in from Courses.json
 * This class also holds the rendering of this information in a material UI card 
 * CourseTiles are draggable between the sidebar and the current schedule. 
 */
class CourseTile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contentsVisible: false
        }
        this.setContentsVisible = this.setContentsVisible.bind(this);
    }

    setContentsVisible(visible) {
        this.setState({ contentsVisible: visible });
    }

    render() {
        const {courseData, department, code, index, reqName, errorMsg, classes} = this.props;
        const {name, desc, credits, semesters, prereqs, coreqs} = courseData;
        const {contentsVisible} = this.state;

        const prerequisites = !isEqual(prereqs, {}) && prereqs;
        const corequisites = !isEqual(prereqs, {}) && coreqs;

        // This block of code takes the list of offered semesters and converts it into a readable string
        let offeredSemesters = '';
        if(!!semesters) {
            const semesterList = ['Fall', 'Spring', 'Summer'];
            for(let i = 0; i < semesterList.length; i++) {
                const lowerSem = semesterList[i].toLowerCase();
                const evenSem = lowerSem + 'Even';
                const oddSem = lowerSem + 'Odd';
                if(!!semesters[evenSem] && !!semesters[oddSem]) {
                    offeredSemesters = offeredSemesters.concat('', semesterList[i] + ', ');
                } else {
                    if(!!semesters[evenSem]) {
                        offeredSemesters = offeredSemesters.concat('', semesterList[i] + ' (even years), ');
                    } else if(!!semesters[oddSem]) {
                        offeredSemesters = offeredSemesters.concat('', semesterList[i] + ' (odd years), ');
                    }
                }
            }
            if(offeredSemesters.length > 0) {
                offeredSemesters = offeredSemesters.substr(0, offeredSemesters.length-2);
            }
        }

        return (
            <Draggable key={`${department}-${code}-${reqName}`} draggableId={`${department}-${code}-${reqName}`} index={index}>
                {(provided, snapshot) =>
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        {
                            (() => {
                                const content = <Card className={errorMsg ? clsx(classes.error, classes.tile) : clsx(classes.tile)}>
                                    <CardContent>
                                        <Typography align='center' variant='h6'>{`${department} ${code}`}</Typography>
                                        <Typography align='center'>{name}</Typography>
                                    </CardContent>
                                    <Collapse in={contentsVisible} timeout='auto' unmountOnExit>
                                        <Typography align='center'>{!!desc ? desc : '???'}</Typography>
                                        <br></br>
                                        <Typography align='center'>When Offered: {!!semesters ? offeredSemesters : '???'}</Typography>
                                        <br></br>
                                        <Typography align='center'>Credit Hours: {!!credits ? credits : '???'}</Typography>
                                        {prerequisites && 
                                            <>
                                                <Typography align='center'>Prerequisites:</Typography>
                                                {requirementToStringArray(prerequisites).map(reqString => <Typography className={classes.requirement}>{reqString}</Typography>)}
                                            </>
                                        }
                                        {corequisites && 
                                            <>
                                                <Typography align='center'>Corequisites:</Typography>
                                                {requirementToStringArray(corequisites).map(reqString => <Typography className={classes.requirement}>{reqString}</Typography>)}
                                            </>
                                        }
                                    </Collapse>
                                    <CardActions>
                                        <IconButton 
                                            className={classes.centered}
                                            onClick={() => this.setContentsVisible(!contentsVisible)}
                                        >
                                            {contentsVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        </IconButton>
                                    </CardActions>
                                </Card>
                                if(errorMsg) {
                                    return <Tooltip title={errorMsg}>
                                        {content}
                                    </Tooltip>
                                } else {
                                    return content;
                                }
                            })()
                        }

                    </div>
                }
            </Draggable>
        )
    }
}


export default withStyles(styles)(CourseTile);