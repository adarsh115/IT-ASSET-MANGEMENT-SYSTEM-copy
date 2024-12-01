document.addEventListener('DOMContentLoaded', () => {
    fetchEmployees();

    // Event listener for 'Add Employee' button
    document.getElementById('add-employee-btn').addEventListener('click', () => {
        document.getElementById('employee-id').value = ''; // Clear the ID field
        document.getElementById('employee-name').value = '';
        document.getElementById('employee-email').value = '';
        document.getElementById('employee-contact-number').value = '';
        document.getElementById('employee-office-location').value = '';
        document.getElementById('add-employee-modal').style.display = 'block';
    });

    // Event listener for closing the add employee modal
    document.getElementById('close-add-employee-modal').addEventListener('click', () => {
        document.getElementById('add-employee-modal').style.display = 'none';
    });

    // Event listener for add employee form submission
    document.getElementById('add-employee-form').addEventListener('submit', (e) => {
        e.preventDefault();
        addEmployee();
    });

    // Event listener for closing the edit employee modal
    document.getElementById('close-edit-employee-modal').addEventListener('click', () => {
        document.getElementById('edit-employee-modal').style.display = 'none';
    });

    // Event listener for edit employee form submission
    document.getElementById('edit-employee-form').addEventListener('submit', (e) => {
        e.preventDefault();
        updateEmployee();
    });

    // Event listener for closing the view assets modal
    document.getElementById('close-view-assets-modal').addEventListener('click', () => {
        document.getElementById('view-assets-modal').style.display = 'none';
    });

    // Event listener for 'Add Asset' button
    document.getElementById('add-asset-btn').addEventListener('click', () => {
        document.getElementById('asset-name').value = ''; // Clear the input fields
        document.getElementById('asset-type').value = '';
        document.getElementById('serial-number').value = '';
        document.getElementById('add-asset-modal').style.display = 'block';
    });

    // Event listener for add asset form submission
    document.getElementById('add-asset-form').addEventListener('submit', (e) => {
        e.preventDefault();
        addAsset();
    });

    document.getElementById('close-add-asset-modal').addEventListener('click', () => {
        document.getElementById('add-asset-modal').style.display = 'none';
    });

     // Event listener for closing the edit asset modal
    document.getElementById('close-edit-asset-modal').addEventListener('click', () => {
        document.getElementById('edit-asset-modal').style.display = 'none';
    });
    // Event listener for edit asset form submission
    document.getElementById('edit-asset-form').addEventListener('submit', (e) => {
        e.preventDefault();
        updateAsset();
    });

    // Event listener for 'Search' button
    document.getElementById('search-btn').addEventListener('click', searchEmployees);
});


function fetchEmployees() {
    fetch('/api/employees')
        .then(response => response.json())
        .then(data => {
            // Sort employees by name
            data.sort((a, b) => a.name.localeCompare(b.name));

            const employeeTableBody = document.querySelector('#employee-table tbody');
            employeeTableBody.innerHTML = ''; // Clear any existing rows

            data.forEach(employee => {
                const employeeRow = document.createElement('tr');
                employeeRow.setAttribute('data-id', employee.id);
                employeeRow.innerHTML = `
                    <td>${employee.id}</td>
                    <td>${employee.name}</td>
                    <td>${employee.email}</td>
                    <td>${employee.contact_number}</td>
                    <td>${employee.office_location}</td>
                    <td>${employee.number_of_assets}</td>
                    <td class="actions">
                        <button onclick="viewAssets('${employee.id}')">View Assets</button>
                        <button onclick="editEmployee('${employee.id}')">Edit</button>
                        <button class="delete-btn" onclick="deleteEmployee('${employee.id}')">Delete</button>
                    </td>
                `;
                employeeTableBody.appendChild(employeeRow);
            });
        })
        .catch(error => console.error('Error fetching employees:', error));
}


// function fetchEmployees() {
//     fetch('/api/employees')
//         .then(response => response.json())
//         .then(data => {
//             // Sort employees by name
//             data.sort((a, b) => a.name.localeCompare(b.name));

//             const employeeTableBody = document.querySelector('#employee-table tbody');
//             employeeTableBody.innerHTML = ''; // Clear any existing rows

//             data.forEach(employee => {
//                 const employeeRow = document.createElement('tr');
//                 employeeRow.innerHTML = `
//                     <td>${employee.id}</td>
//                     <td>${employee.name}</td>
//                     <td>${employee.email}</td>
//                     <td>${employee.contact_number}</td>
//                     <td>${employee.office_location}</td>
//                     <td>${employee.number_of_assets}</td>
//                     <td class="actions">
//                         <button onclick="viewAssets('${employee.id}')">View Assets</button>
//                         <button onclick="editEmployee('${employee.id}')">Edit</button>
//                         <button class="delete-btn" onclick="deleteEmployee('${employee.id}')">Delete</button>
//                     </td>
//                 `;
//                 employeeTableBody.appendChild(employeeRow);
//             });
//         })
//         .catch(error => console.error('Error fetching employees:', error));
// }


