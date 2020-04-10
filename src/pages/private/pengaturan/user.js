import React, { useRef, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { useFirebase } from '../../../components/FirebaseProvider';
import { useSnackbar } from 'notistack';
import validation from 'validator/lib/isEmail';
import useStyles from './styles/user';
import Button from '@material-ui/core/Button';

function User(){
    const {user} = useFirebase();
    const Classes = useStyles();
    const [isSubmitting, setSubmitting] = useState(false);
    const [error, setError] = useState({
        displayName  : '',
        displayEmail : '',
        displayPass : ''
    });


    const displayNameRef = useRef();
    const displayEmailRef = useRef();
    const passRef = useRef();
    const {enqueueSnackbar} = useSnackbar();

    const saveDisplayName = async(e)=>{
        const dName = displayNameRef.current.value;
        console.log(dName);
        if(!dName){
            setError({
                displayName : 'Nama Wajib Di isi'
            })
        }else if(dName !== user.displayName){
                setError({
                    displayName : ''
                })
                setSubmitting(true);
                await user.updateProfile({
                    displayName : dName
                }).then(function(){
                    console.log(user.displayName);

                },function(error){
                    console.log('pesan error : ' + error);
                });
                setSubmitting(false);
                enqueueSnackbar('data user berhasil diupdate', { variant : 'success'});
      }
    }

    const saveDisplayEmail = async(e)=>{
        const dEmail = displayEmailRef.current.value;
        console.log(dEmail);
        if(!dEmail){
            setError({
                displayEmail : 'Email Wajib Di isi'
            })
        }else if(!validation(dEmail)){
            
            setError({
                displayEmail : 'Email Tidak Valid'
           })
        }else if(dEmail !== user.email){
            setError({
                displayEmail : ''
            })
            setSubmitting(true);
            try{
               
                await user.updateEmail(
                     dEmail 
                )
                console.log(user.email);
                setSubmitting(false);
                enqueueSnackbar('email user berhasil diupdate', { variant : 'success'});
            }catch(e){
                let emailError;
                switch(e.code){
                    case 'auth/email-already-in-use' : 
                        emailError = 'Email Sudah Digunakan'
                    break;
                    case 'auth/invalid-email' : 
                        emailError = 'Email Tidak Valid'
                    break;
                    case 'auth/requires-recent-login' : 
                        emailError = 'Silahkan Log Out, Kmeudian Login kembali untuk memperbaharui email'
                    break;
                    default : 
                        emailError = 'Terjadi Kesalahan Silah Coba Kembali'
                    break;
                }
                setError({
                    displayEmail : emailError
                })
            }
            setSubmitting(false);
            // setError({
                //     displayEmail : ''
                // })
                // setSubmitting(true);
                // await user.updateEmail({
                //     newEmail : dEmail
                // }).then(function(){
                //     console.log(user.displayEmail);

                // },function(error){
                //     console.log('pesan error : ' + error);
                // });
                // setSubmitting(false);
                // enqueueSnackbar('data user berhasil diupdate', { variant : 'success'});
      }
    }
const updatePassword = async (e)=>{
    const pass = passRef.current.value;
    console.log(pass);
    if(!pass){
        setError({
            displayPass : 'Maaf Password Harus Diisi'
        })
    }else{
        setSubmitting(true);
        try{
            await user.updatePassword(pass);
            setSubmitting(false);
            enqueueSnackbar('password user berhasil dirubah', {variant : 'success'})
        }catch(e){
            let errPass = '';
            switch(e.code){
                case 'auth/weak-password' : 
                    errPass = 'Password Terlalu Lemah'
                break;
                case 'auth/requires-recent-login' : 
                    errPass= 'Silahkan Log Out, Kmeudian Login kembali untuk memperbaharui password'
                break;
                default : 
                    errPass = 'Terjadi Kesalahan Silah Coba Kembali'
                break;
            }
            setError({
                displayPass : errPass
            })

        }
        setSubmitting(false);
    }
}
const sendEmailVerification = async(e)=>{
    const actionCode = {
        url : `${window.location.origin}/login`
    }
    setSubmitting(true);
    await user.sendEmailVerification(actionCode);
    enqueueSnackbar(`email verifikasi berhasil dikirim ke ${displayEmailRef.current.value}`, { variant : 'success'});
    setSubmitting(false);
}



    return (
        <>
        <div className={Classes.formStyle}>
        <TextField id="displayName"
          name="displayName"
          label="Nama"
          margin="normal"
          defaultValue = {user.displayName}
          inputProps={{
              ref : displayNameRef,
              onBlur : saveDisplayName 
          }}
          disabled={isSubmitting}
          helperText = {error.displayName}
          error={error.displayName ? true : false}
          />

        <TextField id="displayEmail"
          name="displayEmail"
          label="EMail"
          type="email"
          margin="normal"
          defaultValue = {user.email}
          inputProps={{
              ref : displayEmailRef,
              onBlur : saveDisplayEmail 
          }}
          disabled={isSubmitting}
          helperText = {error.displayEmail}
          error={error.displayEmail ? true : false}
          />

          {
              user.emailVerified ? <Typography color="primary" variant="subtitle1">Email Sudah Terverifikasi</Typography>
              :
                <Button variant="outlined" onClick={sendEmailVerification}>
                        kirim email verifikasi
                </Button>
          }

          <TextField
          name="password"
          id="password"
          label="Password Baru"
          margin="normal"
          defaultValue = {user.password}
          inputProps = {{
              ref : passRef,
              onBlur : updatePassword
          }}
          disabled={isSubmitting}
          autoComplete="new-password"
          helperText={error.displayPass}
          error = {error.displayPass ? true : false}
          />
          </div>
        </>  
    );
}

export default User;