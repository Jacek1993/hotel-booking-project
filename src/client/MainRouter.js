import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import Home from './core/Home';
import Signup from './usr/Signup';
import Menu from './core/Menu';
import Signin from "./usr/Signin";
import withAuth from "./usr/withAuth";
import Secret from "./usr/UserProfile";


class MainRouter extends Component{
    render(){
        return (<div>
            <Menu/>
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route path="/signup" component={Signup}/>
                <Route path="/signin" component={Signin}/>
                <Route path="/secret/mati" component={withAuth(Secret)}/>
            </Switch>
        </div>)
    }
}

export default MainRouter;