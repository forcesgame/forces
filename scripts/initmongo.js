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

const benID = db.users.findOne({ username: 'ben' })._id;
const jesusID = db.users.findOne({ username: 'jesus' })._id;
const patrickID = db.users.findOne({ username: 'patrick' })._id;

const forces = [
  {
    userID: benID,
    activeUnits: [],
    inactiveUnits: [],
  },
  {
    userID: jesusID,
    activeUnits: [],
    inactiveUnits: [],
  },
  {
    userID: patrickID,
    activeUnits: [{ type: 'INFANTRY', health: 100 }],
    inactiveUnits: [],
  },
];

db.forces.insertMany(forces);
const forceCount = db.forces.count();
print(`Inserted ${forceCount} forces`);
