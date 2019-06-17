import React, {Component} from 'react'
import {withStyles} from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import AddCartIcon from '@material-ui/icons/AddShoppingCart'
import cart from './cart-helper.js'
import {Redirect} from 'react-router-dom'

const styles = theme => ({
    iconButton: {
        width: '28px',
        height: '28px'
    }
})

class AddToCart extends Component {
    state = {
        redirect: false
    }
    addToCart = () => {
        cart.addItem(this.props.item , this.props.startDate, this.props.endDate, () => {
            this.setState({redirect: true})
        })
    }

    render() {
        if (this.state.redirect) {
            return (<Redirect to={'/cart'}/>)
        }
        const {classes} = this.props
        return (<span>
          <IconButton color="secondary" dense="dense" onClick={this.addToCart}>
              <AddCartIcon className={this.props.cartStyle || classes.iconButton}/>
          </IconButton>
      </span>)

    }
}

AddToCart.propTypes = {
    classes: PropTypes.object.isRequired,
    item: PropTypes.object.isRequired,
    cartStyle: PropTypes.string
}

export default withStyles(styles)(AddToCart)