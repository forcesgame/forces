/* global db print */
/* eslint no-restricted-globals: "off" */

db.users.remove({});

const initialUsers = [
  {
    userID: 1,
    username: 'patrick',
    email: 'patrickjohnsilvestre@gmail.com',
    password: '$2b$10$LkSc.1gmK1/DyElaP7c43.DRwC0/YtBMSkeLiAD8p6cQbvpZTjAdi',
  },
];

db.users.insertMany(initialUsers);
print(`Inserted ${db.users.count()} users`);
