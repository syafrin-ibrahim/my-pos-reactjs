import React from 'react';

import {Route, Switch, Redirect} from 'react-router-dom';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import Toko from './toko';
import User from './user';
import useStyles from './styles';

function Config(props){
    const {location, history} = props;
    const classes = useStyles();
    const handleChangeTab = (event, value)=>{
        history.push(value);    
    }
    return (
        <Paper square>
            <Tabs value={location.pathname} indicatorColor="primary" textColor="primary" onChange={handleChangeTab}>
                <Tab label="pengguna" value="/pengaturan/user"/>
                <Tab label="toko" value="/pengaturan/toko"/>
            </Tabs>
            <div className={classes.tabContent}>
                <Switch>
            <Route path="/pengaturan/user" component={User}/>
            <Route path="/pengaturan/toko" component={Toko}/>
                <Redirect to="/pengaturan/user"/>
                </Switch>
            </div>
       </Paper>
    );
}

export default Config;