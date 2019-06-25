function getRootUrl(){
    const port = process.env.PORT || 9000;
    const dev=process.env.NODE_ENV!=='production';
     return dev ? `http://localhost:${port}` : `http://localhost:${port}`;

}
export default getRootUrl;