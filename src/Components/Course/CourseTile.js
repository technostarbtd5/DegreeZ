import React, {Component} from 'react';
import {Card, CardContent, CardActions, IconButton, Typography, Collapse, Tooltip} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { withStyles } from '@material-ui/core/styles';
import { Draggable } from "react-beautiful-dnd";
import { red } from '@material-ui/core/colors';
import clsx from  'clsx';
import { requirementToStringArray } from '../../Shared/RequirementHelper';
import { isEqual } from 'lodash';

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
        whiteSpace: "pre"
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
            contents_visible: false
        }
        this.setContentsVisible = this.setContentsVisible.bind(this);
    }

    setContentsVisible(visible) {
        this.setState({ contents_visible: visible });
    }

    render() {
        const {courseData, department, code, index, reqName, errorMsg, classes} = this.props;
        const {name, desc, credits, semesters, prereqs, coreqs} = courseData;
        const {contents_visible} = this.state;

        const prerequisites = !isEqual(prereqs, {}) && prereqs;
        const corequisites = !isEqual(prereqs, {}) && coreqs;

        let offered_semesters = "";
        if (!!semesters) {
            const semester_list = ["Fall", "Spring", "Summer"];
            for (let i = 0; i < semester_list.length; i++) {
                const lower_sem = semester_list[i].toLowerCase();
                const even_sem = lower_sem + "Even";
                const odd_sem = lower_sem + "Odd";
                if(!!semesters[even_sem] && !!semesters[odd_sem]) {
                    offered_semesters = offered_semesters.concat('', semester_list[i] + ", ");
                } else {
                    if(!!semesters[even_sem]){
                        offered_semesters = offered_semesters.concat('', semester_list[i] + " (even years), ");
                    }else if(!!semesters[odd_sem]) {
                        offered_semesters = offered_semesters.concat('', semester_list[i] + " (odd years), ");
                    }
                }
            }
            if(offered_semesters.length > 0){
                offered_semesters = offered_semesters.substr(0, offered_semesters.length-2);
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
                                        <Typography align="center" variant="h6">{`${department} ${code}`}</Typography>
                                        <Typography align="center">{name}</Typography>
                                    </CardContent>
                                    <Collapse in={contents_visible} timeout="auto" unmountOnExit>
                                        <Typography align="center">{!!desc ? desc : "???"}</Typography>
                                        <br></br>
                                        <Typography align="center">When Offered: {!!semesters ? offered_semesters : "???"}</Typography>
                                        <br></br>
                                        <Typography align="center">Credit Hours: {!!credits ? credits : "???"}</Typography>
                                        {prerequisites && 
                                            <>
                                                <Typography align="center">Prerequisites:</Typography>
                                                {requirementToStringArray(prerequisites).map(reqString => <Typography className={classes.requirement}>{reqString}</Typography>)}
                                            </>
                                        }
                                        {corequisites && 
                                            <>
                                                <Typography align="center">Corequisites:</Typography>
                                                {requirementToStringArray(corequisites).map(reqString => <Typography className={classes.requirement}>{reqString}</Typography>)}
                                            </>
                                        }
                                    </Collapse>
                                    <CardActions>
                                        <IconButton 
                                            className={classes.centered}
                                            onClick={() => this.setContentsVisible(!contents_visible)}
                                        >
                                            {contents_visible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        </IconButton>
                                    </CardActions>
                                </Card>
                                if (errorMsg) {
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