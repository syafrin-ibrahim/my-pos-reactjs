import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Textfield from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {useFirebase} from '../../../components/FirebaseProvider';
import {useDocument} from 'react-firebase-hooks/firestore';
import AppPageLoad from '../../../components/appPageloading';
import { useSnackbar } from 'notistack';
import useStyles from './styles/edit';
import UploadIcon from '@material-ui/icons/CloudUpload';
import SaveIcon from '@material-ui/icons/Save';
import {Prompt} from 'react-router-dom';
 
function EditProduk({match}){
    const classes = useStyles();
    const {firestore, storage, user} = useFirebase();
    const produkRef = storage.ref(`toko/${user.uid}/produk`);
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

    const [isChange, setChange] = useState(false);

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

        setChange(true);
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
                setChange(false);
            }catch(e){
                enqueueSnackbar(e.message, {variant : 'error'})
            }
            setSubmitting(false);
        }
    }

    const handleUpload = async (e)=>{
        const file = e.target.files[0];
        if(!['image/png','image/jpeg'].includes(file.type)){
            setError({
                ...error,
                foto : `Tipe File Tidak Mendukung ${file.type}`
            })
        }else if(file.size >= 512000){
            setError({
                ...error,
                foto : `Ukuran File Lebih Besar Dari 500 kb `
            })
        }else{

            const reader = new FileReader();
            reader.onabort = ()=>{
                setError((error)=>({
                    ...error,
                    foto : 'proses pembacaan file dibatalkan'
                }));
            }

            reader.onerror = ()=>{
                setError((error)=>({
                    ...error,
                    foto : 'file tidak bisa dibaca'
                }));
            }

            reader.onload = async ()=>{
                    setSubmitting(true);
                    try{
                        const fotoExt = file.name.substring(file.name.lastIndexOf('.'));

                        const fotoRef = produkRef.child(`${match.params.idProduk}${fotoExt}`);
                        const fotoSnapShoot = await  fotoRef.putString(reader.result, 'data_url');     
                        const fotoUrl = await fotoSnapShoot.ref.getDownloadURL()

                        setForm(currentForm => ({
                            ...currentForm,
                            foto : fotoUrl

                        }));
                        setChange(true);
                    }catch(e){
                        setError((error)=>({
                            ...error,
                            foto : e.message
                        }));
                    }
                    setSubmitting(false);
            }

            reader.readAsDataURL(file);


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
                        <div className={classes.upload}>
                                <Typography>Upload Gambar</Typography>
                                {form.foto &&
                                <img src={form.foto} alt={`Foto Produk ${form.nama}`} className={classes.preview    }/>}
                                <input type="file"
                                        className={classes.hideText}
                                    name="gbr" 
                                    id="gbr"
                                    accept="image/jpeg, image/png"
                                    onChange={handleUpload}/>
                                <label htmlFor="gbr">
                                <Button variant="outlined" component="span" disabled={isSubmitting}>upload <UploadIcon className={classes.icon}/></Button>
                                </label>
                                { error.foto &&
                                <Typography color="error">
                                    {error.foto}
                                </Typography> }
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <div className={classes.actionButton}>
                        <Button form="produk-form" type="submit" disabled={isSubmitting || !isChange} color="primary" variant="contained"><SaveIcon className={classes.iconLeft}/> Simpan</Button>
                        </div>
                    </Grid>
                </Grid>
                <Prompt
                    when={isChange}
                    message="terdapat perubahan yang belum disimpan, apakah anda yakin meninggalkan halaman ini ? "
                    />
            </div>
      
    );
}

export default EditProduk;