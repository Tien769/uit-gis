import express from 'express';
import compression from 'compression';
import cors from './services/cors';
import Database from './services/database';
import { router as DistrictRouter } from './disRouter';

const app = express();

app.use(compression());
app.use(cors);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('data'));

app.get('/', (_, res) => {
  res.send('Hello');
});

app.get('/territory', (_, res) => {
  Database.all('SELECT type,features FROM layers WHERE layer_id=0', (err, result) => {
    if (err) res.send(err);
    else {
      const data = {
        ...result[0],
        features: JSON.parse(result[0].features),
      };
      res.json(data);
    }
  });
});

app.use('/dis', DistrictRouter);

export default app;
