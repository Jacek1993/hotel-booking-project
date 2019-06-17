const convertImageUrl = (url) => {
    if (url === undefined) {
        return url
    }
    let convertedUrl = url.split('/');
    return convertedUrl[convertedUrl.length - 1];
}
const getReservationSlug=()=>{
    const reservation=JSON.parse(localStorage.getItem('reservation'));
    if(reservation){
        return reservation.slug;
    }
    return undefined;

}

export{
    convertImageUrl,
    getReservationSlug
}