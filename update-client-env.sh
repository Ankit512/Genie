#!/bin/bash

echo "Updating client environment for localhost development..."

# Update the authDomain in .env to use localhost
if [ -f "client/.env" ]; then
    # Create backup
    cp client/.env client/.env.backup
    
    # Update authDomain
    sed -i '' 's/VITE_FIREBASE_AUTH_DOMAIN=.*/VITE_FIREBASE_AUTH_DOMAIN=localhost:5173/' client/.env
    
    echo "✅ Updated VITE_FIREBASE_AUTH_DOMAIN to localhost:5173"
    echo "✅ Original .env backed up to client/.env.backup"
else
    echo "❌ client/.env not found"
fi 