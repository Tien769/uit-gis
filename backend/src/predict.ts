import fs from 'fs';

interface Feature {
  properties: {
    Pop_2009: number;
  };
}

interface Geo {
  features: Feature[];
}

const getJSON = () => {
  let raw = fs.readFileSync('./data/district.geo.json');
  return JSON.parse(raw.toString());
};

const convert = (data: Geo, year: number): Geo => {
  let features = data.features.map((f: Feature) => {
    let pop = f.properties.Pop_2009;
    if (pop === 0) return f;
    else {
      const newPop = Math.floor(Math.random() * 0.2 * year * pop) + pop;
      let newFeature = { ...f, properties: { ...f.properties, Pop_2009: newPop } };
      return newFeature;
    }
  });
  return { ...data, features: features };
};

const main = (args: string[]) => {
  let newGeo = convert(getJSON(), parseInt(args[0]));
  // let data = JSON.stringify(newGeo);
  // fs.writeFileSync(`./data/district${args[0]}.geo.json`, data);
  return newGeo;
};

export { main as predict };
