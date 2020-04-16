import React,  {useState } from 'react';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import useStyles from './styles/grid';
import AddDialog from './add';
function Grid(){
    const classes = useStyles();
    const [openDialog, setopenDialog] = useState(false);
    return (
        <>
        <h1>ini Halaman GridProduk</h1>  
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

export default Grid;