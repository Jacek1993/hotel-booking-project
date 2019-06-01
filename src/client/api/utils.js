const convertImageUrl = (url) => {
    if (url === undefined) {
        return url
    }
    let convertedUrl = url.split('/');
    return convertedUrl[convertedUrl.length - 1];
}

export{
    convertImageUrl
}