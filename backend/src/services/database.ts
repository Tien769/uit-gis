import sqlite3 from 'sqlite3';
import path from 'path';
const dbpath = path.resolve('./db.sqlite');
const Database = new sqlite3.Database(dbpath);

export default Database;
