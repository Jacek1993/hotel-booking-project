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

            this.convertUrl=this.convertUrl.bind(this);
            props.match.url=this.convertUrl(props.match.url);
            console.log(props.match.url)
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

        convertUrl = (url) => {
            if (url === undefined) {
                return url
            }
            let convertedUrl = url.split('/');
            return convertedUrl[convertedUrl.length - 1];
        }

        render() {
            const {loading, redirect} = this.state;
            if (loading) {
                return null;
            }
            if (redirect) {
                return <Redirect to="/signin"/>;
            }
            return (
                <React.Fragment>
                    <ComponentToProtect {...this.props} />
                </React.Fragment>
            );
        }
    }
}










