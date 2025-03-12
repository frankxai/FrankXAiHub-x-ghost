#!/bin/bash

echo "Starting OpenWebUI build process..."

# Create the build directories if they don't exist
mkdir -p openwebui/build
mkdir -p openwebui/build/_app
mkdir -p openwebui/build/static

# Navigate to the OpenWebUI directory
cd openwebui

# Install dependencies if node_modules doesn't exist or package.json has changed
if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
  echo "Installing OpenWebUI dependencies..."
  npm install
fi

# Build the OpenWebUI project
echo "Building OpenWebUI..."
npm run build

# Create a .nojekyll file to prevent GitHub Pages from ignoring files that begin with an underscore
touch build/.nojekyll

# Finish
echo "OpenWebUI build complete!"
echo "Build output available in openwebui/build/"

# Return to the project root
cd ..

echo "Build process finished successfully."