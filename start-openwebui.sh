#!/bin/bash

echo "Starting OpenWebUI..."

# Check if the build directory exists
if [ ! -d "openwebui/build" ]; then
  echo "Build directory not found. Running build script first..."
  ./build-openwebui.sh
fi

# Start OpenWebUI
cd openwebui
npm run preview -- --port 3000 &
OPENWEBUI_PID=$!

echo "OpenWebUI started with PID: $OPENWEBUI_PID"
echo "You can access it at: http://localhost:3000"

# Return to project root
cd ..

# Wait for OpenWebUI process to finish
wait $OPENWEBUI_PID