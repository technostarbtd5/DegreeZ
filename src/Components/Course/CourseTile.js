import React, {Component} from 'react';
import {Card, CardContent, CardActions, IconButton, Typography, Collapse} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    centered: {
        marginLeft: 'auto',
        marginRight: 'auto',
      },
      tile: {
          width: 180,
          margin: 10,
      }
});

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
        const {name, code, desc, classes} = this.props;
        const {contents_visible} = this.state;
        return (
            <Card className={classes.tile}>
                <CardContent>
                    <Typography align="center" variant="h6">{code}</Typography>
                    <Typography align="center">{name}</Typography>
                </CardContent>
                <Collapse in={contents_visible} timeout="auto" unmountOnExit>
                    <Typography align="center">{desc}</Typography>
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
        )
    }
}

export default withStyles(styles)(CourseTile);