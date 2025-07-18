#!/bin/bash

echo "Setting up server environment..."

# Create server .env file
cat > server/.env << EOL
# Firebase Admin SDK - Path to your service account key file
GOOGLE_APPLICATION_CREDENTIALS=./config/serviceAccountKey.json

# Firebase Configuration
FIREBASE_DATABASE_URL=https://genie-e3e74.firebaseio.com
FIREBASE_STORAGE_BUCKET=genie-e3e74.appspot.com

# Server Configuration
PORT=3001
CLIENT_URL=http://localhost:5173

# Optional: Stripe (for future payment integration)
# STRIPE_SECRET_KEY=sk_test_...
EOL

echo "✅ Server .env file created"

# Create config directory if it doesn't exist
mkdir -p server/config

echo ""
echo "⚠️  IMPORTANT: Now you need to:"
echo "1. Download your Firebase service account key from Firebase Console"
echo "2. Save it as: server/config/serviceAccountKey.json"
echo "3. Make sure server/config/serviceAccountKey.json is in .gitignore"
echo ""
echo "After adding the service account key, you can start the server with:"
echo "cd server && npm run dev" 