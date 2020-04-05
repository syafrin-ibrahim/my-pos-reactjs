import React from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import Toko from './toko';
import User from './user';

function Config(){
    return (
       <Switch>
           <Route path="/pengaturan/user" component={User}/>
           <Route path="/pengaturan/toko" component={Toko}/>
            <Redirect to="/pengaturan/user"/>
       </Switch>
    );
}

export default Config;