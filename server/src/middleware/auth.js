import { verifyToken, getUserByUid } from '../config/firebase.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await verifyToken(token);
    const user = await getUserByUid(decodedToken.uid);

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};

export const requireGDPRConsent = (req, res, next) => {
  if (!req.user?.consentedGDPR) {
    return res.status(403).json({ message: 'GDPR consent required' });
  }
  next();
};

export const requireProviderApproval = (req, res, next) => {
  if (req.user.role === 'provider' && req.user.status !== 'approved') {
    return res.status(403).json({ message: 'Provider approval pending' });
  }
  next();
}; 