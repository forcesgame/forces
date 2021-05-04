import React, { useEffect, useState } from 'react';

const Unit = ({ unit }) => {
  let emoji = '';

  if (!unit || !unit.type) {
    emoji = '';
  } else if (unit.type === 'INFANTRY') {
    emoji = '✌️';
  } else if (unit.type === 'BAZOOKA') {
    emoji = '🖐️️️';
  } else if (unit.type === 'TANK') {
    emoji = '✊️';
  }

  return (
    <div style={{
      fontSize: '5vmin',
      pointerEvents: 'none',
    }}
    >
      {emoji}
    </div>
  );
};

const Tile = ({ tile, onClick }) => {
  const { type, unit } = tile;
  let backgroundColor = '';

  if (type === 'ROAD') {
    backgroundColor = 'lightgrey';
  } else if (type === 'FOREST') {
    backgroundColor = 'lightgreen';
  } else if (type === 'PLAINS') {
    backgroundColor = 'tan';
  }

  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor,
        border: '1px solid',
        height: '95%',
        justifyContent: 'center',
        textAlign: 'center',
        width: '95%',
      }}
      type="button"
      value={tile._id}
    >
      <Unit unit={unit} />
    </button>
  );
};

function Map({ match, user }) {
  const [selectedUnit, setSelectedUnit] = useState({});
  const [tiles, setTiles] = useState([]);

  const onClick = (event) => {
    const tileID = event.target.value;
    const _tiles = match.tiles.flat();
    const tile = _tiles.find((_tile) => _tile._id === tileID);

    if (tile.unit) {
      const unitOwnerID = tile.unit.user._id;

      if (unitOwnerID === user._id) {
        console.log('That\'s one of your units.');
        setSelectedUnit(tile.unit);
      } else {
        console.log('That\'s not your unit!');
        setSelectedUnit(null);
      }
    } else {
      console.log('You clicked on a tile, but there\'s no unit there...');
      setSelectedUnit(null);
    }
  };

  const initializeTiles = () => {
    if (!match) return;

    const _tiles = [];
    let key = 0;

    match.tiles.flat().forEach((tile) => {
      _tiles.push(
        <div key={key}>
          <Tile
            tile={tile}
            onClick={onClick}
          />
        </div>,
      );

      key += 1;
    });

    setTiles(_tiles);
  };

  useEffect(() => {
    initializeTiles();
  }, [match]);

  useEffect(() => {
    console.log('selected unit:');
    console.log(selectedUnit);
  }, [selectedUnit]);

  if (!match || !user) {
    return (
      <></>
    );
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'grid',
      gridTemplateColumns: 'repeat(8, 1fr)',
      gridTemplateRows: 'repeat(8, 1fr)',
    }}
    >
      {tiles}
    </div>
  );
}

export default Map;
