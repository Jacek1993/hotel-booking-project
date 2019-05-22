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

import {removeRoom} from '../api/api-room.js'

class DeleteShop extends Component {
    state = {
        open: false
    }
    clickButton = () => {
        this.setState({open: true})
    }
    deleteShop = () => {
        console.log(this.props.slug);
        removeRoom(this.props.slug).then(response=>{
            if(response.error){
                console.log(response.error)
            }
            else{
                this.setState({open: false}, ()=>{
                    this.props.onRemove(this.props.room)
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
        <DialogTitle>{"Delete "+this.props.room.roomNumber}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Confirm to delete your shop { this.props.description ? this.props.description[0] : ''}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleRequestClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.deleteShop} color="secondary" autoFocus="autoFocus">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </span>)
    }
}
DeleteShop.propTypes = {
    room: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired
}
export default DeleteShop