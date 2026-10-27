const redisClient = require('../config/redis');
const jwt = require('jsonwebtoken');

class SessionManager {
  // Generate session token
  async createSession(userId, deviceInfo = {}) {
    try {
      const sessionId = `session:${userId}:${Date.now()}`;
      const sessionData = {
        userId,
        deviceInfo,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        isActive: true
      };

      // Ensure Redis is connected
      if (!redisClient.isReady) {
        await redisClient.connect();
      }

      // Store session in Redis with expiration (24 hours)
      await redisClient.setEx(sessionId, 24 * 60 * 60, JSON.stringify(sessionData));
      
      return sessionId;
    } catch (error) {
      console.error('Error creating session:', error);
      // Don't fail login if session creation fails
      return null;
    }
  }

  // Get session data
  async getSession(sessionId) {
    try {
      // Ensure Redis is connected
      if (!redisClient.isReady) {
        await redisClient.connect();
      }

      const sessionData = await redisClient.get(sessionId);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  // Update session activity
  async updateSessionActivity(sessionId) {
    try {
      const sessionData = await this.getSession(sessionId);
      if (sessionData) {
        sessionData.lastActivity = new Date().toISOString();
        
        // Ensure Redis is connected
        if (!redisClient.isReady) {
          await redisClient.connect();
        }
        
        await redisClient.setEx(sessionId, 24 * 60 * 60, JSON.stringify(sessionData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating session activity:', error);
      return false;
    }
  }

  // Invalidate session (logout)
  async invalidateSession(sessionId) {
    try {
      // Ensure Redis is connected
      if (!redisClient.isReady) {
        await redisClient.connect();
      }

      await redisClient.del(sessionId);
      return true;
    } catch (error) {
      console.error('Error invalidating session:', error);
      return false;
    }
  }

  // Get all active sessions for a user
  async getUserSessions(userId) {
    try {
      // Ensure Redis is connected
      if (!redisClient.isReady) {
        await redisClient.connect();
      }

      const pattern = `session:${userId}:*`;
      const sessionKeys = await redisClient.keys(pattern);
      const sessions = [];

      for (const key of sessionKeys) {
        const sessionData = await this.getSession(key);
        if (sessionData && sessionData.isActive) {
          sessions.push({
            sessionId: key,
            ...sessionData
          });
        }
      }

      return sessions;
    } catch (error) {
      console.error('Error getting user sessions:', error);
      return [];
    }
  }

  // Invalidate all sessions for a user (force logout from all devices)
  async invalidateAllUserSessions(userId) {
    try {
      const sessions = await this.getUserSessions(userId);
      for (const session of sessions) {
        await this.invalidateSession(session.sessionId);
      }
      return sessions.length;
    } catch (error) {
      console.error('Error invalidating all user sessions:', error);
      return 0;
    }
  }

  // Clean up expired sessions
  async cleanupExpiredSessions() {
    try {
      // Redis automatically handles expiration, but we can add custom cleanup logic here
      console.log('Session cleanup completed');
      return true;
    } catch (error) {
      console.error('Error cleaning up sessions:', error);
      return false;
    }
  }
}

// Middleware to track session activity
const trackSessionActivity = async (req, res, next) => {
  try {
    if (req.user && req.sessionId) {
      const sessionManager = new SessionManager();
      await sessionManager.updateSessionActivity(req.sessionId);
    }
    next();
  } catch (error) {
    console.error('Error tracking session activity:', error);
    next();
  }
};

// Middleware to extract device information
const extractDeviceInfo = (req, res, next) => {
  req.deviceInfo = {
    userAgent: req.get('User-Agent'),
    ip: req.ip || req.connection.remoteAddress,
    timestamp: new Date().toISOString()
  };
  next();
};

module.exports = {
  SessionManager,
  trackSessionActivity,
  extractDeviceInfo
}; 