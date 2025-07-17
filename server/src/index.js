import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import servicesRoutes from './routes/services.js';
import bookingsRoutes from './routes/bookings.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Make io accessible to routes
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/bookings', bookingsRoutes);

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join user-specific room
  socket.on('join-user', (userId) => {
    socket.join(`user-${userId}`);
  });

  // Join booking room
  socket.on('join-booking', (bookingId) => {
    socket.join(`booking-${bookingId}`);
  });

  // Handle chat messages
  socket.on('send-message', (data) => {
    io.to(`booking-${data.bookingId}`).emit('new-message', {
      sender: data.senderId,
      message: data.message,
      timestamp: new Date()
    });
  });

  // Handle location updates
  socket.on('update-location', (data) => {
    io.to(`booking-${data.bookingId}`).emit('provider-location', {
      providerId: data.providerId,
      location: data.location
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, 'localhost', () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 