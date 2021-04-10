import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';

function BuilderRow({ unit }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (unit === null) return;
    setActive(unit.active);
  }, []);

  return (
    <tr>
      <td>{unit.type}</td>
      <td>
        {active
          ? <Form.Check defaultChecked />
          : <Form.Check />}
      </td>
      <td>{unit.rating}</td>
    </tr>
  );
}

function BuilderTable({ force }) {
  const { units } = force;
  let builderRows = [];

  if (units) {
    builderRows = units.map((unit) => <BuilderRow key={unit._id} unit={unit} />);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = document.forms.forceUpdate;
    // TODO
  };

  return (
    <Form name="forceUpdate" onSubmit={handleSubmit}>
      <Table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Active</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {builderRows}
        </tbody>
      </Table>
      <Button variant="primary" type="submit">
        Save
      </Button>
    </Form>
  );
}

export default BuilderTable;
