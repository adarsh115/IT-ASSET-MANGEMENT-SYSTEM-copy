const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./it_asset_management.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    contact_number TEXT,
    office_location TEXT,
    number_of_assets INTEGER DEFAULT 0
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS assets (
    serial_number TEXT PRIMARY KEY,
    employee_id TEXT,
    asset_name TEXT NOT NULL,
    asset_type TEXT,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
)`);

});

module.exports = db;
