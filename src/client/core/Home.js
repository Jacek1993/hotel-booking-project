import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid'
import {withStyles} from '@material-ui/core/styles';
import {loadRoom} from '../api/api-room'
import Search from '../room/Search'
import Paper from "@material-ui/core/Paper/Paper";
import Card from "@material-ui/core/Card/Card";



const styles = theme => ({
    root: {
        flexGrow: 1,
        margin: 30,
    },
    paper: {
        height: '300px',
        width: '100%'
    },
    grid:{
        margin: '300px'
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

                <Grid container spacing={2}>
                    <Grid container xs={8} sm={8} margin={200} >
                        {this.state.searchResults &&(
                            <Search searchResults={this.state.searchResults} />
                        )}

                    </Grid>
                    <Grid itesm xs={4} sm={4}>
                        {/*<Suggestions products={this.state.searchResult}/>*/}
                    </Grid>
                </Grid>
            </div>
        )
    }
}


export default withStyles(styles)(Home)