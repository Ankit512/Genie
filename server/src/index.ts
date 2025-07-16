import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Import routes
import authRoutes from './routes/auth.js';
import servicesRoutes from './routes/services.js';
import bookingsRoutes from './routes/bookings.js';
import searchRoutes from './routes/search.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/search', searchRoutes);

// Socket.io for real-time features
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Join room based on user role
  socket.on('join-room', ({ userId, role }) => {
    socket.join(`user:${userId}`);
    if (role === 'provider') {
      socket.join('providers');
    }
  });
  
  // Handle booking notifications
  socket.on('new-booking', (booking) => {
    // Notify all providers
    io.to('providers').emit('booking-notification', booking);
  });
  
  // Handle booking status updates
  socket.on('booking-status-update', ({ bookingId, status, customerId, providerId }) => {
    // Notify customer
    io.to(`user:${customerId}`).emit('booking-update', { bookingId, status });
    // Notify provider
    if (providerId) {
      io.to(`user:${providerId}`).emit('booking-update', { bookingId, status });
    }
  });
  
  // Handle chat messages
  socket.on('send-message', ({ bookingId, message, senderId, receiverId }) => {
    // Send to receiver
    io.to(`user:${receiverId}`).emit('new-message', {
      bookingId,
      message,
      senderId,
      timestamp: new Date()
    });
  });
  
  // Handle provider location updates
  socket.on('update-location', ({ providerId, location, bookingId }) => {
    // Notify customer about provider location
    socket.to(`booking:${bookingId}`).emit('provider-location', {
      providerId,
      location,
      timestamp: new Date()
    });
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io accessible in routes
app.set('io', io);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 