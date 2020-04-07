import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Textfield from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import {Link,Redirect} from 'react-router-dom';
import useStyles from './style';
import isEmail from 'validator/lib/isEmail';
import AppLoading from '../../components/app-loading';
import {useFirebase} from '../../components/FirebaseProvider';
import {useSnackbar} from 'notistack';

function ForgotPass(){
    

 const classes = useStyles();

 const [form, setForm] = useState({
     email : ''
 })

 const [error, setError] = useState({
     email : ''
 })

 const [isSubmit, setSubmit] = useState(false);

 const {enqueueSnackbar} = useSnackbar();

 const handleChange = (e)=>{
     setForm({
         ...form,
         [e.target.name] : e.target.value
     })

     setError({
         ...error,
         [e.target.name] : ''
     });
 }

 const {auth, user, loading} = useFirebase();

 const validate = (e)=>{
     const newError =  {...error};
     if(!form.email){
         newError.email = 'Email Wajib Diisi'
     }else if(!isEmail(form.email))  {
         newError.email = 'Email Tidak Valid'
     }
    
     return newError;
 }

 const handleSubmit = async(e)=>{
     e.preventDefault();
     const findError = validate();

     if(Object.values(findError).some(err => err !== '')){
         setError(findError);
     }else{
         try{
             setSubmit(true)
             const actionCodeSetting = {
                 url : `${window.location.origin}/login`
             }
             await auth.sendPasswordResetEmail(form.email, actionCodeSetting )
             setSubmit(false)
             enqueueSnackbar(`cek kotak masuk email : ${form.email}, sebuah tautan untuk me reset password telah dikirim`,
             {
                 variant : "success"
             })
         }catch(e){
                 const newError = {}

                 switch(e.code){
                     case 'auth/user-not-found' :
                             newError.email = "email tidak terdaftar";
                     break;
                     case 'auth/invalid-email' :
                             newError.email = "email tidak valid";
                     break;
                     default : newError.email = 'terjadi kesalahan silahkan coba lagi';
                     break;
                 }
                 setError(newError);
                 setSubmit(false);
         }
     }
 }

 if(loading){
     return <AppLoading/>
 }

 if(user){
     
     return <Redirect to='/' />
 }

 console.log(user);
   
    return (
        <><Container maxWidth="xs">
            <Paper className={classes.paper}>
                <Typography variant="h5" component="h1" className={classes.title}>
                Lupa Password
                </Typography>
                <form onSubmit={handleSubmit} noValidate>
                    <Textfield value={form.email} onChange={handleChange} helperText={error.email} error={error.email ? true : false} id="email" type="email" name="email" margin="normal" label="alamat email" disabled={isSubmit} fullWidth required/>
                    <Grid container className={classes.button}>
                        <Grid item xs>
                            <Button type="submit" color="primary" variant="contained" size="large" disabled={isSubmit}>Kirim</Button>
                        </Grid>
                        <Grid item>
                            <Button component={Link} to="/login" variant="contained" size="large" disabled={isSubmit}>Login</Button>
                        </Grid>
                    </Grid>
                   
                </form>
               
            </Paper>
        </Container>
        </>  
    );
}

export default ForgotPass;