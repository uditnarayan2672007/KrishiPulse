import { supabaseAdmin } from './supabase.js';
import User from '../models/User.js';

/**
 * Verifies Supabase JWT access token from request Authorization header
 */
export async function authenticateUser(req) {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authenticated: false, error: 'Missing or malformed Authorization header' };
  }

  const token = authHeader.split(' ')[1];

  // If Supabase Admin is configured, verify cryptographically with Supabase
  if (supabaseAdmin) {
    try {
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
      if (error || !user) {
        return { authenticated: false, error: 'Invalid or expired authentication token' };
      }
      return {
        authenticated: true,
        user: {
          authUserId: user.id,
          email: user.email,
          fullName: user.user_metadata?.fullName || 'Agriculturalist',
        },
      };
    } catch (err) {
      return { authenticated: false, error: err.message };
    }
  }

  // Fallback demo/simulation mode token support
  if (token.startsWith('kp_demo_') || token === 'demo_token') {
    return {
      authenticated: true,
      user: {
        authUserId: 'demo-farmer-001',
        email: 'farmer@krishipulse.org',
        fullName: 'Ramesh Patel',
      },
      isDemo: true,
    };
  }

  return { authenticated: false, error: 'Authentication service unavailable' };
}
