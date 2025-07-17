
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT UNIQUE, password TEXT)`);
  db.run(`CREATE TABLE bookmarks (id INTEGER PRIMARY KEY, userId INTEGER, url TEXT, title TEXT, favicon TEXT, summary TEXT)`);
});

module.exports = db;