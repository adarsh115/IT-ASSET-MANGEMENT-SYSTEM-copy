const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Get all employees
// Get employees with optional search criteria
router.get('/employees', (req, res) => {
    const { id, name, email } = req.query;
  
    let query = 'SELECT * FROM employees WHERE 1=1';
    const queryParams = [];
  
    if (id) {
      query += ' AND id = ?';
      queryParams.push(id);
    }
  
    if (name) {
      query += ' AND name LIKE ?';
      queryParams.push(`%${name}%`);
    }
  
    if (email) {
      query += ' AND email = ?';
      queryParams.push(email);
    }
  
    db.all(query, queryParams, (err, rows) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        if (rows.length === 0) {
          res.status(404).send('No employee found');
        } else {
          res.json(rows);
        }
      }
    });
  });
  

// Add a new employee
router.post('/employees', (req, res) => {
  const { id, name, email, contact_number, office_location } = req.body;
  db.run(`INSERT INTO employees (id, name, email, contact_number, office_location) VALUES (?, ?, ?, ?, ?)`, [id, name, email, contact_number, office_location], function(err) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json({ id: this.lastID });
    }
  });
});

// Update an existing employee
router.put('/employees/:id', (req, res) => {
  const { name, email, contact_number, office_location } = req.body;
  const { id } = req.params;
  db.run(`UPDATE employees SET name = ?, email = ?, contact_number = ?, office_location = ? WHERE id = ?`, [name, email, contact_number, office_location, id], function(err) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json({ message: 'Employee updated successfully' });
    }
  });
});

// Delete an employee
router.delete('/employees/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM employees WHERE id = ?`, [id], function(err) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json({ message: 'Employee deleted successfully' });
    }
  });
});

// Get assets with optional employee_id
// Get asset by serial_number
router.get('/assets', (req, res) => {
    const { serial_number, employee_id } = req.query;
  
    let query = 'SELECT * FROM assets';
    const queryParams = [];
  
    if (serial_number) {
      query += ' WHERE serial_number = ?';
      queryParams.push(serial_number);
    } else if (employee_id) {
      query += ' WHERE employee_id = ?';
      queryParams.push(employee_id);
    }
  
    db.all(query, queryParams, (err, rows) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.json(rows);
      }
    });
  });
  

// Add a new asset
router.post('/assets', (req, res) => {
    const { serial_number, employee_id, asset_name, asset_type } = req.body;
    const addAssetQuery = `
      INSERT INTO assets (serial_number, employee_id, asset_name, asset_type)
      VALUES (?, ?, ?, ?)
    `;
    const updateEmployeeQuery = `
      UPDATE employees
      SET number_of_assets = number_of_assets + 1
      WHERE id = ?
    `;
  
    db.serialize(() => {
      db.run(addAssetQuery, [serial_number, employee_id, asset_name, asset_type], function(err) {
        if (err) {
          return res.status(500).send(err.message);
        }
        
        db.run(updateEmployeeQuery, [employee_id], function(err) {
          if (err) {
            return res.status(500).send(err.message);
          }
  
          db.get(`SELECT * FROM assets WHERE serial_number = ?`, [serial_number], (err, row) => {
            if (err) {
              res.status(500).send(err.message);
            } else {
              res.json(row);
            }
          });
        });
      });
    });
  });
  
// Add a new asset
// router.post('/assets', (req, res) => {
//   const { serial_number, employee_id, asset_name, asset_type } = req.body;
//   const addAssetQuery = `
//     INSERT INTO assets (serial_number, employee_id, asset_name, asset_type)
//     VALUES (?, ?, ?, ?)
//   `;
//   const updateEmployeeQuery = `
//     UPDATE employees
//     SET number_of_assets = number_of_assets + 1
//     WHERE id = ?
//   `;

//   db.serialize(() => {
//     db.run(addAssetQuery, [serial_number, employee_id, asset_name, asset_type], function(err) {
//       if (err) {
//         return res.status(500).send(err.message);
//       }
      
//       db.run(updateEmployeeQuery, [employee_id], function(err) {
//         if (err) {
//           return res.status(500).send(err.message);
//         }

//         db.get(`SELECT * FROM assets WHERE serial_number = ?`, [serial_number], (err, row) => {
//           if (err) {
//             res.status(500).send(err.message);
//           } else {
//             res.json(row);
//           }
//         });
//       });
//     });
//   });
// });



// Update an existing asset
// Update an existing asset
router.put('/assets/:serial_number', (req, res) => {
    const { serial_number } = req.params;
    const { asset_name, asset_type } = req.body;
    const query = `UPDATE assets SET asset_name = ?, asset_type = ? WHERE serial_number = ?`;

    db.run(query, [asset_name, asset_type, serial_number], function(err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            db.get(`SELECT * FROM assets WHERE serial_number = ?`, [serial_number], (err, row) => {
                if (err) {
                    res.status(500).send(err.message);
                } else {
                    res.json(row); // Return the full asset details
                }
            });
        }
    });
});

//delete an asset
router.delete('/assets/:serial_number', (req, res) => {
    const { serial_number } = req.params;
    let employeeId;
  
    const getAssetQuery = `
      SELECT employee_id FROM assets WHERE serial_number = ?
    `;
    const deleteAssetQuery = `
      DELETE FROM assets WHERE serial_number = ?
    `;
    const updateEmployeeQuery = `
      UPDATE employees
      SET number_of_assets = number_of_assets - 1
      WHERE id = ?
    `;
  
    db.serialize(() => {
      db.get(getAssetQuery, [serial_number], (err, row) => {
        if (err) {
          return res.status(500).send(err.message);
        }
        
        employeeId = row.employee_id;
  
        db.run(deleteAssetQuery, [serial_number], function(err) {
          if (err) {
            return res.status(500).send(err.message);
          }
  
          db.run(updateEmployeeQuery, [employeeId], function(err) {
            if (err) {
              return res.status(500).send(err.message);
            }
            
            res.json({ message: 'Asset deleted successfully' });
          });
        });
      });
    });
  });
  
// Delete an asset
// router.delete('/assets/:id', (req, res) => {
//   const { id } = req.params;
//   db.get(`SELECT employee_id FROM assets WHERE id = ?`, [id], (err, row) => {
//     if (err) {
//       res.status(500).send(err.message);
//     } else {
//       const employee_id = row.employee_id;
//       db.run(`DELETE FROM assets WHERE id = ?`, [id], function(err) {
//         if (err) {
//           res.status(500).send(err.message);
//         } else {
//           // Update the number of assets for the employee
//           db.run(`UPDATE employees SET number_of_assets = number_of_assets - 1 WHERE id = ?`, [employee_id], (err) => {
//             if (err) {
//               res.status(500).send(err.message);
//             } else {
//               res.json({ message: 'Asset deleted successfully' });
//             }
//           });
//         }
//       });
//     }
//   });
// });

module.exports = router;
