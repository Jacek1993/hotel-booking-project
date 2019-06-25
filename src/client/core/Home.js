import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid'
import {withStyles} from '@material-ui/core/styles';
import {loadRoom} from '../api/api-room'
import Search from '../room/Search'




const styles = theme => ({
    root: {
        flexGrow: 1,
        margin: 30,
    }

})

class Home extends Component {
    constructor(){
        super();
        this.state={
            searchResults: [],
            error: ''
        }
        this.loadRooms=this.loadRooms.bind(this)

    }

    loadRooms(){
        console.log('loadRoooms')
        loadRoom().then((response)=>{
            if(response.error){
                console.log(response.error)
                this.setState({error: response.error});
            }
            else{
                this.setState({searchResults: response})
            }
        })
    }

    componentDidMount(){
        this.loadRooms();
        console.log('componentDidMount')
    }


    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                    <Grid  xs={9} sm={9}  >
                        {this.state.searchResults &&(
                            <Search searchResults={this.state.searchResults} />
                        )}

                    </Grid>
            </div>
        )
    }
}


export default withStyles(styles)(Home)