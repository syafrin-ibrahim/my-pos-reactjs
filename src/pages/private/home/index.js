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
import { useSnackbar } from 'notistack';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import {currency} from '../../../utils/formatter';


// const handleClick = ()=>{

// }

function Home(){
    const {auth, firestore, user} = useFirebase();
    const ProdukCol = firestore.collection(`toko/${user.uid}/produk`);
    const [snapProduk, loadingProduk] = useCollection(ProdukCol);
    const [filter, setFilter] = useState('');
    const [Items, setItem] = useState([]);
    const classes = useStyles();
    const [transaksi, setTransaksi] = useState({
        items : {

        }
    })

    const {enqueueSnackbar} = useSnackbar();
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

   // event klik item
    const addItem = produkDoc =>e=>{
        let newItem = {...transaksi.items[produkDoc.id]};

        const data = produkDoc.data();

        if(newItem.jumlah){
            newItem.jumlah = newItem.jumlah + 1;
            newItem.subtotal = data.harga * newItem.jumlah;
        }else{
            newItem.jumlah = 1;
            newItem.harga = data.harga;
            newItem.subtotal = data.harga;
            newItem.nama = data.nama; 
        }

        const newItems =  { ...transaksi.items, [produkDoc.id] : newItem  }
        if(newItem.jumlah > data.stock){
            enqueueSnackbar('jumlah item lebih dari jumlah stok produk', {variant : 'error'});
        }else{
            setTransaksi((transaksi)=>({
                ...transaksi,
                items : newItems,
                total : Object.keys(newItems).reduce((total, k)=>{
                    const it = newItems[k];
                    return total + parseInt(it.subtotal);
                }, 0) 
            }))
        }
    }

    const handleChangeJml = k => (e)=>{
        let newItem = {...transaksi.items[k]};
            newItem.jumlah  = parseInt(e.target.value);
            newItem.subtotal = newItem.harga * newItem.jumlah;

            const Produk = Items.find(item => item.id === k);
            const data = Produk.data();
            const newItems =  { ...transaksi.items, [k] : newItem  }
            if(newItem.jumlah > data.stock){
                enqueueSnackbar('jumlah item lebih dari jumlah stok produk', {variant : 'error'});
            }else{
                setTransaksi((transaksi)=>({
                    ...transaksi,
                    items : newItems,
                    total : Object.keys(newItems).reduce((total, k)=>{
                        const it = newItems[k];
                        return total + parseInt(it.subtotal);
                    }, 0) 
                }))
            }
    }

    return (
        <>
        <h1 variant="h5" component="h1" paragraph="true">Buat Transaksi Baru</h1> 
        <Grid container spacing={5}>
            <Grid item xs={6} md={6}>
                    <Table>
                        <TableHead>
                            <TableCell>Item</TableCell>
                            <TableCell>Jumlah</TableCell>
                            <TableCell>Harga</TableCell>
                            <TableCell>Total</TableCell>
                        </TableHead>
                        <TableBody>
                            {
                                Object.keys(transaksi.items).map(k=>{
                                    const item = transaksi.items[k];
                                   
                                    return (
                                        <TableRow key={k}>
                                            <TableCell>{item.nama}</TableCell>
                                            <TableCell>
                                                <TextField className={classes.inputText} value={item.jumlah} type="number" onChange={handleChangeJml(k)}/>
                                            </TableCell>
                                            <TableCell>{currency(item.harga)}</TableCell>
                                            <TableCell>{currency(item.subtotal)}</TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                            <TableRow>
                                <TableCell colspan={3}>Total</TableCell>
                        <TableCell>{currency(transaksi.total)}</TableCell>

                            </TableRow>
                        </TableBody>
                    </Table>
            </Grid>
          
            <Grid item xs={6} md={6}>
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
                                    console.log('datanya => ', produkDoc.data());
                                    return <ListItem key={produkDoc.id} button disabled={!data.stock} onClick={addItem(produkDoc)}>

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