import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Divider from '@material-ui/core/Divider'
import Rooms from './Rooms'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import SearchIcon from '@material-ui/icons/Search'
import {findRoomByStartFinishDate, search} from '../api/api-room'
import queryString from 'query-string'
import {DateRangePicker} from 'react-dates'
import moment from 'moment'
import CardHeader from "@material-ui/core/CardHeader/CardHeader";
import CardMedia from "@material-ui/core/CardMedia/CardMedia";
import 'react-dates/lib/css/_datepicker.css'
import CardActionArea from "@material-ui/core/CardActionArea/CardActionArea";
import CardContent from "@material-ui/core/CardContent/CardContent";

const styles = theme => ({
    card: {
        margin: 'auto',
        textAlign: 'center',
        paddingTop: 10,
        backgroundColor: '#80808024'
    },
    menu: {
        width: 200,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 130,
        verticalAlign: 'bottom',
        marginBottom: '20px'
    },
    searchField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 300,
        marginBottom: '20px'
    },
    searchButton: {
        minWidth: '20px',
        height: '30px',
        padding: '0 8px'
    },
    media:{
        maxHeight: "2000"
    },
    submit: {
        margin: 'auto',
        marginBottom: theme.spacing.unit * 2
    }
})

class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            search: '',
            searchResults: [],
            searched: false,
            focusedInput: null,
            startDate: moment().startOf('month'),
            endDate: moment().endOf('month'),
            personAmount: 0

        }

    }

    componentWillReceiveProps(props){
        this.setState({searchResults: props.searchResults});
        this.setState({searched: props.searched})
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        })
    }

    onDatesChange=({startDate, endDate})=>{

            this.setState({startDate: startDate});
            this.setState({endDate: endDate})
    }

    onFocusChange=(calendarFocused)=>{
        this.setState(()=>{calendarFocused})
    }


    findByDate=()=>{
        if(this.state.startDate && this.state.endDate && this.state.personAmount){
            let query={};
            query.startDate=this.state.startDate.startOf('day').format('YYYY-MM-DD');
            query.finishDate=this.state.endDate.startOf('day').format('YYYY-MM-DD');
            query.personAmount=this.state.personAmount;
            console.log(queryString.stringify(query));
            findRoomByStartFinishDate(queryString.stringify(query)).then((data)=>{
                if(data.error){
                    console.log(data.error);
                }
                else{
                    this.setState({searchResults: data});
                    if (!data) {
                        this.setState({searched: true});
                    }
                    console.log(data)
                }
            })
        }
    }


    browse = () => {
        if (this.state.search) {
            let query = {};
            query.search = this.state.search;
            console.log(queryString.stringify(query))
            search(queryString.stringify(query)).then((data) => {
                if (data.error) {
                    console.log(data.error);
                }
                else {
                    this.setState({searchResults: data});
                    if (!data) {
                        this.setState({searched: true});
                    }
                    console.log(data)
                }
            })
        }
    }

    enterKey = (event) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            this.browse();

        }
    }

    render() {
        const {classes} = this.props;
        console.log(this.state.searchResults)
        return (
            <div>
                <Card className={classes.card}>
                    <CardActionArea>
                    <TextField
                        id="search"
                        label="Search products"
                        type="search"
                        onKeyDown={this.enterKey}
                        onChange={this.handleChange('search')}
                        className={classes.searchField}
                        margin="normal"
                    />
                    <Button variant="raised" color={'primary'} className={classes.searchButton} onClick={()=>{this.browse()}}>
                        <SearchIcon/>
                    </Button>
                    </CardActionArea>
                    <Divider/>
                    <CardContent>
                    <DateRangePicker
                    startDate={this.state.startDate}
                    startDateId="start"
                    endDate={this.state.endDate}
                    endDateId="end"
                    onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate: endDate })}
                    focusedInput={this.state.focusedInput}
                    onFocusChange={focusedInput => this.setState({ focusedInput })}
                    />
                    <TextField
                        id="personAmount"
                        label="person Amount"
                        type="text"
                        onChange={this.handleChange('personAmount')}
                        className={classes.searchField}
                        margin="normal"
                    />
                        <Button variant="raised" color={'primary'} className={classes.submit} onClick={()=>{this.findByDate()}} >
                            Search
                        </Button>
                    </CardContent>


                    <Rooms searchResults={this.state.searchResults} searched={this.state.searched}/>


                </Card>
            </div>
        )
    }
}

Search.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Search)