import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    formStyle : {
        display : 'flex',
        flexDirection  : 'column',
        width : 350
    },
    buttonAct : {
        marginTop : theme.spacing(2)
    }
}))

export default useStyles;