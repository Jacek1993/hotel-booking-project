import React, {Component} from 'react';
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
import Typography from '@material-ui/core/Typography'
import Edit from '@material-ui/icons/Edit'
import Divider from '@material-ui/core/Divider'
import { Link} from 'react-router-dom'
import { userCredentials} from '../api/api-user';
import ProfileTabs from "./ProfileTabs";


const styles = theme => ({
    root: theme.mixins.gutters({
        maxWidth: 600,
        margin: 'auto',
        padding: theme.spacing.unit * 3,
        marginTop: theme.spacing.unit * 5
    }),
    title: {
        margin: `${theme.spacing.unit * 3}px 0 ${theme.spacing.unit * 2}px`,
        color: theme.palette.protectedTitle
    },
    stripe_connect: {
        marginRight: '10px',
    },
    stripe_connected: {
        verticalAlign: 'super',
        marginRight: '10px'
    }
})

class Secret extends Component {
    constructor({match}) {
        super();
        this.state = {
            user: '',
            slug: '',
            status:false,
        };

    }

    init = (slug) => {
        console.log('this may cause error  ' + slug);
        userCredentials(slug).then(response => {
            console.log(response)
            if (!response.error) {
                this.setState({user: response});
                console.log('After init')
            }

        })

        console.log(JSON.stringify(this.state.user));


    }

    componentDidMount(){
        this.setState({slug: this.props.match.url});

    }

    componentWillReceiveProps(props) {
        if (this.state.slug) {
            this.init(this.state.slug);
        }
    };

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.slug;
    }


    render() {
        const photoUrl=`/client/profile/image/${this.state.slug}`;
        const {classes} =this.props;

        return (
            <Paper className={classes.root} elevation={4}>
                <Typography type="title" className={classes.title}>
                    Profile
                </Typography>
                <List dense>
                    <ListItem>
                        {
                             <ListItemAvatar>

                                < Avatar src={photoUrl} className={classes.bigAvatar}/>

                            </ListItemAvatar>
                        }
                        <ListItemText primary={this.state.user.name} secondary={this.state.user.email}/>

                             (<ListItemSecondaryAction>
                                <Link to={`/user/edit/${this.state.slug}`}>
                                    <IconButton aria-label="Edit" color="primary">
                                        <Edit/>
                                    </IconButton>
                                </Link>
                                {/*<DeleteUser userId={this.state.user._id}/>*/}
                            </ListItemSecondaryAction>)
                            {/*// : (<FollowProfileButton following={this.state.following} onButtonClick={this.clickFollowButton}/>)*/}

                    </ListItem>
                    <Divider/>
                </List>
                <ProfileTabs  slug={this.state.slug} reservation={this.state.user.reservation}/>
            </Paper>
        )

    }
}

Secret.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Secret)
