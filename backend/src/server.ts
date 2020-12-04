import http from 'http';
import app from './app';
import { HOST, PORT } from './_config';

const server = http.createServer(app);
server.listen(parseInt(PORT || '3001'), HOST || 'localhost', undefined, () => {
  console.clear();
  console.log('------------------------------------------------------------');
  console.log(`App is running at ${HOST}:${PORT} in ${app.get('env')} mode`);
  console.log('------------------------------------------------------------');
  console.log();
});
