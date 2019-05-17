import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import List, {ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText} from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import Edit from 'material-ui-icons/Edit'
import Person from 'material-ui-icons/Person'
import Divider from 'material-ui/Divider'
import {Redirect, Link} from 'react-router-dom'
import {isAuthenticated} from './api/auth-helper';
import {profileImage, userCredentials} from './api/api-user';


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
            image: '',
            slug: ''
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

    componentWillReceiveProps(props) {
        let param1 = Object.keys(props.match.params);
        this.setState({slug: param1[0]});
        if (this.state.slug) {
            this.init(this.state.slug);
        }
    };

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.slug;
    }


    render() {
        const {user}=this.state
        return (
            <div>
                <h1>Secret</h1>
                <p>{JSON.stringify(user)}</p>
                {
                    this.state.slug &&
                    <img src={`/client/profile/image/${this.state.slug}`} alt=""/>
                }

            </div>
        );
    }
}

export default withStyles(styles)(Secret)