function addEmployee() {
    const id = document.getElementById('employee-id').value;
    const name = document.getElementById('employee-name').value;
    const email = document.getElementById('employee-email').value;
    const contact_number = document.getElementById('employee-contact-number').value;
    const office_location = document.getElementById('employee-office-location').value;

    fetch('/api/employees', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, name, email, contact_number, office_location })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Employee added:', data);
        document.getElementById('add-employee-modal').style.display = 'none'; // Close the modal
        fetchEmployees(); // Refresh the employee list
    })
    .catch(error => console.error('Error adding employee:', error));
}

function editEmployee(employeeId) {
    fetch(`/api/employees?id=${employeeId}`)
        .then(response => response.json())
        .then(data => {
            const employee = data[0]; // Assuming there is only one employee with this ID
            document.getElementById('edit-employee-id').value = employee.id;
            document.getElementById('edit-employee-name').value = employee.name;
            document.getElementById('edit-employee-email').value = employee.email;
            document.getElementById('edit-employee-contact-number').value = employee.contact_number;
            document.getElementById('edit-employee-office-location').value = employee.office_location;
            document.getElementById('edit-employee-modal').style.display = 'block';
        })
        .catch(error => console.error('Error fetching employee:', error));
}

function updateEmployee() {
    const id = document.getElementById('edit-employee-id').value;
    const name = document.getElementById('edit-employee-name').value;
    const email = document.getElementById('edit-employee-email').value;
    const contact_number = document.getElementById('edit-employee-contact-number').value;
    const office_location = document.getElementById('edit-employee-office-location').value;

    fetch(`/api/employees/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, contact_number, office_location })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Employee updated:', data);
        document.getElementById('edit-employee-modal').style.display = 'none'; // Close the modal
        fetchEmployees(); // Refresh the employee list
    })
    .catch(error => console.error('Error updating employee:', error));
}




// function fetchAssets() {
//     fetch('/api/assets')
//         .then(response => response.json())
//         .then(data => {
//             // Implement logic to display assets if necessary
//             console.log('Assets:', data);
//         })
//         .catch(error => console.error('Error fetching assets:', error));
// }

function searchEmployees() {
    const employeeId = document.getElementById('search-employee-id').value.trim();
    const name = document.getElementById('search-employee-name').value.trim();
    // const email = document.getElementById('search-employee-email').value.trim();

    // Log search criteria
    console.log('Search Criteria:', { employeeId, name});

    // Create the search query based on the provided criteria
    let query = '/api/employees?';
    if (employeeId) {
        query += `id=${employeeId}&`;
    }
    if (name) {
        query += `name=${name}&`;
    }
    // if (email) {
    //     query += `email=${email}&`;
    // }

    // Remove the trailing '&'
    query = query.slice(0, -1);

    console.log('Search Query:', query);

    fetch(query)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    return []; // No employee found
                }
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const employeeTableBody = document.querySelector('#employee-table tbody');
            
            if (data.length) {
                employeeTableBody.innerHTML = ''; // Clear any existing rows
                data.forEach(employee => {
                    const employeeRow = document.createElement('tr');
                    employeeRow.innerHTML = `
                        <td>${employee.id}</td>
                        <td>${employee.name}</td>
                        <td>${employee.email}</td>
                        <td>${employee.contact_number}</td>
                        <td>${employee.office_location}</td>
                        <td>${employee.number_of_assets}</td>
                        <td class="actions">
                            <button onclick="viewAssets('${employee.id}')">View Assets</button>
                            <button onclick="editEmployee('${employee.id}')">Edit</button>
                            <button class="delete-btn" onclick="deleteEmployee('${employee.id}')">Delete</button>
                        </td>
                    `;
                    employeeTableBody.appendChild(employeeRow);
                });
            } else {
                let alertMessage = 'No employee found.\n';

                if (employeeId) {
                    alertMessage += `Employee ID entered: ${employeeId}\n`;
                }
                if (name) {
                    alertMessage += `Name entered: ${name}\n`;
                }
                // if (email) {
                //     alertMessage += `Email entered: ${email}\n`;
                // }

                alert(alertMessage);

                // const noDataRow = document.createElement('tr');
                // noDataRow.innerHTML = `
                //     <td colspan="7">No employee found</td>
                // `;
                // employeeTableBody.appendChild(noDataRow);
            }
        })
        .catch(error => console.error('Error fetching employees:', error));
}


