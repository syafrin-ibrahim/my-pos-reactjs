import {makeStyles} from '@material-ui/styles';


const useStyles = makeStyles(theme=>({
title : {
        textAlign : 'center',
        marginBottom : theme.spacing(3)

    },
    paper : {
        marginTop : theme.spacing(8),
        padding : theme.spacing(6)
    },
    button : {
        marginTop : theme.spacing(2)
    },
    forgot : {
        marginTop : theme.spacing(3)
    }
}));

export default useStyles;