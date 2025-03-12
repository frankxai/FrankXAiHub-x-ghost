#!/bin/bash

echo "Starting OpenWebUI..."

# Navigate to OpenWebUI directory
cd openwebui

# Check if the build directory exists
if [ ! -d "build" ]; then
  echo "Build directory not found. Running build process first..."
  npm install
  npm run build
  touch build/.nojekyll
fi

# You could start a separate server for OpenWebUI here if needed
# For now, we'll rely on serving the static files via Express

echo "OpenWebUI is ready!"
echo "You can access it through the main application server."

# Return to project root
cd ..