import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({

    hideText : {
        display : "none"
    },
    upload : {
        textAlign : 'center',
        padding : theme.spacing(3)
    },
    preview :{
        height : 'auto',
        width : '100%'
    },
    icon : {
        marginLeft : theme.spacing(1)
    },
    iconLeft : {
        marginRight : theme.spacing(1)
    },
    actionButton : {
        paddingTop : theme.spacing(2) 
    }
}));

export default useStyles;