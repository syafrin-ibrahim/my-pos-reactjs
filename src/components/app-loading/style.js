import {makeStyles} from '@material-ui/core/styles';


const useStyles = makeStyles(theme=>({
title : {
        color : theme.palette.primary.main,
        textAlign : 'center'
      


    },
    loadingBox : {
        display : 'flex',
        flexDirection : 'column',
        justifyContent : 'center',
        height : '100vh'
    },
    button : {
        marginTop : theme.spacing(2)
    }
}));

export default useStyles;