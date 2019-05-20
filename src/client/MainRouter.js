import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import Home from './core/Home';
import Signup from './usr/Signup';
import Menu from './core/Menu';
import Signin from "./usr/Signin";
import withAuth from "./usr/withAuth";
import Secret from "./usr/UserProfile";
import EditProfile from "./usr/EditProfile";
import MyShops from "./room/MyShops";


class MainRouter extends Component{
    constructor(props){
        super(props);
        this.state={
            slug: '',
            role: ''
        }
    }

    SignInCallback=(Data)=>{
        if(Data.slug) {
            this.setState({slug: Data.slug});
            this.setState({role:  Data.role})
            console.log(this.state.slug)
        }
    }


    render(){
        return (<div>
            <Menu slug={this.state.slug} role={this.state.role}/>
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route path="/signup" component={Signup}/>
                <Route path="/signin" render={(props)=><Signin {...props} slugCallback={this.SignInCallback.bind(this)} />}/>
                <Route path={`/secret/:${this.state.slug}`} component={withAuth(Secret)}/>
                <Route path={`/user/edit/:${this.state.slug}`} component={withAuth(EditProfile)}/>
                <Route path={`/user/rooms`} component={withAuth(MyShops)}/>
            </Switch>
        </div>)
    }
}

//Problem nie moge podac sluga jako parametru probowalem to zrobic w props w menu ale wtedy za kazdym razem musze przesylac go w funkcji isAuthenticated
//Zrobic caly widok Profilu dla uzytkownika
//zrobic tworzenei rezerwacji oraz dodawanie opini wzorowac sie na MERN FullSTack

export default MainRouter;