import React, {Component} from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import Grid from '@material-ui/core/Grid'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import {Link} from 'react-router-dom'
import {findRoomBySlug} from '../api/api-room'
import { MDBCarousel, MDBCarouselCaption, MDBCarouselInner, MDBCarouselItem, MDBView, MDBMask, MDBContainer } from "mdbreact";
import {config} from '../../config/clientConfig'
import {convertImageUrl} from '../api/utils'
import Images from './Images'
import Divider from '@material-ui/core/Divider'


const styles = theme => ({
    root: theme.mixins.gutters({
        maxWidth: 600,
        margin: 'auto',
        padding: theme.spacing.unit * 3,
        marginTop: theme.spacing.unit * 5
    }),
    flex:{
        display:'flex'
    },
    card: {
        padding:'24px 40px 40px'
    },
    subheading: {
        margin: '24px',
        color: theme.palette.openTitle
    },
    price: {
        padding: '16px',
        margin: '16px 0px',
        display: 'flex',
        backgroundColor: '#93c5ae3d',
        fontSize: '1.3em',
        color: '#375a53',
    },
    media: {
        height: 200,
        display: 'inline-block',
        width: '50%',
        marginLeft: '24px'
    },
    icon: {
        verticalAlign: 'sub'
    },
    link:{
        color: '#3e4c54b3',
        fontSize: '0.9em'
    },
    addCart: {
        width: '35px',
        height: '35px',
        padding: '10px 12px',
        borderRadius: '0.25em',
        backgroundColor: '#5f7c8b'
    },
    action: {
        margin: '8px 24px',
        display: 'inline-block'
    },
    image:{
        width: "100%",
        maxHeight: "80%",
        margin: "10px auto 20px",
        display: "blocks"
    },
    view:{
        display: "table-cell",
        height: "100%",
        textAlign: "center",
        width: "100%",
        verticalAlign: "middle"
    }
})

class ClientRoom extends Component{
    constructor(props){
        super(props);
        this.state={
            slug: '',
            error: '',
            room: {}
        }
        console.log(props.match)
    }

    componentDidMount(){
        this.setState({slug: this.props.match.params.slug});
        this.loadRoom();

    }

    loadRoom(){
        findRoomBySlug(this.props.match.params.slug).then((data)=>{
                if(data.error){
                    this.setState({error: data.error});
                }else{
                    this.setState({room: data});
                    console.log(this.state.room);
                }
        })
    }

    render(){
        const {classes} = this.props;

        return (
            <div>
                {this.state.room.picture &&(<Images room={this.state.room}/>)}
                {this.state.room.pricing &&(
                    <div>
                        <Typography type="headline" component="h2" color="primary" className={classes.root}>
                            price before retail: {this.state.room.pricing.sale}
                        </Typography>
                        <Typography type="headline" component="h2" color="primary" className={classes.root}>
                            price after retail: {this.state.room.pricing.retail}
                        </Typography>
                    </div>
                )}
                { this.state.room.description && ( this.state.room.description.map((content, i)=>{return (<div>
                    <Typography type="headline" component="h2" color="primary" className={classes.root} id={i}>
                        {content}
                    </Typography>
                     <br/>
                    </div>)
                }))}


            </div>)

    }

}

export default withStyles(styles)(ClientRoom)