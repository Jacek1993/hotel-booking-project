import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

export default function withAuth(ComponentToProtect) {

    return class extends Component {
        constructor(props) {
            super(props);
            this.state = {
                status: true,
                redirect: false
            };
            console.log(props.match.params);
        }

        componentDidMount() {
            fetch('/checkToken')
                .then(res => {
                    if (res.status <= 202) {
                        this.setState({loading: false});
                    } else {
                        const error = new Error(res.error);
                        throw error;
                    }
                })
                .catch(err => {
                    console.error(err);
                    this.setState({loading: false, redirect: true});
                });
        }

        render() {
            const {loading, redirect} = this.state;
            if (loading) {
                return null;
            }
            if (redirect) {
                return <Redirect to="/login"/>;
            }
            return (
                <React.Fragment>
                    <ComponentToProtect {...this.props} />
                </React.Fragment>
            );
        }
    }
}










