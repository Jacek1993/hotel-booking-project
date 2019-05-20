import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Edit from '@material-ui/icons/Edit'
import Divider from '@material-ui/core/Divider'
import {Redirect, Link} from 'react-router-dom'
import {loadRoom} from '../api/api-room'
import CardMedia from "@material-ui/core/CardMedia/CardMedia";
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
    removeShop = (shop) => {
        console.log('removeRoom')
    }

    convertImageUrl = (url) => {
        if (url === undefined) {
            return url
        }
        let convertedUrl = url.split('/');
        return convertedUrl[convertedUrl.length - 1];
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
                            <Link to="/seller/shop/new">
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
                        image={`/room/image/${this.convertImageUrl(room.picture[0])}`}
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
                            <Link to={`/room/${room.slug}`}>
                             <IconButton aria-label="Edit" color="primary">
                                 <Edit/>
                             </IconButton>
                            </Link>
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

