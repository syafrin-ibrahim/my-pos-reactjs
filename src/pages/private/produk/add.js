import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Texfield from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogAction from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
//import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {useFirebase} from '../../../components/FirebaseProvider';
import {withRouter} from 'react-router-dom';



function AddDialog({history, open, handleClose}){
  const {firestore, user} = useFirebase();
  const ProdukCol = firestore.collection(`toko/${user.uid}/produk`);
   
    const [isSubmitting, setSubmitting] = useState(false);
    const [nama, setNama] = useState('');
    const [error, setError] = useState('');
    const  handleSave = async (e)=>{
        setSubmitting(true);
        try{
            if(!nama){

                throw new Error(' Nama Produk Harus Diisi');
            }
            const newProduk =  await ProdukCol.add( {nama} );
            history.push(`produk/edit/${newProduk.id}`)
        }catch(e){
            setError(e.message);
        }
        setSubmitting(false);
    }
    return(
            <Dialog
             open={open}
             onClose={handleClose}
             disableBackdropClick={isSubmitting}
             disableEscapeKeyDown={isSubmitting}
             >
                <DialogTitle>Buat Produk Baru</DialogTitle>
                <DialogContent dividers>
                    <Texfield
                        id="nama"
                        value={nama}
                        label="nama produk"
                        onChange={(e)=>{
                                setError('');
                                setNama(e.target.value);
                        
                        }}
                        disabled ={isSubmitting}
                        helperText={error}
                        error = {error ? true : false}
                        />

                </DialogContent>
                <DialogAction>
                    <Button onClick={handleClose} disabled ={isSubmitting}>Batal</Button>
                    <Button color="primary" disabled ={isSubmitting} onClick={handleSave}>Simpan</Button>
                </DialogAction>
            </Dialog>
    )
}

AddDialog.propTypes = {
    open : PropTypes.bool.isRequired,
    handleClose :  PropTypes.func.isRequired
}
export default withRouter(AddDialog);