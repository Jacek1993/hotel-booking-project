import React from 'react'
import PropTypes from 'prop-types'
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import {Link} from 'react-router-dom'
import {config} from '../../config/clientConfig'
import {convertImageUrl} from '../api/utils'
import AddToCart from '../cart/AddToCart'

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        background: theme.palette.background.paper,
        textAlign: 'left',
        padding: '0 8px'
    },
    container: {
        minWidth: '100%',
        paddingBottom: '14px'
    },
    gridList: {
        width: '100%',
        minHeight: 200,
        padding: '16px 0 10px'
    },
    title: {
        padding:`${theme.spacing.unit * 3}px ${theme.spacing.unit * 2.5}px ${theme.spacing.unit * 2}px`,
        color: theme.palette.openTitle,
        width: '100%'
    },
    tile: {
        textAlign: 'center'
    },
    image: {
        height: '100%'
    },
    tileBar: {
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
        textAlign: 'left'
    },
    tileTitle: {
        fontSize:'1.1em',
        marginBottom:'5px',
        color:'rgb(189, 222, 219)',
        display:'block'
    },
    addCart: {
        width: '35px',
        height: '35px',
        padding: '10px 12px',
        borderRadius: '0.25em',
        backgroundColor: '#5f7c8b'
    }
})


const Rooms =(props)=> {
        const {classes} = props

        return (
            <div className={classes.root}>
                {props.searchResults.length > 0 ?
                    (<div className={classes.container}>
                        <GridList cellHeight={200} className={classes.gridList} cols={3}>
                            {props.searchResults&& (props.searchResults.map((room, i) => (
                                <GridListTile key={i} className={classes.tile}>
                                    <Link to={`/user/room/${room.slug}`}><img className={classes.image} src={`${config.imageURL}/${convertImageUrl(room.picture[0])}`} alt={room.roomNumber} /></Link>
                                    <GridListTileBar className={classes.tileBar}
                                                     title={<Link to={`/room/${room.slug}`} className={classes.tileTitle}>{room.description[0]}</Link>}
                                                     subtitle={<span>$ {room.roomNumber}</span>}
                                                     actionIcon={
                                                         <AddToCart item={room} startDate={props.startDate} endDate={props.endDate} cartStyle={classes.addCart}/>
                                                     }
                                    />
                                </GridListTile>
                            )))}
                        </GridList></div>) : props.searched && (<Typography type="subheading" component="h4" className={classes.title}>No products found! :(</Typography>)}
            </div>)

}
Rooms.propTypes = {
    classes: PropTypes.object.isRequired,
    searchResults: PropTypes.array.isRequired,
    searched: PropTypes.bool.isRequired
}

export default withStyles(styles)(Rooms)