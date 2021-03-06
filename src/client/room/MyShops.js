import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import {Redirect, Link} from 'react-router-dom'
import {loadRoom} from '../api/api-room'
import CardMedia from "@material-ui/core/CardMedia/CardMedia";
import Photo from '@material-ui/icons/Photo'
import DeleteRoom from "./DeleteRoom";
import Edit from '@material-ui/icons/Edit'
import {convertImageUrl} from "../api/utils";
import {config} from '../../config/clientConfig'
// import DeleteShop from './DeleteShop'

const styles = theme => ({
    root: theme.mixins.gutters({
        maxWidth: 600,
        margin: 'auto',
        padding: theme.spacing.unit * 3,
        marginTop: theme.spacing.unit * 5
    }),
    title: {
        margin: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 3}px ${theme.spacing.unit}px`,
        color: theme.palette.protectedTitle,
        fontSize: '1.2em'
    },
    addButton: {
        float: 'right'
    },
    leftIcon: {
        marginRight: "8px"
    },
    cover: {
        width: 110,
        height: 100,
        margin: '8px'
    }
})

class MyShops extends Component {
    state = {
        rooms: [],
        redirectToSignIn: false
    }

    loadRooms = () => {
        loadRoom().then(response => {
            if (response.error) {
                this.setState({redirectToSignIn: true})
                console.log(response.error)
            } else {
                this.setState({rooms: response})
                console.log(response)
            }
        })
    }
    removeRoom = (room) => {
        const updatedRooms=this.state.rooms;
        const index=updatedRooms.indexOf(room);
        updatedRooms.splice(index,1);
        this.setState({rooms: updatedRooms});
    }

    componentDidMount = () => {
        this.loadRooms()
    }

    render() {
        const {classes} = this.props
        const redirectToSignIn = this.state.redirectToSignIn
        if (redirectToSignIn) {
            return <Redirect to='/signin'/>
        }
        return (
            <div>
                <Paper className={classes.root} elevation={4}>
                    <Typography type="title" className={classes.title}>
                        Your Rooms
                        <span className={classes.addButton}>
                            <Link to="/user/room/new">
                             <Button color="primary" variant="raised">
                                 <Icon className={classes.leftIcon}>add_box</Icon>  New Room
                            </Button>
                             </Link>
                         </span>
                    </Typography>
                    <List dense>
                        {this.state.rooms
                        && (this.state.rooms.map((room, i) => {
                                return <span key={i}>

                     <ListItem>
                    <CardMedia
                        className={classes.cover}
                        image={`${config.imageURL}/${convertImageUrl(room.picture[0])}`}
                        title={room.roomNumber}/>
                     <div className={classes.details}>
                         <Typography type="headline" component="h2" color="primary" className={classes.title}>
                        {room.description[0]}
                        </Typography>
                        <Typography type="subheading" component="h4" className={classes.subheading}>
                        Person Amount: {room.personAmount} | Price: ${room.pricing.retail}
                         </Typography>
                     </div>
                         <ListItemSecondaryAction>
                             <Link to={`/user/room/images/${room.slug}`}>
                                 <IconButton aria-label="Edit" color="primary">
                                     <Photo/>
                                 </IconButton>
                             </Link>
                            <Link to={`/admin/room/${room.slug}/reservation/${(new Date()).toISOString()}`}>
                             <IconButton aria-label="Edit" color="primary">
                                    <Edit/>
                             </IconButton>
                             </Link>
                             <DeleteRoom room={room} onRemove={this.removeRoom} slug={room.slug}/>
                         </ListItemSecondaryAction>
                     </ListItem>
                                    <Divider/>
            </span>
                            })
                        )}
                    </List>
                </Paper>
            </div>)
    }
}

MyShops.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(MyShops)

