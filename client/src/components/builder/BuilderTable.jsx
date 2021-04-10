import React from 'react';
import Table from 'react-bootstrap/Table';

const BuilderRow = ({ unit }) => (
  <tr>
    <td>{unit.type}</td>
    <td>{unit.rating}</td>
  </tr>
);

const BuilderTable = ({ force }) => {
  const { units } = force;
  let builderRows = [];

  if (units) {
    builderRows = units.map((unit) => <BuilderRow key={unit._id} unit={unit} />);
  }

  return (
    <Table>
      <thead>
        <tr>
          <th>Type</th>
          <th>Rating</th>
        </tr>
      </thead>
      <tbody>
        {builderRows}
      </tbody>
    </Table>
  );
};

export default BuilderTable;
