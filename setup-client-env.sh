#!/bin/bash

echo "Setting up client environment..."

# Create client .env file
cat > client/.env << EOL
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyDS9BgPflbs3CVpCYE_ZlVcHgw0nOx2T2Y
VITE_FIREBASE_AUTH_DOMAIN=genie-e3e74.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=genie-e3e74
VITE_FIREBASE_STORAGE_BUCKET=genie-e3e74.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=21846163172
VITE_FIREBASE_APP_ID=1:21846163172:web:7c3a525db1061ff26ff6f1

# Google Maps (optional - add your key when ready)
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY_HERE
EOL

echo "✅ Client .env file created"
echo ""
echo "Client is ready to run with: cd client && npm run dev" 