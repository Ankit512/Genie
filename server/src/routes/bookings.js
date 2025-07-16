import express from 'express';
// import Stripe from 'stripe';
import { db, auth } from '../config/firebase-admin.js';
import { getServiceById } from '../models/services.js';

const router = express.Router();
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
//   apiVersion: '2023-10-16'
// });

// Middleware to verify authentication
const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Create a new booking
router.post('/create', verifyAuth, async (req, res) => {
  try {
    const { 
      serviceId, 
      providerId, 
      date, 
      time, 
      address, 
      notes, 
      paymentMethodId,
      urgent,
      weekend 
    } = req.body;

    // Validate service
    const service = getServiceById(serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    // Calculate price
    let price = service.basePrice;
    if (urgent) price *= 1.5;
    if (weekend) price *= 1.2;
    const totalAmount = Math.round(price * 100); // Convert to cents for Stripe

    // Create payment intent
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: totalAmount,
    //   currency: 'eur',
    //   payment_method: paymentMethodId,
    //   confirm: true,
    //   metadata: {
    //     customerId: req.user.uid,
    //     serviceId,
    //     providerId: providerId || 'unassigned'
    //   }
    // });

    // Create booking document
    const bookingData = {
      customerId: req.user.uid,
      providerId: providerId || null,
      service: {
        id: service.id,
        name: service.name,
        categoryId: service.categoryId,
        categoryName: service.categoryName,
        basePrice: service.basePrice,
        duration: service.duration
      },
      scheduledDate: date,
      scheduledTime: time,
      address,
      notes,
      status: 'pending',
      paymentStatus: 'paid',
      // paymentIntentId: paymentIntent.id,
      amount: price,
      modifiers: { urgent, weekend },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const bookingRef = await db.collection('bookings').add(bookingData);
    const bookingId = bookingRef.id;

    // Get Socket.io instance and emit notification
    const io = req.app.get('io');
    if (io) {
      io.to('providers').emit('new-booking', {
        id: bookingId,
        ...bookingData
      });
    }

    res.status(201).json({
      bookingId,
      booking: bookingData,
      // paymentIntent: {
      //   id: paymentIntent.id,
      //   status: paymentIntent.status,
      //   amount: paymentIntent.amount
      // }
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Get customer bookings
router.get('/customer', verifyAuth, async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = db.collection('bookings')
      .where('customerId', '==', req.user.uid)
      .orderBy('createdAt', 'desc');
    
    if (status) {
      query = query.where('status', '==', status);
    }

    const snapshot = await query.get();
    const bookings = [];

    for (const doc of snapshot.docs) {
      const booking = { id: doc.id, ...doc.data() };
      
      // Get provider details if assigned
      if (booking.providerId) {
        const providerDoc = await db.collection('users').doc(booking.providerId).get();
        if (providerDoc.exists) {
          booking.provider = {
            id: providerDoc.id,
            name: providerDoc.data().name,
            phone: providerDoc.data().phone,
            rating: providerDoc.data().rating
          };
        }
      }
      
      bookings.push(booking);
    }

    res.json({ bookings, total: bookings.length });
  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get provider jobs
router.get('/provider/jobs', verifyAuth, async (req, res) => {
  try {
    // First check if user is a provider
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists || userDoc.data().role !== 'provider') {
      return res.status(403).json({ error: 'Not authorized as provider' });
    }

    const providerData = userDoc.data();
    const { status = 'pending' } = req.query;

    // Get bookings matching provider's services
    let bookings = [];

    if (status === 'pending') {
      // Get unassigned bookings matching provider's services
      const snapshot = await db.collection('bookings')
        .where('status', '==', 'pending')
        .where('providerId', '==', null)
        .orderBy('scheduledDate', 'asc')
        .get();

      // Filter by provider's services
      for (const doc of snapshot.docs) {
        const booking = { id: doc.id, ...doc.data() };
        if (providerData.services.includes(booking.service.categoryId)) {
          // Get customer details
          const customerDoc = await db.collection('users').doc(booking.customerId).get();
          if (customerDoc.exists) {
            booking.customer = {
              id: customerDoc.id,
              name: customerDoc.data().name,
              phone: customerDoc.data().phone,
              address: customerDoc.data().address
            };
          }
          bookings.push(booking);
        }
      }
    } else {
      // Get assigned bookings for this provider
      const snapshot = await db.collection('bookings')
        .where('providerId', '==', req.user.uid)
        .where('status', '==', status)
        .orderBy('scheduledDate', 'asc')
        .get();

      for (const doc of snapshot.docs) {
        const booking = { id: doc.id, ...doc.data() };
        // Get customer details
        const customerDoc = await db.collection('users').doc(booking.customerId).get();
        if (customerDoc.exists) {
          booking.customer = {
            id: customerDoc.id,
            name: customerDoc.data().name,
            phone: customerDoc.data().phone,
            address: customerDoc.data().address
          };
        }
        bookings.push(booking);
      }
    }

    res.json({ jobs: bookings, total: bookings.length });
  } catch (error) {
    console.error('Error fetching provider jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Accept a job (provider)
router.post('/:bookingId/accept', verifyAuth, async (req, res) => {
  try {
    const { bookingId } = req.params;

    // Verify provider
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists || userDoc.data().role !== 'provider') {
      return res.status(403).json({ error: 'Not authorized as provider' });
    }

    // Get booking
    const bookingRef = db.collection('bookings').doc(bookingId);
    const bookingDoc = await bookingRef.get();
    
    if (!bookingDoc.exists) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookingDoc.data();
    
    // Check if already assigned
    if (booking.providerId) {
      return res.status(400).json({ error: 'Booking already assigned' });
    }

    // Update booking
    await bookingRef.update({
      providerId: req.user.uid,
      status: 'accepted',
      acceptedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Send notification to customer
    const io = req.app.get('io');
    if (io) {
      io.to(`user:${booking.customerId}`).emit('booking-update', {
        bookingId,
        status: 'accepted',
        provider: {
          id: req.user.uid,
          name: userDoc.data().name
        }
      });
    }

    res.json({ 
      message: 'Job accepted successfully',
      bookingId,
      status: 'accepted'
    });

  } catch (error) {
    console.error('Error accepting job:', error);
    res.status(500).json({ error: 'Failed to accept job' });
  }
});

// Update booking status
router.put('/:bookingId/status', verifyAuth, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, location } = req.body;

    const validStatuses = ['accepted', 'en-route', 'arrived', 'in-progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Get booking
    const bookingRef = db.collection('bookings').doc(bookingId);
    const bookingDoc = await bookingRef.get();
    
    if (!bookingDoc.exists) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookingDoc.data();

    // Verify user is either customer or assigned provider
    if (req.user.uid !== booking.customerId && req.user.uid !== booking.providerId) {
      return res.status(403).json({ error: 'Not authorized to update this booking' });
    }

    // Update booking
    const updates = {
      status,
      updatedAt: new Date().toISOString(),
      [`${status}At`]: new Date().toISOString()
    };

    if (location && status === 'en-route') {
      updates.providerLocation = location;
    }

    await bookingRef.update(updates);

    // Send notifications
    const io = req.app.get('io');
    if (io) {
      // Notify both parties
      io.to(`user:${booking.customerId}`).emit('booking-update', {
        bookingId,
        status,
        location
      });
      
      if (booking.providerId && booking.providerId !== req.user.uid) {
        io.to(`user:${booking.providerId}`).emit('booking-update', {
          bookingId,
          status
        });
      }
    }

    // If completed, prompt for review
    if (status === 'completed') {
      // Create review request
      await db.collection('reviewRequests').add({
        bookingId,
        customerId: booking.customerId,
        providerId: booking.providerId,
        serviceId: booking.service.id,
        createdAt: new Date().toISOString(),
        reviewed: false
      });
    }

    res.json({ 
      message: 'Status updated successfully',
      bookingId,
      status
    });

  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Get booking details
router.get('/:bookingId', verifyAuth, async (req, res) => {
  try {
    const { bookingId } = req.params;

    const bookingDoc = await db.collection('bookings').doc(bookingId).get();
    
    if (!bookingDoc.exists) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = { id: bookingDoc.id, ...bookingDoc.data() };

    // Verify user has access
    if (req.user.uid !== booking.customerId && req.user.uid !== booking.providerId) {
      return res.status(403).json({ error: 'Not authorized to view this booking' });
    }

    // Get additional details
    if (booking.providerId) {
      const providerDoc = await db.collection('users').doc(booking.providerId).get();
      if (providerDoc.exists) {
        booking.provider = {
          id: providerDoc.id,
          name: providerDoc.data().name,
          phone: providerDoc.data().phone,
          rating: providerDoc.data().rating,
          photo: providerDoc.data().photo
        };
      }
    }

    if (booking.customerId && req.user.uid === booking.providerId) {
      const customerDoc = await db.collection('users').doc(booking.customerId).get();
      if (customerDoc.exists) {
        booking.customer = {
          id: customerDoc.id,
          name: customerDoc.data().name,
          phone: customerDoc.data().phone,
          address: customerDoc.data().address
        };
      }
    }

    res.json({ booking });

  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Cancel booking
router.post('/:bookingId/cancel', verifyAuth, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;

    const bookingRef = db.collection('bookings').doc(bookingId);
    const bookingDoc = await bookingRef.get();
    
    if (!bookingDoc.exists) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookingDoc.data();

    // Verify user is customer
    if (req.user.uid !== booking.customerId) {
      return res.status(403).json({ error: 'Only customer can cancel booking' });
    }

    // Check if booking can be cancelled
    if (['completed', 'cancelled'].includes(booking.status)) {
      return res.status(400).json({ error: 'Booking cannot be cancelled' });
    }

    // Process refund if payment was made
    // if (booking.paymentIntentId) {
    //   try {
    //     await stripe.refunds.create({
    //       payment_intent: booking.paymentIntentId,
    //       reason: 'requested_by_customer'
    //     });
    //   } catch (refundError) {
    //     console.error('Refund error:', refundError);
    //     // Continue with cancellation even if refund fails
    //   }
    // }

    // Update booking
    await bookingRef.update({
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
      cancelReason: reason,
      updatedAt: new Date().toISOString()
    });

    // Notify provider if assigned
    if (booking.providerId) {
      const io = req.app.get('io');
      if (io) {
        io.to(`user:${booking.providerId}`).emit('booking-update', {
          bookingId,
          status: 'cancelled',
          reason
        });
      }
    }

    res.json({ 
      message: 'Booking cancelled successfully',
      bookingId,
      status: 'cancelled',
      refundInitiated: !!booking.paymentIntentId
    });

  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

export default router; 