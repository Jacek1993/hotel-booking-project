import React, {Component} from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import {withStyles} from '@material-ui/core/styles'
import {Redirect} from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import {loadRoomWithReservations} from '../api/api-reservation'
import Divider from '@material-ui/core/Divider'
import ImageDisplay from "./ImageDisplay";
import {updateRoom} from '../api/api-room'
import IconButton from "@material-ui/core/IconButton/IconButton";
import Delete from "@material-ui/core/SvgIcon/SvgIcon";
import Remove from '@material-ui/icons/Remove'
import MyReservation from '../reservation/MyReservation'


const styles = theme => ({
    root: {
        flexGrow: 1,
        margin: 30,
    },
    card: {
        textAlign: 'center',
        paddingBottom: theme.spacing.unit * 2
    },
    title: {
        margin: theme.spacing.unit * 2,
        color: theme.palette.protectedTitle,
        fontSize: '1.2em'
    },
    subheading: {
        marginTop: theme.spacing.unit * 2,
        color: theme.palette.openTitle
    },
    error: {
        verticalAlign: 'middle'
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 400
    },
    submit: {
        margin: 'auto',
        marginBottom: theme.spacing.unit * 2
    },
    bigAvatar: {
        width: 60,
        height: 60,
        margin: 'auto'
    },
    input: {
        display: 'none'
    },
    filename:{
        marginLeft:'10px'
    }
})

class EditShop extends Component {
    constructor(props) {
        super(props)
        this.state = {
            roomNumber: '',
            description: [],
            slug: '',
            pricing: {
                retail: 0,
                sale: 0
            },
            tags: '',
            picture: [],
            reservation_table: [],
            error: '',
            redirectToRooms: false
        }

        this.loadData=this.loadData.bind(this);
        this.handleChange=this.handleChange.bind(this);
        this.handleNestedChange=this.handleNestedChange.bind(this)
        this.handlePricingChange=this.handlePricingChange.bind(this)
        this.removePicture=this.removePicture.bind(this)
        this.addInput=this.addInput.bind(this)
        this.removeDescription=this.removeDescription.bind(this)
    }
    shouldComponentUpdate(nextProps, nextState){
        return nextState.roomNumber!==undefined;
    }

    componentDidMount = () => {
        this.setState({slug: this.props.match.params.slug})
        this.loadData();
    }

    loadData=(headers)=>{
        loadRoomWithReservations({slug: this.props.match.params.slug, startDate: (new Date()).toISOString()}, headers={}).then(response=>{
            console.log(response);
           if(response.error){
                this.setState({redirectToRooms: true})
           }else{
               console.log(response[0].description)
               this.setState({roomNumber: response[0].roomNumber});
               this.setState({description: response[0].description});
               this.setState({picture: response[0].picture});
               this.setState({slug: response[0].slug});
               this.setState({reservation_table: response[0].reservation_table});
               this.setState({pricing: response[0].pricing});
                console.log(this.state.reservation_table)

           }
       })


    }
    clickUpdateRoom = () => {
        const room={
            roomNumber: this.state.roomNumber,
            pricing: this.state.pricing,
            description: this.state.description,
            picture: this.state.picture,
            tags: this.state.tags
        }
        console.log(JSON.stringify(room))

        updateRoom({slug: this.state.slug, roomData: room}).then((response)=>{
            if(response.error){
                this.setState({error: response.error});
            }
            else{
                this.setState({redirectToRooms: true})
            }
        })
    }
    handleChange(e){
        const value=e.target.value;
        this.setState({
            [e.target.name]: value
        });
    }

    removePicture = (image) => {
        this.setState((prevState => ({
            picture: prevState.picture.filter((pic)=>pic!==image)
        })))
    }

    removeDescription=(index)=>{
        this.setState((prevState => ({
            description: prevState.description.filter((desc, i)=>index!==i)
        })))
    }

    handleNestedChange(e) {
        const newStateContent = this.state.description;
        newStateContent[e.target.id] = e.target.value;
        this.setState({
            description: newStateContent
        });

    }
    handlePricingChange(e) {
        const pricing = this.state.pricing;
        pricing[e.target.name] = e.target.value;
        this.setState({
            pricing: pricing
        })

    }

    addInput() {
        const newInput = '';
        this.setState({description: this.state.description.concat(newInput)});
    }



    render() {
        if (this.state.redirectToRooms) {
            return (<Redirect to={'/user/rooms'}/>)
        }
        const {classes} = this.props
        const Description=this.state.description.map((content, i)=>{
            return (
                <div key={i}>
                    <TextField id={`${i}`}
                               label="Description"
                               multiline
                               className={classes.textField}
                               value={content}
                               onChange={this.handleNestedChange}
                                />
                </div>
            )
        });



        return (<div className={classes.root}>
            <Grid container spacing={24}>
                <Grid item xs={7} sm={7}>
                    <Card className={classes.card}>
                        {
                            this.state.description &&
                            (
                                <CardContent>
                                    <Typography type="headline" component="h2" className={classes.title}>
                                        Edit Room
                                        {this.state.roomNumber}
                                    </Typography>
                                    <br/>
                                    <TextField id="roomNumber" label="roomNumber" className={classes.textField} value={this.state.roomNumber} onChange={this.handleChange}
                                               margin="normal" name="roomNumber"/><br/>
                                    <TextField id="retail" label="retail" className={classes.textField} value={this.state.pricing.retail} name="retail" onChange={this.handlePricingChange}
                                               margin="normal"/><br/>
                                    <TextField id="sale" label="sale" className={classes.textField} value={this.state.pricing.sale} name="sale" onChange={this.handlePricingChange}
                                               margin="normal"/><br/>
                                    <TextField id="tags" label="tags" multiline className={classes.textField} value={this.state.tags} name="tags" onChange={this.handleChange} margin="normal"/><br/>
                                    <Divider/>
                                    {Description}
                                    <br/>
                                    <Divider/>
                                    <br/>
                                    <Button color="primary" variant="raised" className={classes.submit} onClick={this.addInput}>Add</Button><br/>

                                    {
                                        this.state.error && (<Typography component="p" color="error">
                                            <Icon color="error" className={classes.error}>error</Icon>
                                            {this.state.error}
                                        </Typography>)
                                    }

                                    <Divider/>
                                    <ImageDisplay picture={this.state.picture} removePicture={this.removePicture}/>
                                </CardContent>

                            )
                        }
                        <CardActions>
                            <Button color="primary" variant="raised" onClick={this.clickUpdateRoom} className={classes.submit}>Update</Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={5} sm={5}>
                    { this.state.reservation_table && (
                    <MyReservation reservation_table={this.state.reservation_table} slug={this.state.slug}/>
                    )}
                </Grid>
            </Grid>
        </div>)
    }
}


export default withStyles(styles)(EditShop)