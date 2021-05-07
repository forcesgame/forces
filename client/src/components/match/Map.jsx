import React, { useEffect, useState } from 'react';

const Unit = ({ unit }) => {
  let emoji = '';
  let stats = '';

  if (!unit || !unit.type) {
    emoji = '';
  } else if (unit.type === 'INFANTRY') {
    emoji = '✌️';
  } else if (unit.type === 'BAZOOKA') {
    emoji = '🖐️️️';
  } else if (unit.type === 'TANK') {
    emoji = '✊️';
  }

  if (unit) {
    const { health, rating, stamina } = unit;
    stats = `${health} | ${rating} | ${stamina}`;
  }

  return (
    <div style={{
      fontSize: '4vmin',
      pointerEvents: 'none',
    }}
    >
      {emoji}
      <div style={{ fontSize: '1.5vmin' }}>
        {stats}
      </div>
    </div>
  );
};

const Tile = ({ tile, onClick }) => {
  const { type, unit } = tile;
  let backgroundColor = '';
  let cursor;

  if (type === 'ROAD') {
    backgroundColor = 'lightgrey';
  } else if (type === 'FOREST') {
    backgroundColor = 'lightgreen';
  } else if (type === 'PLAINS') {
    backgroundColor = 'tan';
  }

  if (onClick === null) {
    cursor = 'not-allowed';
  } else {
    cursor = 'pointer';
  }

  return (
    <button
      onClick={onClick}
      style={{
        alignSelf: 'center',
        backgroundColor,
        border: '1px solid',
        cursor,
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

  const initializeTiles = () => {
    if (!match) return;
    const initialTiles = [];
    match.tiles.flat().forEach((tile) => { initialTiles.push(tile); });

    setTiles(initialTiles);
  };

  useEffect(() => {
    if (tiles.length !== 0) return;
    initializeTiles();
  }, [match]);

  const isInvalidMove = (from, to) => {
    if (from.x === to.x) {
      return (Math.abs(from.y - to.y) !== 1);
    } if (from.y === to.y) {
      return (Math.abs(from.x - to.x) !== 1);
    }

    return true;
  };

  const updateTiles = () => {
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
  };

  const updateMatchTiles = () => {
    // shallow copy
    const newMatchTiles = tiles.map((tile) => ({ ...tile }));

    // "unpopulate" units
    for (let i = 0; i < newMatchTiles.length; i += 1) {
      const tile = newMatchTiles[i];
      if (tile.unit) {
        tile.unit = tile.unit._id;
      }
    }

    setMatchTiles(newMatchTiles);
  };

  useEffect(() => {
    if (!selectedUnit || !tileFrom || !tileTo) return;

    if (isInvalidMove(tileFrom, tileTo)) {
      setSystemMessage('Invalid move.');
      return;
    }

    updateTiles();
    updateMatchTiles();
    setSystemMessage('Unit moved!');
  }, [tileTo]);

  const onClick = (event) => {
    const tileID = event.target.value;
    const clickedTile = tiles.find((_tile) => _tile._id === tileID);

    if (clickedTile.unit === null) {
      setTileTo(clickedTile);
      setSystemMessage('...');
    } else {
      const unitOwnerID = clickedTile.unit.user._id;
      const { unit } = clickedTile;
      const { health, rating, stamina } = unit;
      const unitType = unit.type.replace(
        /\w\S*/g, (string) => string.charAt(0).toUpperCase()
          + string.substr(1).toLowerCase(),
      );

      if (unitOwnerID === user._id) {
        const selectedUnitInfo = `Selected Unit: Type: ${unitType} |
        Health: ${health} |
        Rating: ${rating} |
        Stamina: ${stamina}`;

        setSelectedUnit(unit);
        setTileFrom(clickedTile);
        setSystemMessage(selectedUnitInfo);
      } else {
        setSelectedUnit(null);
        setTileFrom(null);
        setSystemMessage('That\'s not your unit!');
      }
    }
  };

  const updateRenderTiles = () => {
    const newRenderTiles = [];

    let onClickFunction;

    if (match?.currentTurn._id === user?._id) {
      onClickFunction = onClick;
    } else {
      onClickFunction = null;
    }

    for (let i = 0; i < tiles.length; i += 1) {
      newRenderTiles.push(
        <Tile
          key={i}
          tile={tiles[i]}
          onClick={onClickFunction}
        />,
      );
    }

    setRenderTiles(newRenderTiles);
  };

  useEffect(() => {
    updateRenderTiles();
  }, [match, tiles]);

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
