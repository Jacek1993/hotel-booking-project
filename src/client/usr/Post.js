import React, {Component} from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import CommentIcon from '@material-ui/icons/Comment'
import Divider from '@material-ui/core/Divider'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import {Link} from 'react-router-dom'
import moment from 'moment'



const styles = theme => ({
    card: {
        maxWidth:600,
        margin: 'auto',
        marginBottom: theme.spacing.unit*3,
        backgroundColor: 'rgba(0, 0, 0, 0.06)'
    },
    cardContent: {
        backgroundColor: 'white',
        padding: `${theme.spacing.unit*2}px 0px`
    },
    cardHeader: {
        paddingTop: theme.spacing.unit,
        paddingBottom: theme.spacing.unit
    },
    text: {
        margin: theme.spacing.unit*2
    },
    photo: {
        textAlign: 'center',
        backgroundColor: '#f2f5f4',
        padding:theme.spacing.unit
    },
    media: {
        height: 200
    },
    button: {
        margin: theme.spacing.unit,
    }
})

class Post extends Component {
    state = {
        finishDate: '',
        startDate: '',
        rooms: [],
        slug: ''
    }



    componentDidMount = () => {
        this.convertDate();
        this.setState({slug:this.props.reservation.slug, startDate: this.props.reservation.startDate, finishDate: this.props.reservation.finishDate, rooms: this.props.reservation.rooms})
    }
    componentWillReceiveProps = (props) => {
        this.setState({slug:this.props.reservation.slug, startDate: this.props.reservation.startDate, finishDate: this.props.reservation.finishDate, rooms: this.props.reservation.rooms})
    }

    convertDate(){
        this.startDate=this.props.reservation.startDate;
        this.finishDate=this.props.reservation.finishDate;

    }


    render() {
        const {classes} = this.props;
        return (
            <Card className={classes.card}>
                <CardHeader
                    avatar={
                        <Avatar src={`/client/profile/image/${this.props.slug}`}/>
                    }

                    title={<Link to={"/reservation/" + this.props.reservation.slug}>Reservation Name</Link>}
                    subheader={`${moment(this.startDate).format('LLL')}    ${moment(this.finishDate).format('LLL')}`}
                    className={classes.cardHeader}
                />
                <CardContent className={classes.cardContent}>
                    <Typography component="p" className={classes.text}>
                        <ul>
                            {
                                this.props.reservation.rooms.map((opt, index)=><li key={index}>{opt}</li>)
                            }
                        </ul>
                    </Typography>
                </CardContent>
            </Card>
        )
    }
}


export default withStyles(styles)(Post)