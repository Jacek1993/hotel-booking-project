import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import {config} from '../../config/clientConfig'
import PropTypes from 'prop-types'


const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: 500,
        height: 450,
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
});

 const ImageDisplay=(props)=> {
    const classes = props;

    return (
        <div className={classes.root}>
            <GridList cellHeight={180} className={classes.gridList}>
                <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
                    <ListSubheader component="div">Room Images</ListSubheader>
                </GridListTile>
                {props.picture.map((content, i)=> (
                    <GridListTile key={i}>
                        <img src={`${config.imageURL}/${content}`} alt={content} />
                    <GridListTileBar
                    title={content}
                    actionIcon={
                        <IconButton className={classes.icon} onClick={(e)=>{props.removePicture(content)}}>
                            <Delete/>
                        </IconButton>
                    }/>
                    </GridListTile>
                ))}
            </GridList>
        </div>
    );
}



export default withStyles(styles)(ImageDisplay);