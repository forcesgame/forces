import React from 'react';

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
    }}
    >
      {emoji}
    </div>
  );
};

const Tile = ({ terrain, unit }) => {
  let backgroundColor = '';

  if (!terrain) {
    backgroundColor = '';
  } else if (terrain === 'ROAD') {
    backgroundColor = 'lightgrey';
  } else if (terrain === 'FOREST') {
    backgroundColor = 'lightgreen';
  } else if (terrain === 'PLAINS') {
    backgroundColor = 'tan';
  }

  return (
    <div style={{
      backgroundColor,
      border: '1px solid',
      height: '95%',
      justifyContent: 'center',
      textAlign: 'center',
      width: '95%',
    }}
    >
      <Unit unit={unit} />
    </div>
  );
};

const BoardTile = ({ terrain, unit }) => (
  <div style={{
    position: 'relative',
    width: '100%',
    height: '100%',
  }}
  >
    <Tile terrain={terrain} unit={unit} />
  </div>
);

function Map({ match }) {
  if (!match || !match.tiles) {
    return (
      <div />
    );
  }

  const renderBoardTile = (key, terrain, unit) => (
    <div
      key={key}
      style={{
        width: '12.5%',
        height: '12.5%',
      }}
    >
      <BoardTile terrain={terrain} unit={unit} />
    </div>
  );

  const tiles = [];
  let key = 0;

  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const tile = match.tiles[row][col];
      tiles.push(renderBoardTile(
        key,
        tile.type,
        tile.unit,
      ));

      key += 1;
    }
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexWrap: 'wrap',
    }}
    >
      {tiles}
    </div>
  );
}

export default Map;
