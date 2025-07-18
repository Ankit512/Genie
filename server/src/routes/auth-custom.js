import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/firebase-admin.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Helper function to generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role, iat: Date.now() },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Custom Registration
router.post('/register/custom', async (req, res) => {
  try {
    const { email, password, name, phone, address, role = 'customer' } = req.body;

    // Validate required fields
    if (!email || !password || !name || !phone || !address) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (!existingUser.empty) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user document
    const userId = uuidv4();
    const userData = {
      uid: userId,
      email,
      name,
      phone,
      address,
      role,
      password: hashedPassword,
      emailVerified: true, // Auto-verify for custom auth
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add provider-specific fields
    if (role === 'provider') {
      userData.status = 'pending';
      userData.rating = 0;
      userData.totalReviews = 0;
    }

    await db.collection('users').doc(userId).set(userData);

    // Generate JWT token
    const token = generateToken(userId, role);

    res.status(201).json({
      message: 'User registered successfully',
      uid: userId,
      token,
      user: {
        email,
        name,
        role,
        emailVerified: true
      }
    });
  } catch (error) {
    console.error('Custom registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Custom Login
router.post('/login/custom', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user by email
    const userQuery = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (userQuery.empty) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();

    // Verify password
    const isValidPassword = await bcrypt.compare(password, userData.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(userData.uid, userData.role);

    res.json({
      message: 'Login successful',
      uid: userData.uid,
      token,
      user: {
        email: userData.email,
        name: userData.name,
        role: userData.role,
        status: userData.status,
        emailVerified: userData.emailVerified
      }
    });
  } catch (error) {
    console.error('Custom login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Verify JWT token middleware
export const verifyCustomToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user data
    const userDoc = await db.collection('users').doc(decoded.userId).get();
    if (!userDoc.exists) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = { ...userDoc.data(), uid: decoded.userId };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export default router; 