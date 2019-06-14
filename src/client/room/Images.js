import {MDBCarousel, MDBCarouselInner, MDBCarouselItem, MDBContainer, MDBView} from "mdbreact";
import {config} from "../../config/clientConfig";
import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";


const styles = theme => ({
    image:{
        width: "100%",
        maxHeight: "80%",
        margin: "10px auto 20px",
        display: "blocks"
    },
    view:{
        display: "table-cell",
        height: "80%",
        textAlign: "center",
        width: "100%",
        verticalAlign: "middle"
    }
})
const Images=(props)=>{
    const classes=props
    return  (<MDBContainer>
        <MDBCarousel
            activeItem={1}
            length={props.room.picture.length}
            showControls={false}
            showIndicators={false}
            className="z-depth-1"
        >
            <MDBCarouselInner >
                {props.room.picture.map((content, i)=>{return (
                    <MDBCarouselItem itemId={i}>
                        <MDBView className={classes.view}>
                            <img
                                className={classes.image}
                                src={`${config.imageURL}/${content}`}
                                alt="First slide"
                            />
                        </MDBView>
                    </MDBCarouselItem>)
                })}
            </MDBCarouselInner>
        </MDBCarousel>
    </MDBContainer>);
}

export default withStyles(styles)(Images)