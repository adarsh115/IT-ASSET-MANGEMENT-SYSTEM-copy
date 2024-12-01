#!/bin/bash

# Create subdirectories inside the current project folder
mkdir -p public/css public/js server/db server/routes

# Create the required files
touch public/css/styles.css
touch public/js/app.js
touch public/index.html
touch server/db/connection.js
touch server/routes/api.js
touch server/server.js
touch .env

# Add a basic package.json file
cat > package.json <<EOL
{
  "name": "it-asset-management-tool",
  "version": "1.0.0",
  "description": "A simple IT asset management tool",
  "main": "server/server.js",
  "scripts": {
    "start": "node server/server.js",
    "dev": "nodemon server/server.js"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {}
}
EOL

# Print success message
echo "Remaining project structure created successfully!"

