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
import Badge from "@material-ui/core/Badge/Badge";
import CartIcon from '@material-ui/icons/ShoppingCart'
import cart from '../cart/cart-helper'

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
            slug: '',
            role: 'user',
            redirectToHome: false
        }
        this.submit = this.submit.bind(this)
    }

    componentDidMount() {
        isAuthenticated(this);

    }

    submit = () => {
        signOut().then(response => {
            if (!response.error) {
                this.setState({redirectToHome: true})
            }
        })
        cart.emptyCart(()=>this.setState({status: false}));
        localStorage.removeItem('logIn')
    };


    render() {

        if (this.state.redirectToHome) {
            this.setState({redirectToHome: false})
        }

        return (
            <AppBar position="static">
                <Toolbar>
                    <Typography type="title" color="inherit">
                        Hotel Booking App
                    </Typography>
                    <Link to="/">
                        <IconButton aria-label="Home" style={isActive(this.props.history, '/')}>
                            <HomeIcon/>
                        </IconButton>
                    </Link>
                    {
                        localStorage.getItem('logIn')!==null && (
                            <span>
                                <Link to={`/cart`}>
                                    <Button style={isActive(this.props.history, `/cart`)}>
                                        Cart
                                     <Badge color="secondary" badgeContent={cart.itemTotal()} style={{'marginLeft': '7px'}}>
                                         <CartIcon/>
                                     </Badge>
                                    </Button>
                                </Link>
                            </span>
                        )
                    }
                    <div style={{'position': 'absolute', 'right': '10px'}}><span style={{'float': 'right'}}>
                    {
                        localStorage.getItem('logIn')===null && (<span>
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
                            this.state.role === 'admin' &&   localStorage.getItem('logIn')!==null
                            && (
                                <span>
                                    <Link to="/user/rooms">
                                    <Button color="inherit" style={isActive(this.props.history, '/user/rooms')}>
                                        Admin things
                                    </Button>
                                    </Link>
                                </span>
                            )
                        }
                        {
                            localStorage.getItem('logIn')!==null
                            && (<span>
                                <Link to={`/`}>
                                  <Button style={isActive(this.props.history, "/")} color="inherit" onClick={() => {
                                      this.submit();
                                  }}>Sign out</Button></Link>
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



