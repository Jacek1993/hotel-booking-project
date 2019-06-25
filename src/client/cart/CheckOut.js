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
import {convertImageUrl} from "../api/utils";
import Redirect from "react-router-dom/es/Redirect";
import {changeState, loadReservation} from "../api/api-reservation";
import queryString from "querystring";

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
    flexContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        margin: '20px 0px'
    }

})

class CheckOut extends Component {
    constructor(props) {
        super(props)
        this.state = {
            reservation: {
                reservedRooms: [],
                totalAmount: 0,
                startDate: 0,
                finishDate: 0,
                name: '',
                slug: ''
            },
            redirectToHome: false
        }

    }


    componentDidMount = () => {
        console.log(JSON.stringify(this.props.match.params.reservationSlug))
        this.setState({cartItems: cart.getCart()})

        loadReservation(this.props.match.params.reservationSlug).then((data) => {
            if (data.error) {
                console.log(data.error)
                this.setState({redirectToHome: true})
            }
            else {
                console.log(data)
                this.setState({reservation: data});
                const query={};
                query.newState = 'IN_CART'
                query.reservationSlug = this.state.reservation.slug;
                console.log(JSON.stringify(query))
                changeState(queryString.stringify(query)).then((data)=>{
                    if(data.error){
                        console.log(data.error);
                    }
                    console.log('update state')
                })
            }
        })
    }


    removeItem = index => event => {
        let cartItems = cart.removeItem(index)

        this.setState({cartItems: cartItems})
    }

    pay=()=>{
        const query={};
        query.newState = 'BOOKED'
        query.reservationSlug = this.state.reservation.slug;
        changeState(queryString.stringify(query)).then((data)=>{
            if(data.error){
                console.log(data.error);
            }
            console.log('update state')
        })
    }

    removeReservation = () => {
        cart.removeReservation();
        this.setState({redirectToHome: true})
    }


    render() {
        const {classes} = this.props;
        if (this.state.redirectToHome) {
            return (<Redirect to={'/'}/>)
        }
        return (<Card className={classes.card}>
            <Typography type="title" className={classes.title}>
                Shopping Cart
            </Typography>
            {this.state.reservation.reservedRooms.length > 0 ? (<span>
          {this.state.reservation.reservedRooms.map((item, i) => {
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

                            <Button color="primary" onClick={this.removeItem(i)}>x Remove</Button>
                </div>
              </div>
            </Card>
            <Divider/>
          </span>
          })
          }
                    <Divider/>
          <div>
              <Typography type="subheading" component="h3" className={classes.price}>
                   Total  Price: {this.state.reservation.totalAmount}
              </Typography>
          </div>
      </span>) :
                <Typography type="subheading" component="h3" color="primary">No items added to your cart.</Typography>
            }

            <div className={classes.flexContainer}>
                <Link to="/">
                    <Button variant="raised">Continue Shopping</Button>
                </Link>
                <Button variant="raised" onClick={this.removeReservation}>REMOVE RESERVATION</Button>
                <Button variant="raised" onClick={this.pay}>Pay</Button>
            </div>

        </Card>)
    }
}

CheckOut.propTypes = {
    classes: PropTypes.object.isRequired,
    checkout: PropTypes.bool.isRequired,
    setCheckout: PropTypes.func.isRequired
}

export default withStyles(styles)(CheckOut)