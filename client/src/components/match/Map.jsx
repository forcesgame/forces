/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';

const MapTile = ({ tile }) => (
  // <td style={{ border: '2px solid black' }}>
  <TileColor tile={tile}>
    {tile.type}
    <br />
    {tile.unit ? `${tile.unit.user.username}'s ${tile.unit.type}` : ''}
  </TileColor>
  // </td>
);

const MapRow = ({ row }) => {
  const tiles = row.map((tile) => (
    <MapTile
      key={tile._id}
      tile={tile}
    />
  ));

  return (
    <tr>
      {tiles}
    </tr>
  );
};

function Map({ initialMatch }) {
  const [match, setMatch] = useState({});
  const [mapRows, setMapRows] = useState([]);

  const initializeMatch = async () => {
    if (!initialMatch) return;
    setMatch(initialMatch);
  };

  const initializeMapRows = async () => {
    if (!match) return;
    const { tiles } = match;
    if (!tiles) return;
    let rowIndex = -1;
    setMapRows(
      tiles.map((row) => {
        rowIndex += 1;
        return (
          <MapRow
            key={rowIndex}
            row={row}
          />
        );
      }),
    );
  };

  useEffect(() => {
    initializeMatch();
  }, [initialMatch]);

  useEffect(() => {
    initializeMapRows();
  }, [match]);

  if (!mapRows) {
    return (
      <h1>Loading...</h1>
    );
  }

  return (
    <Table>
      <tbody>
        {mapRows}
      </tbody>
    </Table>
  );
}

function TileColor({ tile }) {
  const [color, setColor] = useState({});

  if (!tile) {
    return (
      <></>
    );
  }

  if (tile.type === 'ROAD') {
    setColor('lightgrey');
  } else if (tile.type === 'FOREST') {
    setColor('lightgreen');
  } else {
    setColor('lightbrown');
  }

  console.log('test');

  return (
    <td>testing td</td>
  );
}

export default Map;