function deleteEmployee(employeeId) {
    if (confirm('Are you sure you want to delete this employee?')) {
        fetch(`/api/employees/${employeeId}`, {
            method: 'DELETE',
        })
        .then(() => {
            fetchEmployees(); // Refresh the employee list
        })
        .catch(error => console.error('Error deleting employee:', error));
    }
}

function viewAssets(employeeId) {
    document.getElementById('view-assets-modal').style.display = 'block';

    fetch(`/api/assets?employee_id=${employeeId}`)
        .then(response => response.json())
        .then(data => {
            const assetsTableBody = document.querySelector('#assets-table tbody');
            assetsTableBody.innerHTML = ''; // Clear any existing rows

            data.forEach(asset => {
                const assetRow = document.createElement('tr');
                assetRow.innerHTML = `
                    <td>${asset.asset_name}</td>
                    <td>${asset.asset_type}</td>
                    <td>${asset.serial_number}</td>
                    <td class="actions">
                        <button onclick="editAsset('${asset.serial_number}')">Edit</button>
                        <button class="delete-btn" onclick="deleteAsset('${asset.serial_number}')">Delete</button>
                    </td>
                `;
                assetsTableBody.appendChild(assetRow);
            });

            // Store the current employee ID for adding new assets
            document.getElementById('add-asset-form').dataset.employeeId = employeeId;
        })
        .catch(error => console.error('Error fetching assets:', error));
}



function addAsset() {
    const employeeId = document.getElementById('add-asset-form').dataset.employeeId;
    const asset_name = document.getElementById('asset-name').value;
    const asset_type = document.getElementById('asset-type').value;
    const serial_number = document.getElementById('serial-number').value;

    fetch('/api/assets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ employee_id: employeeId, asset_name, asset_type, serial_number })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('add-asset-modal').style.display = 'none'; 
        console.log('Asset added:', data);
        updateEmployeeAssetCount(employeeId);
        viewAssets(employeeId); // Refresh the asset list
    })
    .catch(error => console.error('Error adding asset:', error));
}

function updateEmployeeAssetCount(employeeId) {
    console.log("Fetching updated asset count for employee:", employeeId);

    fetch(`/api/employees?id=${employeeId}`)
        .then(response => response.json())
        .then(data => {
            const employee = data[0]; // Assuming there is only one employee with this ID
            if (employee) {
                console.log("Updated employee data:", employee);
                const employeeRow = document.querySelector(`#employee-table tbody tr[data-id="${employeeId}"]`);
                console.log("Employee row found:", employeeRow);

                if (employeeRow) {
                    const assetCountCell = employeeRow.querySelector('td:nth-child(6)'); // Update the 6th column (number_of_assets)
                    console.log("Asset count cell found:", assetCountCell);
                    assetCountCell.textContent = employee.number_of_assets;
                    console.log("Asset count updated successfully:", employee.number_of_assets);
                } else {
                    console.log("No matching employee row found in the table.");
                }
            } else {
                console.log("Employee not found in the database.");
            }
        })
        .catch(error => console.error('Error fetching employee:', error));
}





function editAsset(serialNumber) {
    fetch(`/api/assets?serial_number=${serialNumber}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const asset = data[0]; // Assuming there is only one asset with this serial number
                document.getElementById('edit-asset-name').value = asset.asset_name;
                document.getElementById('edit-asset-type').value = asset.asset_type;
                document.getElementById('edit-serial-number').value = asset.serial_number;
                document.getElementById('edit-asset-form').dataset.serialNumber = asset.serial_number;
                document.getElementById('edit-asset-modal').style.display = 'block';
            } else {
                console.error('No asset found with the given serial number');
            }
        })
        .catch(error => console.error('Error fetching asset:', error));
}

function updateAsset() {
    const serialNumber = document.getElementById('edit-asset-form').dataset.serialNumber;
    const asset_name = document.getElementById('edit-asset-name').value;
    const asset_type = document.getElementById('edit-asset-type').value;
    const serial_number = document.getElementById('edit-serial-number').value;

    fetch(`/api/assets/${serial_number}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ asset_name, asset_type, serial_number })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Asset updated:', data);
        document.getElementById('edit-asset-modal').style.display = 'none'; // Close the modal
        const employeeId = document.getElementById('add-asset-form').dataset.employeeId;
        viewAssets(employeeId); // Refresh the asset list
    })
    .catch(error => console.error('Error updating asset:', error));
}



function deleteAsset(assetId) {
    if (confirm('Are you sure you want to delete this asset?')) {
        fetch(`/api/assets/${assetId}`, {
            method: 'DELETE',
        })
        .then(() => {
            const employeeId = document.getElementById('add-asset-form').dataset.employeeId;
            viewAssets(employeeId); // Refresh the asset list

            // Update the asset count for the employee
            updateEmployeeAssetCount(employeeId);
        })
        .catch(error => console.error('Error deleting asset:', error));
    }
}

