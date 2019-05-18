import React, {Component} from 'react'
import Card  from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import {signin} from  './api/api-user'


const styles = theme => ({
    card: {
        maxWidth: 600,
        margin: 'auto',
        textAlign: 'center',
        marginTop: theme.spacing.unit * 5,
        paddingBottom: theme.spacing.unit * 2
    },
    error: {
        verticalAlign: 'middle'
    },
    title: {
        marginTop: theme.spacing.unit * 2,
        color: theme.palette.openTitle
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

class Signin extends Component {

    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            error: '',
            slug: '',
            redirectToReferrer: false
        };
    }


    clickSubmit = () => {
        const user = {
            email: this.state.email || undefined,
            password: this.state.password || undefined
        }

       signin(user).then(response=>{
           console.log(response)
           if(response.error){
               this.setState({error: response.error});
           }else{
               this.state.slug=user.slug=response.slug;

               this.props.history.push(`/client/${user.slug}`);

                //last line of code is a callback which sends data to it's parent
               this.props.slugCallback(user.slug);
           }

       });

    }

    handleChange = name => event => {
        this.setState({[name]: event.target.value})
    }

    render() {
        const {classes} = this.props

        return (
            <Card className={classes.card}>
                <CardContent>
                    <Typography type="headline" component="h2" className={classes.title}>
                        Sign In
                    </Typography>
                    <TextField id="email" type="email" label="Email" className={classes.textField} value={this.state.email} onChange={this.handleChange('email')} margin="normal"/><br/>
                    <TextField id="password" type="password" label="Password" className={classes.textField} value={this.state.password} onChange={this.handleChange('password')} margin="normal"/>
                    <br/> {
                    this.state.error && (<Typography component="p" color="error">
                        <Icon color="error" className={classes.error}>error</Icon>
                        {this.state.error}
                    </Typography>)
                }
                </CardContent>
                <CardActions>
                    <Button color="primary" variant="raised" onClick={this.clickSubmit} className={classes.submit}>Submit</Button>
                </CardActions>
            </Card>
        )
    }
}

Signin.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Signin)