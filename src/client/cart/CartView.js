import React, {Component} from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import cart from './cart-helper.js'
import {Link} from 'react-router-dom'
import {config} from "../../config/clientConfig";
import {convertImageUrl, getReservationSlug} from "../api/utils";
import Redirect from "react-router-dom/es/Redirect";

const styles = theme => ({
    card: {
        margin: '24px 0px 60px 0px',
        padding: '16px 40px 60px 40px',
        backgroundColor: '#80808017'
    },
    title: {
        margin: theme.spacing.unit * 2,
        color: theme.palette.openTitle,
        fontSize: '1.2em'
    },
    price: {
        color: theme.palette.text.secondary,
        display: 'inline'
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        marginTop: 0,
        width: 50
    },
    productTitle: {
        fontSize: '1.15em',
        marginBottom: '5px'
    },
    subheading: {
        color: 'rgba(88, 114, 128, 0.67)',
        padding: '8px 10px 0',
        cursor: 'pointer',
        display: 'inline-block'
    },
    cart: {
        width: '100%',
        display: 'inline-flex'
    },
    details: {
        display: 'inline-block',
        width: "100%",
        padding: "4px"
    },
    content: {
        flex: '1 0 auto',
        padding: '16px 8px 0px'
    },
    cover: {
        width: 160,
        height: 125,
        margin: '8px'
    },
    itemTotal: {
        float: 'right',
        marginRight: '40px',
        fontSize: '1.5em',
        color: 'rgb(72, 175, 148)'
    },
    checkout: {
        float: 'right',
        margin: '24px'
    },
    total: {
        fontSize: '1.2em',
        color: 'rgb(53, 97, 85)',
        marginRight: '16px',
        fontWeight: '600',
        verticalAlign: 'bottom'
    },
    itemShop: {
        display: 'block',
        fontSize: '0.90em',
        color: '#78948f'
    },
   flexContainer:{
        display: 'flex',
       justifyContent: 'space-between',
       margin: '20px 0px'
   }

})

class CartItems extends Component {
    state = {
        cartItems: [],
        redirectToHome: false
    }

    componentDidMount = () => {
        this.setState({cartItems: cart.getCart()})
    }


    getTotal() {
        return this.state.cartItems.reduce((a, b) => {
            return a + b.pricing.sale
        }, 0)
    }

    removeItem = index => event => {
        let cartItems = cart.removeItem(index)

        this.setState({cartItems: cartItems})
    }

    removeReservation=()=>{
        cart.removeReservation();
        this.setState({redirectToHome: true})
    }

    openCheckout = () => {
        this.props.setCheckout(true)
    }

    render() {
        const {classes} = this.props;
        if(this.state.redirectToHome){
           return ( <Redirect to={'/'}/>)
        }
        return (<Card className={classes.card}>
            <Typography type="title" className={classes.title}>
                Shopping Cart
            </Typography>
            {this.state.cartItems.length > 0 ? (<span>
          {this.state.cartItems.map((item, i) => {
              return <span key={i}><Card className={classes.cart}>
              <CardMedia
                  className={classes.cover}
                  image={`${config.imageURL}/${convertImageUrl(item.picture[0])}`}
                  title={item.roomNumber}
              />
              <div className={classes.details}>
                <CardContent className={classes.content}>
                  <Link to={`/user/room/${item.slug}`}><Typography type="title" component="h3"
                                                                   className={classes.productTitle}
                                                                   color="primary">{item.description[0]}</Typography></Link>
                  <div>
                    <Typography type="subheading" component="h3" className={classes.price}
                                color="primary">$ {item.pricing.sale}</Typography>
                    <span className={classes.itemTotal}>${item.pricing.sale}</span>
                    <span className={classes.itemShop}>Room: {item.description[0]}</span>
                  </div>
                </CardContent>
                <div className={classes.subheading}>

                            <Button className={classes.removeButton} color="primary" onClick={this.removeItem(i)}>x Remove</Button>
                </div>
              </div>
            </Card>
            <Divider/>
          </span>
          })
          }
      </span>) :
                <Typography type="subheading" component="h3" color="primary">No items added to your cart.</Typography>
            }

            <div className={classes.flexContainer}>
                <Link to="/">
                    <Button variant="raised" >Continue Shopping</Button>
                </Link>
                <Button variant="raised" onClick={this.removeReservation}>REMOVE RESERVATION</Button>
                <Link to={`/checkout/${getReservationSlug()}`}>
                <Button variant="raised">Check Out</Button>
                </Link>
            </div>

        </Card>)
    }
}

CartItems.propTypes = {
    classes: PropTypes.object.isRequired,
    checkout: PropTypes.bool.isRequired,
    setCheckout: PropTypes.func.isRequired
}

export default withStyles(styles)(CartItems)