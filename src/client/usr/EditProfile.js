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
import {userCredentials, updateUser} from "./api/api-user";


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
            user: {},
            slug: '',
            error: '',
            file: ''
        }
        this.match = match
    }


    init = (slug) => {
        console.log('this may cause error  ' + slug);
        userCredentials(slug).then(response => {

            if (response.error) {
                this.setState({error: response.error});
            }
            else {
                this.setState({user: response});
                console.log('After init')
            }

        })

        console.log(JSON.stringify(this.state.user));


    }

    componentDidMount = () => {
        this.userData=new FormData();
        let param1 = Object.keys(this.props.match.params);
        this.setState({slug: param1[0]});
        if (this.state.slug) {
            console.log(this.state.slug)
            this.init(this.state.slug);
        }

    }

    componentWillReceiveProps(props) {

    };



    clickSubmit = () => {
        console.log(this.state.slug);
        const user = {
            firstName: this.state.user.firstName || undefined,
            lastName: this.state.user.lastName || undefined,
            email: this.state.user.email || undefined,
            phoneNumber: this.state.user.phoneNumber || undefined,
            slug: this.state.slug
        };

        // updateUser({slug: this.state.slug, userData: this.userData}).then(response=>{
        //     if (response.error) {
        //         this.setState({error: response.error});
        //     }
        // })
        const data=new FormData();
        data.append('file', this.state.file);
        axios.post("http://localhost:3000/client/uplaod/image/mati", data)


    }
    handleChange = name => event => {
        console.log(name);
        const value = name === 'file'
            ? event.target.files[0]
            : event.target.value

        this.userData.set(name, value)
        this.setState({[name]: value})
        console.log(this.userData.get(name));
    }

    render() {
        const {classes} = this.props;
        const photoUrl = `/client/profile/image/${this.state.slug}`;


        return (
            <Card className={classes.card}>
                <CardContent>
                    <Typography type="headline" component="h2" className={classes.title}>
                        Edit Profile
                    </Typography>
                    {

                        (<Avatar src={photoUrl} className={classes.bigAvatar}/>)
                    }
                    <br/>

                    <input accept="image/*" onChange={this.handleChange('file')} className={classes.input}
                           id="icon-button-file" type="file"/>
                    <label htmlFor="icon-button-file">
                        <Button variant="raised" color="default" component="span">
                            Upload
                            <FileUpload/>
                        </Button>
                    </label> <span
                    className={classes.filename}>{this.state.photo ? this.state.photo.name : ''}</span><br/>
                    <TextField id="name" label="Name" className={classes.textField} value={this.state.user.firstName}
                               onChange={this.handleChange('name')} margin="normal"/><br/>
                    <TextField id="lastName" label="LastName" className={classes.textField} value={this.state.user.lastName}
                               onChange={this.handleChange('lastName')} margin="normal"/><br/>
                    <TextField
                        id="phone"
                        label="PhoneNumber"
                        rows="2"
                        value={this.state.user.phoneNumber}
                        onChange={this.handleChange('phone')}
                        className={classes.textField}
                        margin="normal"
                    /><br/>
                    <TextField id="email" type="email" label="Email" className={classes.textField}
                               value={this.state.user.email} onChange={this.handleChange('email')} margin="normal"/><br/>
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