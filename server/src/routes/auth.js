import express from 'express';
import { auth, db, storage } from '../config/firebase-admin.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Customer Registration
router.post('/register/customer', async (req, res) => {
  try {
    const { email, password, name, phone, address, consentedGDPR } = req.body;

    // Validate required fields
    if (!email || !password || !name || !phone || !address || !consentedGDPR) {
      return res.status(400).json({ error: 'All fields are required including GDPR consent' });
    }

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
      phoneNumber: phone
    });

    // Store user data in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      name,
      phone,
      address,
      role: 'customer',
      consentedGDPR,
      createdAt: new Date().toISOString(),
      emailVerified: false
    });

    // Generate custom token for client-side auth
    const customToken = await auth.createCustomToken(userRecord.uid);

    res.status(201).json({
      message: 'Customer registered successfully',
      uid: userRecord.uid,
      token: customToken,
      role: 'customer'
    });
  } catch (error) {
    console.error('Customer registration error:', error);
    if (error.code === 'auth/email-already-exists') {
      return res.status(409).json({ error: 'Email already registered' });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Provider Registration with file upload
router.post('/register/provider', upload.array('certificates', 5), async (req, res) => {
  try {
    const { email, password, name, phone, address, services, bio, consentedGDPR, vettingAgreement } = req.body;

    // Validate required fields
    if (!email || !password || !name || !phone || !address || !services || !consentedGDPR || !vettingAgreement) {
      return res.status(400).json({ error: 'All fields are required including agreements' });
    }

    // Parse services if sent as string
    const selectedServices = typeof services === 'string' ? JSON.parse(services) : services;

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
      phoneNumber: phone
    });

    // Upload certificates to Firebase Storage
    const certificateUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fileName = `certificates/${userRecord.uid}/${uuidv4()}_${file.originalname}`;
        const fileRef = storage.bucket().file(fileName);
        
        await fileRef.save(file.buffer, {
          metadata: { contentType: file.mimetype }
        });
        
        const [url] = await fileRef.getSignedUrl({
          action: 'read',
          expires: '03-01-2500'
        });
        
        certificateUrls.push({
          name: file.originalname,
          url,
          uploadedAt: new Date().toISOString()
        });
      }
    }

    // Store provider data in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      name,
      phone,
      address,
      role: 'provider',
      status: 'pending', // Requires manual approval
      services: selectedServices,
      bio,
      certificates: certificateUrls,
      consentedGDPR,
      vettingAgreement,
      rating: 0,
      totalReviews: 0,
      createdAt: new Date().toISOString(),
      emailVerified: false
    });

    // Create provider details subcollection
    await db.collection('users').doc(userRecord.uid)
      .collection('providerDetails').doc('info').set({
        certificates: certificateUrls,
        verificationStatus: 'pending',
        verificationDate: null,
        notes: ''
      });

    // Generate custom token
    const customToken = await auth.createCustomToken(userRecord.uid);

    // TODO: Send notification email to admin for manual vetting

    res.status(201).json({
      message: 'Provider registered successfully. Pending approval.',
      uid: userRecord.uid,
      token: customToken,
      role: 'provider',
      status: 'pending'
    });
  } catch (error) {
    console.error('Provider registration error:', error);
    if (error.code === 'auth/email-already-exists') {
      return res.status(409).json({ error: 'Email already registered' });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login endpoint for both roles
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Verify user credentials with Firebase Admin
    const userRecord = await auth.getUserByEmail(email);
    
    // Get user data from Firestore
    const userDoc = await db.collection('users').doc(userRecord.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();

    // Generate custom token
    const customToken = await auth.createCustomToken(userRecord.uid, {
      role: userData.role,
      status: userData.status
    });

    res.json({
      message: 'Login successful',
      uid: userRecord.uid,
      token: customToken,
      user: {
        email: userData.email,
        name: userData.name,
        role: userData.role,
        status: userData.status,
        emailVerified: userRecord.emailVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    delete userData.consentedGDPR; // Don't send sensitive data

    res.json({ user: userData });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);
    
    const { name, phone, address, bio, services } = req.body;
    const updates = {};
    
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (address) updates.address = address;
    if (bio) updates.bio = bio;
    if (services) updates.services = services;
    
    updates.updatedAt = new Date().toISOString();

    await db.collection('users').doc(decodedToken.uid).update(updates);

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Update failed' });
  }
});

export default router; 