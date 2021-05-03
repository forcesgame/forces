import React from 'react';

const Tile = () => (
  <div style={{
    border: 'solid',
    width: '100%',
    height: '100%',
  }}
  />
);

const BoardTile = () => (
  <div style={{
    position: 'relative',
    width: '100%',
    height: '100%',
  }}
  >
    <Tile />
  </div>
);

function Map({ match }) {
  if (!match || !match.tiles) {
    return (
      <div />
    );
  }

  const renderBoardTile = (i) => (
    <div
      key={i}
      style={{
        width: '12.5%',
        height: '12.5%',
      }}
    >
      <BoardTile />
    </div>
  );

  const tiles = [];

  for (let i = 0; i < 64; i += 1) {
    tiles.push(renderBoardTile(i));
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
