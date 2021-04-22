import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';

const BuilderRow = ({ unit }) => (
  <tr>
    <td>{unit.type}</td>
    <td>
      <Form.Check
        defaultChecked={unit.active}
        name="active"
        value={unit._id}
      />
    </td>
    <td>{unit.rating}</td>
  </tr>
);

function BuilderTable({ units, onSubmit }) {
  if (!units || units.length === 0) {
    return (
      <></>
    );
  }

  return (
    <Form onSubmit={onSubmit}>
      <Table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Active</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {units.map((unit) => (
            <BuilderRow
              key={unit._id}
              unit={unit}
            />
          ))}
        </tbody>
      </Table>
      <Button type="submit" variant="primary">Save</Button>
    </Form>
  );
}

export default BuilderTable;
