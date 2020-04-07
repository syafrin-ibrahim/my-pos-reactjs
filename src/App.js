import React, { Fragment } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Registrasi from './pages/registrasi';
import Login from './pages/login';
import ForgotPass from './pages/forgot-pass';
import NotFound from './pages/404';
import Private from './pages/private';

import PrivateRoute from './components/PrivateRoute';
import FirebaseProvider from './components/FirebaseProvider';
import CssBaseline from '@material-ui/core/CssBaseline';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import theme from './config/theme';
import {SnackbarProvider} from 'notistack';
function App() {
  return (
    <>
    <CssBaseline>
      <ThemeProvider  theme={theme}>
        <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
          <FirebaseProvider>
            
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
            

          </FirebaseProvider>
        </SnackbarProvider>
    </ThemeProvider>
    </CssBaseline>
   </>
  );
}

export default App;
