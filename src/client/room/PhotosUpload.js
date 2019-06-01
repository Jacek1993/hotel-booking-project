import React, {Component} from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Redirect from "react-router-dom/es/Redirect";
import FileUpload from '@material-ui/icons/FileCopy'
import {sendForm} from '../api/sendRequest'


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
        marginTop: theme.spacing.unit * 5,
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
    input: {
        display: 'none'
    },
    filename: {
        marginLeft: '10px'
    }
})

class PhotosUpload extends Component {
    constructor(props) {
        super(props)
        this.state = {
            redirectToRooms: false,
            photos: [],
            error: ''
        }
        this.addFile = this.addFile.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
        console.log(this.props.match)
    }

    addFile() {
        const newFile = {};
        this.setState({photos: this.state.photos.concat(newFile)});
    }

    handleFileChange(e) {
       const newStateContent=this.state.photos;
       newStateContent[e.target.id]=e.target.files[0];
        this.setState({
            photos: newStateContent
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        const data=new FormData();
        this.state.photos.forEach((photo)=>data.append('productImage', photo));
        sendForm(`/room/image/${this.props.match.url}`, data);
        this.setState({redirectToRooms: true})
    }

    render() {
        const classes = this.props;
        if (this.state.redirectToRooms) {
            return (<Redirect to={`/user/rooms`}/>)
        }

        const Photo = this.state.photos.map((content, i) => {
            return (
                <div key={i}>
                    <input id={`${i}`} type="file" accept="image/*" className={classes.input} onChange={this.handleFileChange}/>
                    <label htmlFor={`${i}`}>
                        <Button variant="raised" color="default" component="span">
                            Upload
                            <FileUpload/>
                        </Button>
                    </label>
                    <span className={classes.filename}>{this.state.photos[i] ? this.state.photos[i].name : ''}</span>
                </div>
            )
        })

        return (
            <Card>
                <CardContent>
                    <Typography type="headline" component="h2" className={classes.title}>
                        Image Upload
                    </Typography>
                    <br/>
                    {Photo}
                    <Button color="primary" variant="raised" className={classes.submit} onClick={this.addFile}>Add</Button>
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
            </Card>)
    }
}

PhotosUpload.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PhotosUpload);
