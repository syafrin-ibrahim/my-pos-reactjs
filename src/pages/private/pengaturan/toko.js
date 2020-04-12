import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import useStyles from './styles/toko';
import { useFirebase } from '../../../components/FirebaseProvider';
import { useSnackbar } from 'notistack';
import { useDocument} from 'react-firebase-hooks/firestore';
import AppPageLoading from '../../../components/appPageloading';
import {Prompt} from 'react-router-dom';

function Toko(){
    const {firestore, user} = useFirebase();
    const tokoDoc = firestore.doc(`toko/${user.uid}`);
    const classes = useStyles();
     
    


    const [toko, setToko] = useState({
        nama : '',
        alamat : '',
        telepon : ''
    });

    const {enqueueSnackbar} = useSnackbar();

    const [error, setError] = useState({
        nama : '',
        alamat : '',
        telepon : ''
    })
    const [isChange, setChange] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);
     //react firebase hooks
    const [snapshoot, loading] = useDocument(tokoDoc);
    useEffect(()=>{
        if(snapshoot){
            setToko(snapshoot.data());
        }
    }, [snapshoot]);

   

    if(loading){
        return <AppPageLoading />
    }

  


    
    const handleChange = (e)=>{
            setToko({
                ...toko,
                [e.target.name] : e.target.value
            })
          //  console.log(e.target.value);
          setError({
              [e.target.name] : ''
          })
          setChange(true);
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
        const findError = validate();

        if(Object.values(findError).some(err => err !== '')){
            setError(findError);
        }else{
            setSubmitting(true);
            try{
                
                await tokoDoc.set(toko,{merge : true});
                setChange(false);
                enqueueSnackbar('data toko berhasil disimpan',{variant : 'success'});
            }catch(e){
                console.log('erornya ', e.message);
                enqueueSnackbar(e.message, {variant : 'error'});
            }
            setSubmitting(false);
        }
    }
    
    const validate = (e)=>{
        const newError = {...error}
        if(!toko.nama){
                newError.nama = "Nama Toko Wajib Diisi"
        }
        if(!toko.alamat){
                newError.alamat = "Alamat Toko Wajib Diisi"
        }
        if(!toko.telepon){
                newError.telepon = "Nama Toko Wajib Diisi"
        }
         return newError;

    }
    return (
        <div className={classes.formStyle}>
            <form onSubmit={handleSubmit}>
                <TextField
                label="Nama Toko"
                id="nama"
                name="nama"
                margin="normal"
                fullWidth
                value={toko.nama}
                onChange={handleChange}
                error={error.nama ? true : false}
                helperText={error.nama}
                disabled={isSubmitting}
                />
                <TextField
                label="Alamat Toko"
                id="alamat"
                name="alamat"
                margin="normal"
                fullWidth
                multiline
                rowsMax={3}
                value={toko.alamat}
                onChange={handleChange}
                error={error.alamat ? true : false}
                helperText={error.alamat}
                disabled={isSubmitting}
                />
                <TextField
                label="Telepon"
                id="telepon"
                name="telepon"
                margin="normal"
                fullWidth
                value={toko.telepon}
                onChange={handleChange}
                error={error.telepon ? true : false}
                helperText={error.telepon}
                disabled={isSubmitting}
                />

                <Button
                    className={classes.buttonAct}
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting || !isChange}
                    type="submit"
                >
                    simpan
                </Button>
            </form>  
            <Prompt 
                when={isChange}
                message="Terdapat perubahan yang belum disimpan, apakaha anda yakin akan meninggalkan halaman ini ?"
            />
        </div>
    );
}

export default Toko;