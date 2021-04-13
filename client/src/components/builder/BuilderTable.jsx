import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';

const BuilderRow = ({ unit, onUnitChange }) => {
  const handleChange = () => {
    onUnitChange(unit);
  };

  return (
    <tr>
      <td>{unit.type}</td>
      <td>
        <Form.Check
          checked={unit.active}
          onChange={handleChange}
        />
      </td>
      <td>{unit.rating}</td>
    </tr>
  );
};

function BuilderTable({ initialUnits, onUnitsChange }) {
  const [units, setUnits] = useState([]);
  const [builderRows, setBuilderRows] = useState([]);

  const initializeUnits = async () => {
    if (!initialUnits) return;
    setUnits(initialUnits);
  };

  const onUnitChange = (unit) => {
    const updatedUnits = units.map((_unit) => {
      const tempUnit = { ..._unit };
      if (tempUnit._id === unit._id) {
        tempUnit.active = !unit.active;
      }

      return tempUnit;
    });

    setUnits(updatedUnits);
  };

  const initializeBuilderRows = async () => {
    if (!units) return;
    setBuilderRows(
      units.map((unit) => (
        <BuilderRow
          key={unit._id}
          unit={unit}
          onUnitChange={onUnitChange}
        />
      )),
    );
  };

  useEffect(() => {
    initializeUnits();
  }, [initialUnits]);

  useEffect(() => {
    initializeBuilderRows();
  }, [units]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUnitsChange(units);
  };

  if (!units) {
    return (
      <h1>Loading...</h1>
    );
  }

  return (
    <Form name="unitUpdate" onSubmit={handleSubmit}>
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
      <Button
        type="submit"
        variant="primary"
      >
        Save
      </Button>
    </Form>
  );
}

export default BuilderTable;
