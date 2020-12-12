import { Router } from 'express';
import fs from 'fs';
import { predict } from './predict';

export const router = Router();

router.get('/:year?', (req, res) => {
  let year = req.params.year;
  if (!year)
    fs.readFile('./data/district.geo.json', (err, raw) => {
      if (err) return res.send('ERROR');
      else return res.json(JSON.parse(raw.toString()));
    });
  else {
    const data = predict([year.toString()]);
    return res.json(data);
  }
});
