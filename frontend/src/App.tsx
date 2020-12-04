import { loadModules } from 'esri-loader';
import { useEffect, useRef, useState } from 'react';

interface PlainObject {
  [key: string]: any;
}

const ChangeLayerButton = (props: { handler: () => void }) => {
  return (
    <button id='ChangeLayer' onClick={props.handler}>
      Change Layer
    </button>
  );
};

const InfoRenderer = (props: { info: PlainObject }) => {
  const info = props.info;
  return (
    <div className='row'>
      <div className='col'>{info.Year}</div>
      <div className='col'>{info.GrowthRate}</div>
      <div className='col'>{Math.round(info.Density)}</div>
      <div className='col'>{Math.round(info.TotalPopulation)}</div>
    </div>
  );
};

const InfoPanel = () => {
  const [info, setInfo] = useState<PlainObject[]>([]);

  useEffect(() => {
    if (!info.length) {
      fetch('http://localhost:3001/history.json')
        .then(res => res.json())
        .then(data => setInfo(i => [...i, ...data]));
      fetch('http://localhost:3001/projection.json')
        .then(res => res.json())
        .then(data => setInfo(i => [...i, ...data]));
    }
  }, [info]);

  return (
    <div className='info'>
      <h1>INFO PANEL</h1>
      <div className='flex-container'>
        <div className='row'>
          <div className='col'>
            <h2>History</h2>
          </div>
        </div>
        <div className='row header'>
          <div className='col'>Year</div>
          <div className='col'>Growth </div>
          <div className='col'>Densisty</div>
          <div className='col'>Pop</div>
        </div>
        {info
          .filter(entry => entry.Year < 2020)
          .slice(0, 5)
          .reverse()
          .map(entry => (
            <InfoRenderer key={entry.Year} info={entry} />
          ))}
      </div>
      <div className='flex-container'>
        <div className='row '>
          <div className='col'>
            <h2>Projection</h2>
          </div>
        </div>
        <div className='row header'>
          <div className='col'>Year</div>
          <div className='col'>Growth</div>
          <div className='col'>Densisty</div>
          <div className='col'>Pop</div>
        </div>
        {info
          .filter(entry => entry.Year > 2020)
          .slice(0, 5)
          .map(entry => (
            <InfoRenderer key={entry.Year} info={entry} />
          ))}
      </div>
    </div>
  );
};

function App() {
  const mapRef = useRef(null);
  const [layer, setLayer] = useState(true);

  useEffect(() => {
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    loadModules(
      ['esri/Map', 'esri/views/MapView', 'esri/layers/FeatureLayer', 'esri/layers/GeoJSONLayer'],
      { css: true }
    ).then(([ArcGISMap, MapView]) => {
      const map = new ArcGISMap({
        basemap: 'topo-vector',
      });

      // load the map view at the ref's DOM node
      const view = new MapView({
        container: mapRef.current,
        map: map,
        center: [106.6, 17.3],
        zoom: 6,
      });

      if (layer) {
        getTerritoryLayer().then(layer => {
          map.add(layer);
        });
      } else
        getDisctrictsLayer().then(layer => {
          map.add(layer);
        });

      return () => {
        if (view) {
          view.destroy();
        }
      };
    });
  }, [layer]);

  return (
    <div id='Wrapper'>
      <div className='webmap' ref={mapRef} />
      <ChangeLayerButton handler={() => setLayer(!layer)} />
      <InfoPanel />
    </div>
  );
}

const getTerritoryLayer = () =>
  loadModules(['esri/layers/GeoJSONLayer']).then(
    ([GeoJSONLayer]) =>
      new GeoJSONLayer({
        url: 'http://localhost:3001/territory',
        outFields: ['sovereignt', 'pop_est'],
        popupTemplate: {
          title: '{sovereignt}',
          content: [
            {
              type: 'fields',
              fieldInfos: [
                {
                  fieldName: 'sovereignt',
                  label: 'Country name',
                },
                {
                  fieldName: 'pop_est',
                  label: 'Population',
                },
              ],
            },
          ],
        },
        renderer: {
          type: 'simple',
          symbol: {
            type: 'simple-fill',
            color: [240, 160, 10, 0.5],
            outline: {
              color: [255, 255, 255, 1],
              width: 1,
            },
          },
        },
      })
  );

const getDisctrictsLayer = async () =>
  loadModules(['esri/layers/GeoJSONLayer']).then(
    ([GeoJSONLayer]) =>
      new GeoJSONLayer({
        url: 'http://localhost:3001/district',
        outFields: ['Province', 'District', 'Pop_2009'],
        popupTemplate: {
          title: 'Dân số {District}, {Province}',
          content: 'Dân số: {Pop_2009}',
        },
        renderer: {
          type: 'simple',
          symbol: {
            type: 'simple-fill',
            color: [255, 0, 0, 1],
            outline: {
              color: [255, 255, 255, 0.5],
              width: 1,
            },
          },
          visualVariables: {
            type: 'color',
            field: 'Pop_2009',
            stops: [
              { value: 0, color: '#ffffff' },
              // { value: 100000, color: '#ff9999' },
              // { value: 300000, color: '#ff3333' },
              { value: 400000, color: '#ff0000' },
              // { value: 600000, color: '#cc0000' },
              { value: 790000, color: '#cc0000' },
            ],
          },
        },
      })
  );

export default App;
