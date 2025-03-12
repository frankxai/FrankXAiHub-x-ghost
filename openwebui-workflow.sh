#!/bin/bash

echo "Starting OpenWebUI Installation Workflow"

# Check if OpenWebUI directory exists
if [ -d "openwebui" ]; then
  echo "OpenWebUI directory already exists"
  
  # Check if it's a git repository
  if [ -d "openwebui/.git" ]; then
    echo "OpenWebUI is already cloned, updating..."
    cd openwebui
    git pull
    cd ..
  else
    echo "OpenWebUI directory exists but is not a git repository."
    echo "Backing up and re-cloning..."
    mv openwebui openwebui_old_$(date +%s)
    git clone https://github.com/open-webui/open-webui.git openwebui
  fi
else
  echo "Cloning OpenWebUI repository..."
  git clone https://github.com/open-webui/open-webui.git openwebui
fi

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

echo "OpenWebUI installation and build complete!"
echo "You can now access OpenWebUI at: /openwebui/"