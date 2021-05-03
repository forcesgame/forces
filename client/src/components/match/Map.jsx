import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';

const MapTile = ({ tile }) => {
  const [background, setBackground] = useState('');
  const [emoji, setEmoji] = useState('');

  const typeToBackground = (type) => {
    if (!type) return '';
    if (type === 'ROAD') return 'lightgrey';
    if (type === 'FOREST') return 'lightgreen';
    if (type === 'PLAINS') return 'tan';
    return '';
  };

  const unitTypeToEmoji = (type) => {
    console.log(type);
    if (!type) return '';
    if (type === 'INFANTRY') return '🧍';
    if (type === 'BAZOOKA') return '💣';
    if (type === 'TANK') return '🚙';
    return '';
  };

  if (!tile) {
    return (
      <></>
    );
  }

  useEffect(() => {
    setBackground(typeToBackground(tile.type));
    if (tile && tile.unit) {
      setEmoji(unitTypeToEmoji(tile.unit.type));
    }
  }, [tile]);

  return (
    <td style={{ border: '2px solid black', background }}>
      {tile.type}
      <br />
      {/* {tile._id} */}
      {/* <GetTileId tile={tile} /> */}
      <br />
      {tile.unit ? `${tile.unit.user.username}'s ${emoji}` : ''}
    </td>
  );
};

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

// obtain the tile._id based on the tile  provided
// function GetTileId({ tile }) {
//   const tileId = `${tile._id}`;
//
//   return (
//     tileId
//   );
// }

export default Map;
