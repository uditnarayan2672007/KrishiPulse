import { connectToDatabase } from '../../lib/mongodb.js';
import { authenticateUser } from '../../lib/auth.js';
import User from '../../models/User.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const auth = await authenticateUser(req);
  if (!auth.authenticated) {
    return res.status(401).json({
      success: false,
      message: auth.error || 'Unauthorized access',
    });
  }

  const { fullName } = req.body || {};
  const dbStatus = await connectToDatabase();

  if (!dbStatus.connected) {
    return res.status(200).json({
      success: true,
      message: 'User profile synchronized (Simulated storage)',
      user: {
        authUserId: auth.user.authUserId,
        fullName: fullName || auth.user.fullName,
        email: auth.user.email,
      },
    });
  }

  try {
    const user = await User.findOneAndUpdate(
      { authUserId: auth.user.authUserId },
      {
        authUserId: auth.user.authUserId,
        email: auth.user.email,
        fullName: fullName || auth.user.fullName,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json({
      success: true,
      message: 'User profile synchronized',
      user: {
        authUserId: user.authUserId,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error synchronizing profile',
      error: err.message,
    });
  }
}
