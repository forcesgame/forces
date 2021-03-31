/*
Run using the mongo shell:
mongo mongodb+srv://forces.wm1qz.mongodb.net/forces scripts/initmongo.js --username <username>
 */

db.users.remove({});
db.forces.remove({});

const users = [
  { username: 'ben' },
  { username: 'jesus' },
  { username: 'patrick' },
];

db.users.insertMany(users);
db.users.createIndex({ username: 1 }, { unique: true });
const userCount = db.users.count();
print(`Inserted ${userCount} users`);

const benID = db.users.find({ username: 'ben' }, { _id: 1 });
const jesusID = db.users.find({ username: 'jesus' }, { _id: 1 });
const patrickID = db.users.find({ username: 'patrick' }, { _id: 1 });

const forces = [
  {
    userID: benID._id,
    activeUnits: { infantry: 0, bazooka: 0, tank: 0 },
    reserveUnits: { infantry: 3, bazooka: 3, tank: 2 },
    units: [],
  },
  {
    userID: jesusID._id,
    activeUnits: { infantry: 0, bazooka: 0, tank: 0 },
    reserveUnits: { infantry: 3, bazooka: 3, tank: 2 },
    units: [],
  },
  {
    userID: patrickID._id,
    activeUnits: { infantry: 0, bazooka: 0, tank: 0 },
    reserveUnits: { infantry: 3, bazooka: 3, tank: 2 },
    units: [],
  },
];

db.forces.insertMany(forces);
const forceCount = db.forces.count();
print(`Inserted ${forceCount} forces`);
