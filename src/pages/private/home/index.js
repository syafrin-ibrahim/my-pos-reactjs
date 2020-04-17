import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import { useFirebase } from '../../../components/FirebaseProvider';
import Typography from '@material-ui/core/Typography';
import {useCollection} from 'react-firebase-hooks/firestore';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import TextField from '@material-ui/core/TextField';
import AppPageLoading from '../../../components/appPageloading';
import useStyles from './styles';
// const handleClick = ()=>{

// }

function Home(){
    const {auth, firestore, user} = useFirebase();
    const ProdukCol = firestore.collection(`toko/${user.uid}/produk`);
    const [snapProduk, loadingProduk] = useCollection(ProdukCol);
    const [filter, setFilter] = useState('');
    const [Items, setItem] = useState([]);
    const classes = useStyles();

    useEffect(()=>{
        if(snapProduk){
         
            setItem(snapProduk.docs.filter((produkDoc) => {
                if(filter){
                        return produkDoc.data().nama.toLowerCase().includes(filter.toLowerCase());
                }

                return true;
            }));
        }
    },[snapProduk, filter]);

    if(loadingProduk){
        return <AppPageLoading></AppPageLoading>
    }

    return (
        <>
        <h1 variant="h5" component="h1" paragraph="true">Buat Transaksi Baru</h1> 
        <Grid container>
            <Grid item xs={12}>
                    <List className={classes.produkList} component="nav" 
                    subheader={
                        <ListSubheader component="div">
                            <TextField
                            autoFocus
                            label="cari produk"
                            fullWidth 
                            margin="normal"
                            onChange={ (e)=>{
                                setFilter(e.target.value);
                            }}
                            />
                        </ListSubheader>
                    }>


                            {
                                Items.map((produkDoc)=>{
                                    const data = produkDoc.data();
                                    console.log('datanya => ', data);
                                    return <ListItem key={produkDoc.id} button disabled={!data.stock}>

                                               {
                                                   data.foto ? 
                                                   <ListItemAvatar>
                                                       <Avatar src={data.foto} alt={data.nama}/>
                                                      
                                                   </ListItemAvatar>
                                                   : 

                                                   <ListItemIcon>
                                                       <ImageIcon/>
                                                   </ListItemIcon>

                                               }
                                                    <ListItemText primary={data.nama} 
                                                        secondary={`stock : ${data.stock || 0 }`} />
                                            </ListItem>
                                    
                            
                                })
                            }
                    </List>
            </Grid>
        </Grid>

        {/* <Button onClick={(e)=>{
            auth.signOut();
        }}>log out</Button>  */}
        </>
    );
}

export default Home;