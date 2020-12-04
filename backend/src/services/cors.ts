import c from 'cors';
import { REACT_HOST } from '../_config';

const CorsOption: c.CorsOptions | c.CorsOptionsDelegate = {
  origin: `${REACT_HOST}`,
  optionsSuccessStatus: 200,
  credentials: true,
};
const cors = c(CorsOption);
export default cors;
