import React, {Component} from 'react'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import HomeIcon from 'material-ui-icons/Home'
import Button from 'material-ui/Button'
import {isAuthenticated} from '../usr/api/auth-helper';
import {Link, withRouter} from 'react-router-dom'
import {signOut} from "../usr/api/api-user";
import PropTypes from 'prop-types';

const isActive = (history, path) => {
    if (history.location.pathname === path)
        return {color: '#ff4081'}
    else
        return {color: '#ffffff'}
}

const submit = () => {
    signOut().then(response => {
        if (!response.error) {

        }
    })
};


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
            slug: ''
        }
    }

    componentDidMount() {

       isAuthenticated(this);

    }

    componentWillReceiveProps(nextProps){
        console.log(nextProps)
        if(nextProps.slug!=='') {
            const slug=nextProps.slug;
            this.setState({slug: nextProps.slug})
        }
        console.log(this.state.slug);
    }

    //this function prevents from changing state if it is empty because react renders complete DOM tree for any changes
    shouldComponentUpdate(nextProps, nextState){
        return !!nextProps.slug;
    }



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
                        <Button style={isActive(this.props.history,'/users')}>Users</Button>
                    </Link>
                    <div style={{'position':'absolute', 'right': '10px'}}><span style={{'float': 'right'}}>
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
                        this.state.status
                        && (<span>
                                  <Button color="inherit" onClick={() => {
                                      submit();
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



