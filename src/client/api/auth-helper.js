const isAuthenticated = (state) => {
    fetch('/checkToken')
        .then(res => {

            if (res.status <=202) {

                state.setState({status: true});
                console.log('how my i')
                if(res.status===202){
                    state.setState({admin: true});

                }else{
                    state.setState({admin: false});                }

            }
            else {
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


