import React, {Component} from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import {createRoom} from '../api/api-room'
import Redirect from "react-router-dom/es/Redirect";



const styles = theme => ({
    card: {
        maxWidth: 600,
        margin: 'auto',
        textAlign: 'center',
        marginTop: theme.spacing.unit * 5,
        paddingBottom: theme.spacing.unit * 2
    },
    title: {
        margin: theme.spacing.unit * 2,
        marginTop: theme.spacing.unit*5,
        color: theme.palette.protectedTitle
    },
    error: {
        verticalAlign: 'middle'
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 300
    },
    submit: {
        margin: 'auto',
        marginBottom: theme.spacing.unit * 2
    }
})

class NewRoom extends Component{
    constructor(props){
        super(props);
        this.state={
            redirectToRooms: false,
            roomNumber: '',
            personAmount: 0,
            description: [],
            pricing: {
                retail: 0,
                sale: 0
            },
            error: ''
        };
        this.addInput = this.addInput.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNestedChange = this.handleNestedChange.bind(this);
        this.handlePricingChange=this.handlePricingChange.bind(this)
    }


    handleChange(e) {
        const value = e.target.value;
        this.setState({
            [e.target.name]: value
        });
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

    handleSubmit(e) {
        e.preventDefault();
        createRoom(this.state).then(response=>{
            if(response.error){
                this.setState({error: response.error})
            }else{
                this.setState({redirectToRooms: true})
            }
        })

    }

    addInput() {
        const newInput = '';
        this.setState({description: this.state.description.concat(newInput)});
    }

    render(){
        const classes=this.props;
        if(this.state.redirectToRooms){
            return (<Redirect to={`/user/rooms`}/>)
        }

        const Description=this.state.description.map((content, i)=>{
            return (
                <div key={i}>
                <TextField id={`${i}`}
                           label="Description"
                className={classes.textField}
                value={content}
                onChange={this.handleNestedChange}/>
                </div>
            )
        })

        return(
            <Card className={classes.card}>
                <CardContent>
                    <Typography type="headline" component="h2" className={classes.title}>
                        New Room
                    </Typography><br/>
                    <TextField id="roomNumber" label="roomNumber" className={classes.textField} value={this.state.roomNumber} name="roomNumber" onChange={this.handleChange} margin="normal"/><br/>
                    <TextField id="personAmount" label="personAmount" className={classes.textField} value={this.state.personAmount} name="personAmount" onChange={this.handleChange} margin="normal"/><br/>
                    <TextField id="retail" label="retail" className={classes.textField} value={this.state.pricing.retail} name="retail" onChange={this.handlePricingChange} margin="normal"/><br/>
                    <TextField id="sale" label="sale" className={classes.textField} value={this.state.pricing.sale} name="sale" onChange={this.handlePricingChange} margin="normal"/><br/>
                    <Typography type="headline" component="h2" className={classes.title}>
                        Add description here
                    </Typography><br/>

                    {Description}
                    <Button color="primary" variant="raised" className={classes.submit} onClick={this.addInput}>Add</Button><br/>
                    <br/>
                    {
                        this.state.error &&
                        (<Typography component="p" color="error">
                            <Icon color="error" className={classes.error}>error</Icon>
                            {this.state.error}
                        </Typography>)
                    }

                </CardContent>
                <CardActions>
                    <Button color="primary" variant="raised" onClick={this.handleSubmit} className={classes.submit}>Submit</Button>
                </CardActions>
            </Card>
        )


    }
}
NewRoom.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NewRoom);


