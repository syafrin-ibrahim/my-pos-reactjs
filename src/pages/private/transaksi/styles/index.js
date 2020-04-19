import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({

   card : {
       display : 'flex'
   },
   summary : {
       flex : '2 0 auto'
   },
   action : {
       flexDirection : 'column'
   }

}));

export default useStyles;