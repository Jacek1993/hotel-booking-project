import React, {Component} from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import DeleteIcon from '@material-ui/icons/Delete'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import {removeReservation} from "../api/api-reservation";

class RemoveReservation extends Component {
    state = {
        open: false
    }

    clickButton = () => {
        this.setState({open: true})
    }

    deleteReservation = () => {
        console.log(this.props.reservation.slug);
        const headers = {
            owner: this.props.reservation.userSlug
        };
        removeReservation(this.props.reservation.slug, headers).then(response => {
            if (response.error) {
                console.log(response.error)
            }
            else {
                this.setState({open: false}, () => {
                    this.props.onRemove(this.props.reservation)
                })
            }
        })
    }

    handleRequestClose = () => {
        this.setState({open: false})
    }

    render() {
        return (<span>
      <IconButton aria-label="Delete" onClick={this.clickButton} color="secondary">
        <DeleteIcon/>
      </IconButton>

      <Dialog open={this.state.open} onClose={this.handleRequestClose}>
        <DialogTitle>{`Delete reservation of : ${this.props.reservation.userSlug}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Confirm to delete reservation
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleRequestClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.deleteReservation} color="secondary" autoFocus="autoFocus">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </span>)
    }
}

RemoveReservation.propTypes = {
    reservation: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired
}
export default RemoveReservation