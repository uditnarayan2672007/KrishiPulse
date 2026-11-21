import { connectToDatabase } from '../../lib/mongodb.js';
import { authenticateUser } from '../../lib/auth.js';
import User from '../../models/User.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const auth = await authenticateUser(req);
  if (!auth.authenticated) {
    return res.status(401).json({
      success: false,
      message: auth.error || 'Unauthorized access',
    });
  }

  const dbStatus = await connectToDatabase();
  if (!dbStatus.connected) {
    return res.status(200).json({
      success: true,
      user: {
        authUserId: auth.user.authUserId,
        fullName: auth.user.fullName,
        email: auth.user.email,
        role: 'FARMER',
      },
    });
  }

  try {
    const user = await User.findOne({ authUserId: auth.user.authUserId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile not found' });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error retrieving user',
      error: err.message,
    });
  }
}
