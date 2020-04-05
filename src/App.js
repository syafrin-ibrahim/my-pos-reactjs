import React, { Fragment } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Registrasi from './pages/registrasi';
import Login from './pages/login';
import ForgotPass from './pages/forgot-pass';
import NotFound from './pages/404';
import Private from './pages/private';

import PrivateRoute from './components/PrivateRoute';
import FirebaseProvider from './components/FirebaseProvider';

function App() {
  return (
    <FirebaseProvider>
        <Fragment>
          <Router>
            <Switch>

              
                <Route path="/registrasi" component={Registrasi} />
                <Route path="/login" component={Login} />
                <Route path="/forgot-pass" component={ForgotPass} />
                <PrivateRoute path="/pengaturan" component={Private} />
                <PrivateRoute path="/produk" component={Private} />
                <PrivateRoute path="/transaksi" component={Private} />
                <PrivateRoute path="/" exact component={Private} />
                <PrivateRoute component={NotFound} />

            </Switch>
          </Router>
        </Fragment>

    </FirebaseProvider>
   
  );
}

export default App;
