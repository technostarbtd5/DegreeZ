import React, {Component} from 'react';
import {Card, CardContent, CardActions, IconButton, Typography, Collapse} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { withStyles } from '@material-ui/core/styles';
import { Draggable } from "react-beautiful-dnd";

const styles = theme => ({
    centered: {
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    tile: {
        width: 240,
        margin: 10,
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
        const {courseData, department, code, index, reqName, classes} = this.props;
        const {name, desc, credits, semesters, prereqs} = courseData;
        const {contents_visible} = this.state;

        var offered_semesters = "";
        if (!!semesters) {
            const semester_list = ["Fall", "Spring", "Summer"];
            for (var i = 0; i < semester_list.length; i++) {
                var lower_sem = semester_list[i].toLowerCase();
                var even_sem = lower_sem + "Even";
                var odd_sem = lower_sem + "Odd";
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
                        
                        <Card className={classes.tile}>
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

                    </div>
                }
            </Draggable>
        )
    }
}

export default withStyles(styles)(CourseTile);