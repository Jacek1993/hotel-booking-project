import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import {Link} from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import Typography from '@material-ui/core/Typography'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import PostList from "./PostList";


class ProfileTabs extends Component {
    constructor(props){
        super (props);
        this.state = {
            tab: 0,
            reservation: []
        }
    }


    componentWillReceiveProps = (props) => {
        this.setState({tab:0})
            console.log(props.reservation)
            this.setState({reservation: props.reservation})

    }

    shouldComponentUpdate(nextProps, nextState){
        return nextProps.reservation;
    }
    handleTabChange = (event, value) => {
        this.setState({ tab: value })
    }

    render() {
        return (
            <div>
                <AppBar position="static" color="default">
                    <Tabs
                        value={this.state.tab}
                        onChange={this.handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        fullWidth
                    >
                        <Tab label="Reservations" />
                    </Tabs>
                </AppBar>
                 <TabContainer>
                    <PostList  reservation={this.state.reservation} slug={this.props.slug}/>
                </TabContainer>
            </div>)
    }
}


const TabContainer = (props) => {
    return (
        <Typography component="div" style={{ padding: 8 * 2 }}>
            {props.children}
        </Typography>
    )
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired
}

export default ProfileTabs