
const { MongoClient } = require('mongodb');
const url = mongodb+srv://db_init:12345@forces.wm1qz.mongodb.net/users?retryWrites=true';

db.users.remove({});

const usersDB = [
    {
        userID: 1,
        username: 'patrick',
        email: 'patrickjohnsilvestre@gmail.com',
    },
    {
        userID: 2,
        username: 'jesus',
        email: 'mrjfuentes20@gmail.com',
    },
    {
        userID: 3,
        username: 'ben',
        email: 'benjamin.w.lee@sjsu.edu',
    }
];

db.users.insertMany(usersDB);
const count = db.users.count();
print('Inserted', count, 'users');