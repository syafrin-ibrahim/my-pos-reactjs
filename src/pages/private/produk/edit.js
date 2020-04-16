import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Textfield from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {useFirebase} from '../../../components/FirebaseProvider';
import {useDocument} from 'react-firebase-hooks/firestore';
import AppPageLoad from '../../../components/appPageloading';
import { useSnackbar } from 'notistack';


function EditProduk({match}){
    const {firestore, user} = useFirebase();
    const produkDoc = firestore.doc(`toko/${user.uid}/produk/${match.params.idProduk}`);
    console.log('produk doc ==>',match.params.idProduk);
    const [snapshot, loading] = useDocument(produkDoc);
    const {enqueueSnackbar} = useSnackbar();
    const [form, setForm] = useState({
        nama : '',
        sku : '',
        harga : 0,
        stock : 0,
        desk : ''
    });

    const [error, setError] = useState({
        nama : '',
        sku : '',
        harga : '',
        stock : '',
        desk : ''
    })

    const [isSubmitting, setSubmitting] = useState(false);
    useEffect(()=>{
            if(snapshot){
                    
                    setForm(currentForm=>({
                        ...currentForm,
                        ...snapshot.data()
                    }));

            }
    }, [snapshot]);


    if(loading){
        return <AppPageLoad></AppPageLoad>
    }

    const handleChange = (e)=>{
        setForm({
            ...form,
            [e.target.name] : e.target.value
        })

        setError({
            ...error,
            [e.target.name] : ''
        })
    }

    const validate = (e)=>{
        const newError = {...error}
        if(!form.nama){
                newError.nama = "Nama Produk Wajib Diisi"
        }
     
        if(!form.harga){
                newError.harga = "Harga Produk Wajib Diisi"
        }
        if(!form.stock){
                newError.stock = "Stock Produk Wajib Diisi"
        }
         return newError;

    }


    const handleSubmit = async (e)=>{
        e.preventDefault();
        const findErrors = validate();
        if(Object.values(findErrors).some(err => err !== '')){
            setError(findErrors);
        }else{
            setSubmitting(true)
            try{

                await produkDoc.set(form,{merge : true})
                enqueueSnackbar('data produk berhasil disimpan', {variant : 'success'})
            }catch(e){
                enqueueSnackbar(e.message, {variant : 'error'})
            }
            setSubmitting(false);
        }
    }

    return (
       
            <div>
                <Typography variant="h5" component="h1">Edit Produk :  </Typography>
                <Grid container>
                    <Grid item xs={12} sm={6}>
                        <form id="produk-form" onSubmit={handleSubmit} noValidate>
                            <Textfield
                                id="nama"
                                name="nama"
                                label="Nama Produk"
                                margin="normal"
                                fullWidth
                                required
                                value={form.nama}
                                onChange={handleChange}
                                helperText={error.nama}
                                error={error.nama ? true : false}
                                disabled={isSubmitting}

                                />
                            <Textfield
                                id="sku"
                                name="sku"
                                label="SKU Produk"
                                margin="normal"
                                fullWidth
                                value={form.sku}
                                onChange={handleChange}
                                helperText={error.sku}
                                error={error.sku ? true : false}
                                disabled={isSubmitting}
                                />
                            <Textfield
                                id="harga"
                                name="harga"
                                label="Harga Produk"
                                type="number"
                                margin="normal"
                                fullWidth
                                required
                                value={form.harga}
                                onChange={handleChange}
                                helperText={error.harga}
                                error={error.harga ? true : false}
                                disabled={isSubmitting}
                                />
                            <Textfield
                                id="stock"
                                name="stock"
                                label="Stock Produk"
                                type="number"
                                margin="normal"
                                fullWidth
                                required
                                value={form.stock}
                                onChange={handleChange}
                                helperText={error.stock}
                                error={error.stock ? true : false}
                                disabled={isSubmitting}
                                />
                            <Textfield
                                id="desk"
                                name="desk"
                                label="Deskripsi Produk"
                                multiline
                                rowsMax={3}
                                type="number"
                                margin="normal"
                                fullWidth
                                value={form.desk}
                                onChange={handleChange}
                                helperText={error.desk}
                                error={error.desk ? true : false}
                                disabled={isSubmitting}
                                />
                        </form>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography>Upload Gambar</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Button form="produk-form" type="submit" disabled={isSubmitting} color="primary" variant="contained">Simpan</Button>
                    </Grid>
                </Grid>
            </div>
      
    );
}

export default EditProduk;