import React,  {useState, useEffect } from 'react';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';
import useStyles from './styles/grid';
import AddDialog from './add';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import { useFirebase } from '../../../components/FirebaseProvider';
import { useCollection } from 'react-firebase-hooks/firestore';
import AppPageLoad from '../../../components/appPageloading';
import ImageIcon from '@material-ui/icons/Image';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import {currency} from '../../../utils/formatter';
import {Link} from 'react-router-dom';

function GridProduk(){
    const classes = useStyles();
    const {firestore, storage, user} = useFirebase();
    const produkCol = firestore.collection(`toko/${user.uid}/produk`);
    
    //fetcing data
    const [snapshoot, loading] = useCollection(produkCol);

    //state produk
    const [items, setItem] = useState([]);
    const [openDialog, setopenDialog] = useState(false);

    useEffect(()=>{
            if(snapshoot){
                setItem(snapshoot.docs);
                console.log(snapshoot.docs);
            }
    },[snapshoot]);


    if(loading){
        return <AppPageLoad/>
    }

    const handleDelete = produkDoc => async e=>{
        if(window.confirm(' anda yakin akan menghapus produk ini ?')){
            await produkDoc.ref.delete();
            const fotoUrl = produkDoc.data().foto;
            console.log(fotoUrl);
            // if(fotoUrl){
            //     storage.refFromURL(fotoUrl).delete();
            // }
        }
    }


    return (
        <>
        <Typography variant="h5" component="h1" paragraph>Daftar Produk</Typography>
        { items.length <= 0 && 
        <Typography>Belum Ada Data Produk</Typography>
        }
        <Grid container spacing={5}>
            {

                items.map((produkItem)=>{
                        const data = produkItem.data();
                      //  console.log('datanya adalah  ', data);
                        return <Grid key={produkItem.id} item={true} xs={12} sm={12} md={6} lg={4}>
                                <Card className={classes.card} >
                                    {
                                        data.foto && 
                                        <CardMedia 
                                        image={data.foto} 
                                        title={data.nama}
                                        className={classes.foto}/> 
                                        
                                    }
                                    {
                                        !data.foto &&
                                        <div className={classes.fotoPlaceHolder}>
                                            <ImageIcon
                                                size="large"
                                                color="disabled"/>
                                        </div>
                                    }
                                    {console.log('data foto', data.foto)}
                                    <CardContent className={classes.details}>
                                        <Typography variant="h5" noWrap>{data.nama}</Typography>
                                        <Typography variant="subtitle1" >{currency(data.harga)}</Typography>
                                        <Typography >{data.stock}</Typography>
                                    </CardContent>
                                    <CardActions className={classes.action}>
                                        <IconButton  component={Link} to={`/produk/edit/${produkItem.id}`}>
                                            <EditIcon/>
                                        </IconButton>
                                        <IconButton onClick={handleDelete(produkItem)}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </CardActions>
                                </Card>
                                </Grid>
                })
            }
        </Grid>
        
        
        
        
        
        <Fab 
        color = 'primary'
        className = {classes.fab}
         onClick ={(e)=>{
             setopenDialog(true);
         }}>
            <AddIcon />
        </Fab>
        <AddDialog open={openDialog} 
            handleClose={(e)=>{ 
                setopenDialog(false);
            }} />
        </>
    );
}

export default GridProduk;