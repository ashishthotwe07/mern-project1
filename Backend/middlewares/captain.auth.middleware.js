import jwt from 'jsonwebtoken';
import BlacklistedToken from '../models/blacklistedToken.model.js';

/**
 * Middleware to check for valid captain authentication token
 */
const captAuthMiddleware = async (req, res, next) => {
  // Get token from cookies or authorization header
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  // If no token is provided, respond with a user-friendly message
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  try {
    // Check if the token is blacklisted
    const blacklistedToken = await BlacklistedToken.findOne({ token });
    if (blacklistedToken) {
      return res.status(401).json({ message: 'Your session has expired or is invalid.' });
    }

    // Verify the token with the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded captain information to the request object
    req.captain = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // Handle any errors related to invalid or expired tokens without exposing sensitive info
    return res.status(401).json({ message: 'Invalid or expired token, please log in again' });
  }
};

export default captAuthMiddleware;
