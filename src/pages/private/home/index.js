import React from 'react';
import Button from '@material-ui/core/Button';
import { useFirebase } from '../../../components/FirebaseProvider';

const handleClick = ()=>{

}

function Home(){
    const {auth} = useFirebase();
    return (
        <>
        <h1>ini halaman Home BUat Transaksi</h1> 
        <Button onClick={(e)=>{
            auth.signOut();
        }}>log out</Button> 
        </>
    );
}

export default Home;