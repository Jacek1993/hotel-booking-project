const isAuthenticated = (state) => {
    fetch('/checkToken')
        .then(res => {
            if (res.status === 200) {
                state.setState({status: true});
            } else {
                state.setState({status: false})
            }
        })
        .catch(err => {
            console.error(err);
            state.setState({status: false});
        });
};

export {
    isAuthenticated
}


