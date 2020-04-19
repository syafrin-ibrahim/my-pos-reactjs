import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import {currency} from '../../../utils/formatter';
import Button from '@material-ui/core/Button';

function DialogConfirm({open, handleClose, transaksi}){

    return(
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Transaksi NO : {transaksi.no}</DialogTitle>
            <DialogContent dividers>
                <Table>
                        <TableHead>
                            <TableCell>Item</TableCell>
                            <TableCell>Jumlah</TableCell>
                            <TableCell>Harga</TableCell>
                            <TableCell>Total</TableCell>
                        </TableHead>
                        <TableBody>
                            { 
                            
                            transaksi.items &&
                                Object.keys(transaksi.items).map(k=>{
                                    const item = transaksi.items[k];
                                   
                                    return (
                                        <TableRow key={k}>
                                            <TableCell>{item.nama}</TableCell>
                                            <TableCell>
                                               {item.jumlah}
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
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="contained" color="primary">Close</Button>
            </DialogActions>
        </Dialog>
    )
}

DialogConfirm.propTypes = {
    open : PropTypes.bool.isRequired,
    handleClose : PropTypes.func.isRequired,
    transaksi : PropTypes.object.isRequired
}
export default DialogConfirm; 