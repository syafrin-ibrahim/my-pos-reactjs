import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { useFirebase } from '../../../components/FirebaseProvider';
import { useCollection } from 'react-firebase-hooks/firestore';
import Grid from '@material-ui/core/Grid';
import {currency} from '../../../utils/formatter';
import format from 'date-fns/format';
import AppPageLoading from '../../../components/appPageloading';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ViewIcon from '@material-ui/icons/Visibility';
import useStyles from './styles/'; 
import DialogConfirm from './detail';


function Transaksi(){
    const { firestore, user } = useFirebase();
    const transaksiCol = firestore.collection(`toko/${user.uid}/transaksi`);
    const [snapshoot, loading] = useCollection(transaksiCol);
    const [tItems, setTItems] = useState([]);
    const classes = useStyles();
    const [details, setDetails] = useState({
        open : false,
        transaksi : {}
    })
    useEffect(()=>{
            if(snapshoot){
                setTItems(snapshoot.docs);
            }
    },[snapshoot]);

    if(loading){
        return <AppPageLoading></AppPageLoading>
    }

    const handleCloseDetails = (e)=>{
        setDetails({
            open : false,
            transaksi : {}
        })
    }
    const handleDelete = transaksiDoc => async (e)=>{
            if(window.confirm('Apakah anda yakin akan menghapus transaksi ini ?')){
                await transaksiDoc.ref.delete();
            }
    }

    const handleView = transaksiDoc => ()=>{
        setDetails({
            open : true,
            transaksi : transaksiDoc.data()
        })
    }

    return (
        <>
         <Typography variant="h5" component="h1" paragraph>Daftar Transaksi</Typography>
              {
                  tItems.length <= 0 &&
                  <Typography>Belum Ada Transaksi</Typography>
              }
              <Grid container spacing={5}>
                    {
                        tItems.map((transaksiDoc)=>{
                                const Tdata = transaksiDoc.data();
                                return(
                                    <Grid key={transaksiDoc.id} item xs={12} sm={12} md={6} lg={4}>
                                        <Card className={classes.card}>
                                            <CardContent className={classes.summary}>
                                                <Typography variant="h5" noWrap>No : {Tdata.no}</Typography>
                                                <Typography>Total : {currency(Tdata.total)}</Typography>
                                                <Typography>Tanggal  : {format(new Date(Tdata.timestamp), 'dd-MM-yyyy')}</Typography>
                                            </CardContent>
                                            <CardActions className={classes.action}>
                                                <IconButton onClick={handleView(transaksiDoc)}><ViewIcon/></IconButton>
                                                <IconButton onClick={handleDelete(transaksiDoc)}><DeleteIcon/></IconButton>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                )
                        })
                    }
              </Grid>
              <DialogConfirm open={details.open} handleClose={handleCloseDetails} transaksi={details.transaksi} ></DialogConfirm>
        </>
    );
}

export default Transaksi;