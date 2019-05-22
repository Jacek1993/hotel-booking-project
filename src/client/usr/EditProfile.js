import React, {Component} from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import Avatar from '@material-ui/core/Avatar'
import FileUpload from '@material-ui/icons/FileCopy'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import {userCredentials, updateUser} from "../api/api-user";
import {sendForm} from "../api/sendRequest";
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
    },
    bigAvatar: {
        width: 60,
        height: 60,
        margin: 'auto'
    },
    input: {
        display: 'none'
    },
    filename: {
        marginLeft: '10px'
    }
})

class EditProfile extends Component {
    constructor({match}) {
        super()
        this.state = {
            firstName:'',
            lastName: '',
            email: '',
            phoneNumber: '',
            slug: '',
            error: '',
            photo: '',
            redirectToProfile: false
        };
        this.handleChange=this.handleChange.bind(this);
        this.handleFileChange=this.handleFileChange.bind(this)
    }


    init = (slug) => {
        console.log('this may cause error  ' + slug);
        userCredentials(slug).then(response => {

            if (response.error) {
                this.setState({error: response.error});
            }
            else {
                this.setState({firstName: response.firstName});
                this.setState({lastName: response.lastName});
                this.setState({email: response.email});
                this.setState({phoneNumber: response.phoneNumber});
                this.setState({photo: response.photography});
                console.log('After init')
            }

        })

        console.log(JSON.stringify(this.state.user));


    }

    componentDidMount = () => {

        this.setState({slug: this.props.match.url});

    }

    componentWillReceiveProps(props) {

        if (this.state.slug) {
            console.log(this.state.slug)
            this.init(this.state.slug);
        }

    };

    shouldComponentUpdate(nextProps, nextState) {
        return  nextState.slug && nextState.firstName;
    }

    clickSubmit = () => {

        const data=new FormData();
        data.append('file', this.state.file);
        data.append('firstName', this.state.firstName);
        data.append('lastName', this.state.lastName);
        data.append('email', this.state.email);
        data.append('phoneNumber', this.state.phoneNumber);
        console.log(this.state);
        console.log(data)
        sendForm(`/client/upload/${this.state.slug}`, data);
        this.setState({'redirectToProfile': true})

    }

    handleChange(e){
        const value =e.target.value;
        this.setState({
            [e.target.name]: value
        })
    }

    handleFileChange(e){
        this.setState({file: e.target.files[0]});
    }

    render() {
        const {classes} = this.props;
        const photoUrl = `/client/profile/image/${this.state.slug}`;
        if(this.state.redirectToProfile){
            return (<Redirect to={`/secret/${this.state.slug}`}/>)
        }

        return (
            <Card className={classes.card}>
                <CardContent>
                    <Typography type="headline" component="h2" className={classes.title}>
                        Edit Profile
                    </Typography>
                    {
                        photoUrl&&
                        (<Avatar src={photoUrl} className={classes.bigAvatar}/>)
                    }
                    <br/>

                    <input accept="image/*" onChange={this.handleFileChange} className={classes.input}
                           id="icon-button-file" type="file" />
                    <label htmlFor="icon-button-file">
                        <Button variant="raised" color="default" component="span">
                            Upload
                            <FileUpload/>
                        </Button>
                    </label> <span
                    className={classes.filename}>{this.state.photo ? this.state.photo : ''}</span><br/>
                    <TextField id="firstName" label="firstName" className={classes.textField} value={this.state.firstName}
                               onChange={this.handleChange} margin="normal" name="firstName"/><br/>
                    <TextField id="lastName" label="lastName" className={classes.textField} value={this.state.lastName}
                               onChange={this.handleChange} margin="normal" name="lastName"/><br/>
                    <TextField
                        id="phone"
                        label="phoneNumber"
                        rows="2"
                        value={this.state.phoneNumber}
                        onChange={this.handleChange}
                        className={classes.textField}
                        margin="normal"
                        name="phoneNumber"
                    /><br/>
                    <TextField id="email" type="email" label="email" className={classes.textField}
                               value={this.state.email} onChange={this.handleChange} margin="normal" name="email"/><br/>
                    {/*<TextField id="password" type="password" label="Password" className={classes.textField} value={this.state.password} onChange={this.handleChange('password')} margin="normal"/>*/}
                    <br/> {
                    this.state.error && (<Typography component="p" color="error">
                        <Icon color="error" className={classes.error}>error</Icon>
                        {this.state.error}
                    </Typography>)
                }
                </CardContent>
                <CardActions>
                    <Button color="primary" variant="raised" onClick={this.clickSubmit}
                            className={classes.submit}>Submit</Button>
                </CardActions>
            </Card>
        )
    }
}

EditProfile.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EditProfile)