#!/bin/bash

echo "Starting OpenWebUI Build Process"

# Navigate to OpenWebUI directory
cd openwebui

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building OpenWebUI..."
npm run build

# Create a .nojekyll file (needed for GitHub Pages)
touch build/.nojekyll

# Return to project root
cd ..

echo "OpenWebUI build complete!"
echo "You can now access OpenWebUI at: /openwebui/"