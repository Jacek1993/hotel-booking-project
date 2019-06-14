import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import IconButton from '@material-ui/core/IconButton'
import Edit from '@material-ui/icons/Edit'
import Icon from '@material-ui/core/Icon'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Typography from '@material-ui/core/Typography'
import {Link} from 'react-router-dom'
import Divider from '@material-ui/core/Divider'
import DeleteProduct from './DeleteReservation'
import {SingleDatePicker} from 'react-dates'
import 'react-dates/lib/css/_datepicker.css'
import {loadRoomWithReservations} from "../api/api-reservation";
import {config} from '../../config/clientConfig'
import CardHeader from '@material-ui/core/CardHeader'
import Avatar from "@material-ui/core/Avatar/Avatar";
import moment from 'moment'
import Paper from "@material-ui/core/Paper/Paper";
import Grid from "@material-ui/core/Grid/Grid";

const styles = theme => ({
    products: {
        padding: '24px'
    },
    addButton: {
        float: 'right'
    },
    leftIcon: {
        marginRight: "8px"
    },
    title: {
        margin: theme.spacing.unit * 2,
        color: theme.palette.protectedTitle,
        fontSize: '1.2em'
    },
    // grid:{
    //   marginBottom: '300px'
    // },
    subheading: {
        marginTop: theme.spacing.unit * 2,
        color: theme.palette.openTitle
    },
    cover: {
        width: 110,
        height: 100,
        margin: '8px'
    },
    details: {
        padding: '10px'
    },
    submit: {
        margin: 'auto',
        position: 'relative',
        float: 'right',
        marginBottom: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2
    }
})

class MyReservation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            reservation: [],
            startDate: '',
            calendarFocused: false,
            fetchDataFromParent: true,
            slug: '',
            error: '',
            marginBottom: 20
        }

        this.updateReservation = this.updateReservation.bind(this)
    }

    componentDidMount() {


    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.reservation_table !== undefined
    }

    componentWillReceiveProps(props) {
        this.setState({reservation: props.reservation_table})
        this.setState({slug: props.slug});
    }


    loadReservations = (startDate, headers) => {
        loadRoomWithReservations({
            slug: this.state.slug,
            startDate
        }, headers).then(response => {
            console.log(response);
            if (response.error) {
                this.setState({error: response.error})
            } else {
                console.log(response)
                this.setState({reservation: response[0].reservation_table})

            }
        })

    }

    updateReservation = () => {
        const headers = {
            undo: this.state.slug
        };
        this.loadReservations(this.state.startDate.toISOString(), headers);
    }


    onFocusChange = ({focused}) => {
        // this.setState({marginBottom: 300})
        this.setState(() => ({calendarFocused: focused}))
    }

    onDateChange = (startDate) => {
        if(startDate){
            this.setState(() => ({startDate}))
        }

    }


    // removeProduct = (product) => {
    //     const updatedProducts = this.state.products
    //     const index = updatedProducts.indexOf(product)
    //     updatedProducts.splice(index, 1)
    //     this.setState({shops: updatedProducts})
    // }
//todo add link to reservation
    render() {
        const {classes} = this.props
        return (
            <Paper>
              <Grid marginBottom="200">
                <SingleDatePicker
                    startDate={this.state.startDate}
                    onDateChange={this.onDateChange}
                    focused={this.state.calendarFocused}
                    onFocusChange={this.onFocusChange}
                    numberOfMonths={1}
                    isOutsideRange={() => false}
                />
                <Button color="primary" variant="raised" className={classes.submit}
                        onClick={this.updateReservation}>Submit</Button>
              </Grid>/


                <List dense>
                    {
                        this.state.reservation && (this.state.reservation.map((r, i) => {
                            return <span key={i}>
                                <ListItem>
                                    <CardMedia>
                                    <CardHeader
                                        avatar={
                                            <Avatar src={`${config.userImageURL}/${r.userSlug}`} />
                                        }
                                        title={<Link to={`${config.userProfile}/${r.userSlug}`}>{r.name}</Link>}
                                    />
                                        <div>
                                            <Typography type="headline" component="h2" className={classes.title}>
                                                StartDate: {moment(r.startDate).format('LLL')}
                                                <br/>
                                                FinishDate: {moment(r.finishDate).format('LLL')}
                                            </Typography>
                                            <Typography type="subheading" component="h4" className={classes.subheading}>
                                                TotalAmount: {r.totalAmount}
                                            </Typography>
                                        </div>
                                    </CardMedia>
                                </ListItem>
                            </span>
                        }))
                    }
                </List>


            </Paper>)
    }
}

MyReservation.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(MyReservation)
