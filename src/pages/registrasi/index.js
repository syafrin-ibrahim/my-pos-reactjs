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

//import usefirebase
import {useFirebase} from '../../components/FirebaseProvider';



function Registrasi(){
    const classes = useStyles();

    const [form, setForm] = useState({
        email : '',
        password : '',
        k_password : ''
    })

    const [error, setError] = useState({
        email : '',
        password : '',
        k_password : ''
    })

    const [isSubmit, setSubmit] = useState(false);

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
        if(!form.password){
            newError.password = 'Password Wajib Diisi'
        }
        
        if(!form.k_password)  {
            newError.k_password = 'Ulangi Password Wajib Diisi'
        }else if(form.password !== form.k_password){
            newError.k_password = 'Ulangi Password Harus Sesuai dengan Password'
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
                await auth.createUserWithEmailAndPassword(form.email, form.password)
            }catch(e){
                    const newError = {}

                    switch(e.code){
                        case 'auth/email-already-in-use' :
                                newError.email = "email sudah digunakan";
                        break;
                        case 'auth/invalid-email' :
                                newError.email = "email tidak valid";
                        break;
                        case 'auth/weak-password' :
                                newError.password = "password sangat lemah";
                        break;
                        case 'auth/operation-not-allowed' :
                                newError.email = "metode email dan password tidak didukung";
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
                Buat Akun Baru
                </Typography>
                <form onSubmit={handleSubmit} noValidate>
                    <Textfield value={form.email} onChange={handleChange} helperText={error.email} error={error.email ? true : false} id="email" type="email" name="email" margin="normal" label="alamat email" disabled={isSubmit} fullWidth required/>
                    <Textfield value={form.password} onChange={handleChange} helperText={error.password} error={error.password ? true : false} id="password" type="password" name="password" margin="normal" label="password" disabled={isSubmit} fullWidth required/>
                    <Textfield value={form.k_password} onChange={handleChange} helperText={error.k_password} error={error.k_password ? true : false} id="konfirm_password" type="password" name="k_password" margin="normal" label="ulangi password" disabled={isSubmit} fullWidth required/>
                    <Grid container className={classes.button}>
                        <Grid item xs>
                            <Button type="submit" color="primary" variant="contained" size="large" disabled={isSubmit}>Daftar</Button>
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

export default Registrasi;