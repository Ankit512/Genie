#!/bin/bash

echo "Setting up Firebase Auth Emulator for local development..."

# Install Firebase CLI globally if not already installed
if ! command -v firebase &> /dev/null; then
    echo "Installing Firebase CLI..."
    npm install -g firebase-tools
fi

# Initialize Firebase in the project if not already done
if [ ! -f "firebase.json" ]; then
    echo "Initializing Firebase project..."
    firebase init emulators --project genie-e3e74
fi

# Create firebase.json if it doesn't exist
cat > firebase.json << EOL
{
  "emulators": {
    "auth": {
      "port": 9099
    },
    "ui": {
      "enabled": true,
      "port": 4000
    }
  }
}
EOL

echo "✅ Firebase emulator configuration created"
echo ""
echo "To start the emulator:"
echo "firebase emulators:start --only auth"
echo ""
echo "Then update your Firebase config to use the emulator" 