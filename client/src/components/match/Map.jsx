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
        alignSelf: 'center',
        backgroundColor,
        border: '1px solid',
        height: '100%',
        justifySelf: 'center',
        width: '100%',
      }}
      type="button"
      value={tile._id}
    >
      <Unit unit={unit} />
    </button>
  );
};

function Map({
  match, user, setMatchTiles, setSystemMessage,
}) {
  const [renderTiles, setRenderTiles] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [tileFrom, setTileFrom] = useState(null);
  const [tileTo, setTileTo] = useState(null);
  const [tiles, setTiles] = useState([]);

  const onClick = (event) => {
    const tileID = event.target.value;
    const tile = tiles.find((_tile) => _tile._id === tileID);

    if (tile.unit) {
      const unitOwnerID = tile.unit.user._id;
      const { unit } = tile;

      if (unitOwnerID === user._id) {
        setSelectedUnit(unit);
        setTileFrom(tile);
        setSystemMessage('Selected one of your units...');
      } else {
        setSelectedUnit(null);
        setTileFrom(null);
        setSystemMessage('That\'s not your unit!');
      }
    } else {
      setTileTo(tile);
      setSystemMessage('Nothing selected...');
    }
  };

  const initializeTiles = () => {
    if (!match) return;
    const _tiles = [];
    match.tiles.flat().forEach((tile) => { _tiles.push(tile); });
    setTiles(_tiles);
  };

  useEffect(() => {
    if (tiles.length !== 0) return;
    initializeTiles();
  }, [match]);

  useEffect(() => {
    if (!tileFrom || !selectedUnit) return;
    if (!tileTo) return;

    // deep copy
    const newTiles = [...tiles];

    for (let i = 0; i < newTiles.length; i += 1) {
      const tile = newTiles[i];
      if (tile._id === tileFrom._id) {
        tile.unit = null;
        setTileFrom(null);
      }

      if (tile._id === tileTo._id) {
        tile.unit = selectedUnit;
        setTileTo(null);
        setSelectedUnit(null);
      }
    }

    setTiles(newTiles);

    // shallow copy...i think
    const matchTiles = newTiles.map((tile) => ({ ...tile }));

    // "unpopulate" units
    for (let i = 0; i < matchTiles.length; i += 1) {
      const tile = matchTiles[i];
      if (tile.unit) {
        tile.unit = tile.unit._id;
      }
    }
    setMatchTiles(matchTiles);
    setSystemMessage('Unit moved!');
  }, [tileTo]);

  useEffect(() => {
    const _renderTiles = [];
    for (let i = 0; i < tiles.length; i += 1) {
      _renderTiles.push(
        <Tile
          key={i}
          tile={tiles[i]}
          onClick={onClick}
        />,
      );
    }

    setRenderTiles(_renderTiles);
  }, [tiles]);

  if (!match || !user) {
    return (
      <></>
    );
  }

  return (
    <div style={{
      alignItems: 'center',
      width: '100%',
      height: '100%',
      display: 'grid',
      gap: '5px 5px',
      gridTemplateColumns: 'repeat(8, 1fr)',
      gridTemplateRows: 'repeat(8, 1fr)',
      justifyItems: 'center',
    }}
    >
      {renderTiles}
    </div>
  );
}

export default Map;
