import React, {Component} from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import HomeIcon from '@material-ui/icons/Home'
import Button from '@material-ui/core/Button'
import {Link, withRouter} from 'react-router-dom'
import {signOut} from "../api/api-user";
import PropTypes from 'prop-types';
import {isAuthenticated} from '../api/auth-helper'

const isActive = (history, path) => {
    if (history.location.pathname === path)
        return {color: '#ff4081'}
    else
        return {color: '#ffffff'}
}


class MenuShow extends Component {

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            status: false,
            slug: '',
            role: 'user'
        }
    }

    componentDidMount() {
        isAuthenticated(this);
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
        if (nextProps.slug !== '') {
            const slug = nextProps.slug;
            this.setState({slug: nextProps.slug})
            this.setState({status: true})
            this.setState({role: nextProps.role})
        }
        console.log(this.state.slug);
    }

    //this function prevents from changing state if it is empty because react renders complete DOM tree for any changes
    shouldComponentUpdate(nextProps, nextState) {
        return this.state.status
    }

    submit = () => {
        signOut().then(response => {
            if (!response.error) {

            }
        })
        this.setState({status: false})
        this.forceUpdate()
    };


    render() {
        return (
            <AppBar position="static">
                <Toolbar>
                    <Typography type="title" color="inherit">
                        MERN Skeleton
                    </Typography>
                    <Link to="/">
                        <IconButton aria-label="Home" style={isActive(this.props.history, '/')}>
                            <HomeIcon/>
                        </IconButton>
                    </Link>
                    <Link to="/users">
                        <Button style={isActive(this.props.history, '/users')}>Users</Button>
                    </Link>
                    <div style={{'position': 'absolute', 'right': '10px'}}><span style={{'float': 'right'}}>
                    {
                        !this.state.status && (<span>
          <Link to="/signup">
            <Button style={isActive(this.props.history, '/signup')}>Sign up
            </Button>
          </Link>
          <Link to="/signin">
            <Button style={isActive(this.props.history, '/signin')}>Sign In
            </Button>
          </Link>

        </span>)
                    }
                        {
                            this.state.role === 'admin'
                            && (
                                <span>
                                    <Link  to="/user/rooms">
                                    <Button color="inherit" style={isActive(this.props.history, '/user/rooms')}>
                                        Admin things
                                    </Button>
                                    </Link>
                                </span>
                            )
                        }
                        {
                            this.state.status
                            && (<span>
                                  <Button color="inherit" onClick={() => {
                                      this.submit();
                                      this.props.history.push('/');
                                  }}>Sign out</Button>
                                  <Link to={`/secret/${this.state.slug}`}>
                            <Button style={isActive(this.props.history, "/signin")}>Secret
                            </Button>
                            </Link>
                                </span>)
                        }
                    </span></div>
                </Toolbar>
            </AppBar>
        )
    }
}

const Menu = withRouter(MenuShow);

export default Menu;



