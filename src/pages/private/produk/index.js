import React from 'react';
import {Switch, Route} from 'react-router-dom';
import EditProduk from './edit';
import GridProduk from './grid';


function Produk(){
    return (
        <Switch>
            <Route path="/produk/edit/:idProduk" component={EditProduk}/>
            <Route path="/produk" component={GridProduk} />

        </Switch>

    );
}

export default Produk;