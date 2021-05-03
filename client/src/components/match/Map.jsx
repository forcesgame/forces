import React from 'react';
import Table from 'react-bootstrap/Table';

const MapTile = ({ tile }) => (
  <td>
    {tile.type}
    <br />
    {tile.unit ? `${tile.unit.user.username}'s ${tile.unit.type}` : ''}
  </td>
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

function Map({ match }) {
  if (!match || !match.tiles) {
    return (
      <div />
    );
  }

  let rowIndex = -1;

  return (
    <Table>
      <tbody>
        {match.tiles.map((row) => {
          rowIndex += 1;
          return (
            <MapRow
              key={rowIndex}
              row={row}
            />
          );
        })}
      </tbody>
    </Table>
  );
}

export default Map;
