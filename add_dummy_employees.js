const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./it_asset_management.db');

db.serialize(() => {
    const stmt = db.prepare(`INSERT INTO employees (id, name, email, contact_number, office_location) VALUES (?, ?, ?, ?, ?)`);
    for (let i = 1; i <= 30; i++) {
        const id = `EMP${String(i).padStart(3, '0')}`;
        const name = `Employee ${i}`;
        const email = `employee${i}@example.com`;
        const contact_number = `12345678${String(i).padStart(2, '0')}`;
        const office_location = `Office ${i}`;
        stmt.run(id, name, email, contact_number, office_location);
    }
    stmt.finalize();
});

db.close();
