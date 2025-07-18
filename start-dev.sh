#!/bin/bash

echo "Starting Genie development servers..."

# Start client in background
echo "Starting client on http://localhost:5173..."
cd client && npm run dev &
CLIENT_PID=$!

# Give client time to start
sleep 2

# Start server
echo "Starting server on http://localhost:3001..."
cd ../server && npm run dev &
SERVER_PID=$!

echo ""
echo "✅ Both servers are starting..."
echo "   Client: http://localhost:5173"
echo "   Server: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for Ctrl+C
trap "kill $CLIENT_PID $SERVER_PID; exit" INT
wait 