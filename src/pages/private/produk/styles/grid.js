import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({

    fab : {
        position : 'absolute',
        bottom : theme.spacing(2),
        right : theme.spacing(2)
    },
    card : {
        display : 'flex'
    },
    foto : {
        width : 150,
        height : 150
    },
    fotoPlaceHolder : {
        width : 150,
        alignSelf :'center',
        textAlign : 'center'

    },
    details : {
        flex : '2 0 auto'
    },

    action : {
        flexDirection : 'column'
    }

}));

export default useStyles;