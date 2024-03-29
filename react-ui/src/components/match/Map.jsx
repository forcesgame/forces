import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Unit = ({ unit }) => {
  if (!unit) {
    return (
      <></>
    );
  }

  let emoji = '';

  if (unit.type === 'INFANTRY') {
    emoji = '✌️';
  } else if (unit.type === 'BAZOOKA') {
    emoji = '🖐️️️';
  } else if (unit.type === 'TANK') {
    emoji = '✊️';
  }

  const { health, rating, stamina } = unit;
  const stats = `${health} | ${rating} | ${stamina}`;

  const enemyStyle = {
    backgroundColor: '#dc3545',
    color: 'white',
  };
  const allyStyle = {
    backgroundColor: '#007bff',
    color: 'white',
  };

  return (
    <div style={{
      fontSize: '4vmin',
      pointerEvents: 'none',
    }}
    >
      {emoji}
      <div style={{
        fontSize: '35%',
      }}
      >
        <mark style={unit.isEnemy ? enemyStyle : allyStyle}>
          {stats}
        </mark>
      </div>
    </div>
  );
};

const Tile = ({ tile, onClick, user }) => {
  const { isSelected, type, unit } = tile;
  let backgroundColor = '';
  let border;
  let cursor;

  if (type === 'ROAD') {
    backgroundColor = 'lightgrey';
  } else if (type === 'FOREST') {
    backgroundColor = 'lightgreen';
  } else if (type === 'PLAINS') {
    backgroundColor = 'tan';
  }

  if (isSelected) {
    border = '2px solid';
  } else {
    border = '1px solid';
  }

  if (onClick === null) {
    cursor = 'not-allowed';
  } else {
    cursor = 'pointer';
  }

  if (unit) {
    unit.isEnemy = unit.user._id !== user._id;
  }

  return (
    <button
      onClick={onClick}
      style={{
        alignSelf: 'center',
        backgroundColor,
        border,
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
  match, user, setMatchTiles, setMatchUnits, setSystemMessage,
}) {
  const [matchVersion, setMatchVersion] = useState(-1);
  const [renderTiles, setRenderTiles] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [tileFrom, setTileFrom] = useState(null);
  const [tileTo, setTileTo] = useState(null);
  const [tiles, setTiles] = useState([]);
  const [units, setUnits] = useState([]);

  const initializeTiles = () => {
    if (!match) return;
    const initialTiles = [];
    match.tiles.flat().forEach((tile) => { initialTiles.push(tile); });

    setTiles(initialTiles);
  };

  const initializeUnits = () => {
    if (!match) return;
    const initialUnits = [];
    match.tiles.flat().forEach((tile) => {
      if (tile.unit) initialUnits.push(tile.unit);
    });

    setUnits(initialUnits);
  };

  const checkIfWinner = async () => {
    if (!match || !user) return;
    if (match.winner !== null) return;

    const healthReducer = (totalHealth, tile) => totalHealth + tile.unit.health;

    const playerForceHealth = match.tiles
      .flat()
      .filter((tile) => tile.unit && tile.unit.user._id === user._id)
      .reduce(healthReducer, 0);

    const enemyForceHealth = match.tiles
      .flat()
      .filter((tile) => tile.unit && tile.unit.user._id !== user._id)
      .reduce(healthReducer, 0);

    const matchID = match._id;
    const user1ID = match.user1._id;
    const user2ID = match.user2._id;
    let opponentID;

    if (user._id === user1ID) {
      opponentID = user2ID;
    } else {
      opponentID = user1ID;
    }

    if (playerForceHealth === 0) {
      await axios.patch(`/api/matches/${matchID}`, {
        winner: opponentID,
      });
    }

    if (enemyForceHealth === 0) {
      await axios.patch(`/api/matches/${matchID}`, {
        winner: user._id,
      });
    }
  };

  useEffect(() => {
    if (match?.__v === matchVersion) return;
    initializeTiles();
    initializeUnits();
    setMatchVersion(match?.__v);

    checkIfWinner();
  }, [match]);

  const isInvalidMove = (from, to) => {
    if (from.x === to.x) {
      return (Math.abs(from.y - to.y) !== 1);
    }

    if (from.y === to.y) {
      return (Math.abs(from.x - to.x) !== 1);
    }

    return true;
  };

  const updateTiles = () => {
    // deep copy
    const newTiles = [...tiles];

    for (let i = 0; i < newTiles.length; i += 1) {
      const tile = newTiles[i];

      if (tileTo && tile._id === tileFrom._id) {
        tile.unit = null;
        setTileFrom(null);
      }

      if (tileTo && tile._id === tileTo._id) {
        tile.unit = selectedUnit;
        tile.unit.stamina -= tile.staminaCost;
        if (tile.unit.stamina < 0) tile.unit.stamina = 0;

        setTileTo(null);
        setSelectedUnit(null);
        setSystemMessage('Unit moved!');
      }
    }

    setTiles(newTiles);
  };

  const updateUnits = () => {
    const newUnits = [...units];

    for (let i = 0; i < units.length; i += 1) {
      const unit = newUnits[i];
      const tile = tiles.find((t) => t.unit?._id === unit._id);

      if (tile) {
        unit.health = tile.unit.health;
        unit.stamina = tile.unit.stamina;
      }
    }

    setUnits(newUnits);
  };

  const updateTilesAndUnits = () => {
    updateTiles();
    updateUnits();
  };

  useEffect(async () => {
    if (!selectedUnit || !tileFrom || !tileTo) return;

    if (selectedUnit.stamina <= 0) {
      setSystemMessage('That unit is out of stamina!');
      return;
    }

    if (isInvalidMove(tileFrom, tileTo)) {
      setSystemMessage('Invalid move.');
      return;
    }

    updateTilesAndUnits();
  }, [tileTo]);

  const resetSelection = () => {
    setSelectedUnit(null);
    setTileFrom(null);
    setTileTo(null);
    setSystemMessage('...');
  };

  const toTitleCase = (string) => string.replace(
    /\w\S*/g, (_string) => _string.charAt(0).toUpperCase()
        + _string.substr(1).toLowerCase(),
  );

  const getTypeBonusMultiplier = (attacker, defender) => {
    if (attacker === defender) return 1;
    if (attacker === 'INFANTRY') {
      if (defender === 'BAZOOKA') return 1.25;
      return 0.75;
    }

    if (attacker === 'BAZOOKA') {
      if (defender === 'TANK') return 1.25;
      return 0.75;
    }

    if (attacker === 'TANK') {
      if (defender === 'INFANTRY') return 1.25;
      return 0.75;
    }

    return 1;
  };

  const attackUnitOn = (clickedTile) => {
    const attacker = selectedUnit;
    const defender = clickedTile.unit;

    const attackerBaseDamage = 10 * attacker.rating;
    const defenderBaseDamage = 10 * defender.rating;

    const attackerTypeBonus = getTypeBonusMultiplier(attacker.type, defender.type);
    const defenderTypeBonus = getTypeBonusMultiplier(defender.type, attacker.type);

    const attackerHealthBonus = attacker.health / attacker.maxHealth;
    const defenderHealthBonus = defender.health / defender.maxHealth;

    const attackerLuck = Math.floor(Math.random() * 10) + 1;
    const defenderLuck = Math.floor(Math.random() * 10) + 1;

    const attackerDamage = Math.floor(attackerBaseDamage * attackerTypeBonus * attackerHealthBonus
      + attackerLuck);
    const defenderDamage = Math.floor(defenderBaseDamage * defenderTypeBonus * defenderHealthBonus
      + defenderLuck);

    attacker.health -= defenderDamage;
    defender.health -= attackerDamage;

    setSystemMessage(`Attacker dealt ${attackerDamage} damage,
        Defender dealt ${defenderDamage} damage
        `);
  };

  const onClick = async (event) => {
    const tileID = event.target.value;
    const clickedTile = tiles.find((_tile) => _tile._id === tileID);

    if (clickedTile.unit === null) {
      if (tileTo && clickedTile._id === tileTo._id) {
        resetSelection();
        return;
      }

      setTileTo(clickedTile);

      if (selectedUnit) return;

      const tileType = toTitleCase(clickedTile.type);
      const selectedTileInfo = `Selected Tile: Type: ${tileType} |
      Stamina Cost: ${clickedTile.staminaCost}`;

      setSystemMessage(selectedTileInfo);
    } else { // unit on tile
      const unitOwnerID = clickedTile.unit.user._id;
      const { unit } = clickedTile;

      if (selectedUnit && unit._id === selectedUnit._id) {
        resetSelection();
        return;
      }

      if (unitOwnerID === user._id) {
        const { health, rating, stamina } = unit;
        const unitType = toTitleCase(unit.type);
        const selectedUnitInfo = `Selected Unit: Type: ${unitType} |
        Health: ${health} |
        Rating: ${rating} |
        Stamina: ${stamina}`;

        setSelectedUnit(unit);
        setTileFrom(clickedTile);
        setSystemMessage(selectedUnitInfo);
      } else if (selectedUnit) {
        if (isInvalidMove(tileFrom, clickedTile)) {
          setSystemMessage('Invalid move.');
          return;
        }

        attackUnitOn(clickedTile);
        updateTilesAndUnits();
        setSelectedUnit(null);
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
      const tile = tiles[i];

      if (tile.unit && tile.unit.health <= 0) {
        tile.unit = null;
      }

      if (tile.unit && selectedUnit) {
        tile.isSelected = tile.unit._id === selectedUnit._id;
      } else if (tileTo && tile._id === tileTo._id && !selectedUnit) {
        tile.isSelected = true;
      } else {
        tile.isSelected = false;
      }

      newRenderTiles.push(
        <Tile
          key={i}
          tile={tile}
          onClick={onClickFunction}
          user={user}
        />,
      );
    }

    setRenderTiles(newRenderTiles);
  };

  const syncMatchTiles = () => {
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

  const syncMatchUnits = () => {
    setMatchUnits(units.map((unit) => ({ ...unit })));
  };

  const syncMatchTilesAndUnits = () => {
    syncMatchTiles();
    syncMatchUnits();
  };

  useEffect(() => {
    updateRenderTiles();
    syncMatchTilesAndUnits();
  }, [match, selectedUnit, tileFrom, tileTo, tiles, units]);

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
