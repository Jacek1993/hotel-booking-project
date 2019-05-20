function getRootUrl(){
    const port = process.env.PORT || 3000;
    const dev=process.env.NODE_ENV!=='production';
     return dev ? `http://localhost:${port}` : `http://localhost:${port}`;

}

export function getRoomImageURL(){
    return getRootUrl()+'/room/image'
}

export default getRootUrl;