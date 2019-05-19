import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Post from './Post'

class PostList extends Component {

    constructor(props){
        super(props);
        this.state={
            reservation: []
        }

    }

    render() {
        return (
            <div style={{marginTop: '24px'}}>
                {this.state.reservation && (this.props.reservation.map((item, i) => {
                    return <Post reservation={item} key={i} slug={this.props.slug}/>
                }))
                }
            </div>
        )
    }
}

export default PostList