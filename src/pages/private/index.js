import React from 'react';
import Config from './pengaturan';

import { Switch, Route } from 'react-router-dom';
import Produk from './produk';
import Transaksi from './transaksi';
import Home from './home';

function Private(){
    return (
       
        <Switch>
            <Route path="/pengaturan" component={Config} />
            <Route path="/produk" component={Produk} />
            <Route path="/transaksi" component={Transaksi} />
            <Route component={Home} />
        </Switch>
    );
}

export default Private;