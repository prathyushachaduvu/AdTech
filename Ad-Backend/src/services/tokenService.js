const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const redisClient = require('../config/redis');

class TokenService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET;
    this.accessTokenExpiry = process.env.JWT_ACCESS_EXPIRY || '15m';
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';
    this.resetTokenExpiry = process.env.JWT_RESET_EXPIRY || '1h';
  }

  // Generate access token
  generateAccessToken(userId, email, role = 'user') {
    try {
      const payload = {
        userId,
        email,
        role,
        type: 'access',
        iat: Math.floor(Date.now() / 1000)
      };

      return jwt.sign(payload, this.jwtSecret, {
        expiresIn: this.accessTokenExpiry
      });
    } catch (error) {
      console.error('Error generating access token:', error);
      throw new Error('Failed to generate access token');
    }
  }

  // Generate refresh token
  async generateRefreshToken(userId) {
    try {
      const refreshToken = crypto.randomBytes(40).toString('hex');
      const payload = {
        userId,
        type: 'refresh',
        token: refreshToken,
        iat: Math.floor(Date.now() / 1000)
      };

      const signedToken = jwt.sign(payload, this.jwtSecret, {
        expiresIn: this.refreshTokenExpiry
      });

      // Store refresh token in Redis
      const key = `refresh_token:${userId}:${refreshToken}`;
      
      // Ensure Redis is connected
      if (!redisClient.isReady) {
        await redisClient.connect();
      }
      
      await redisClient.setEx(key, 7 * 24 * 60 * 60, 'valid'); // 7 days

      return signedToken;
    } catch (error) {
      console.error('Error generating refresh token:', error);
      throw new Error('Failed to generate refresh token');
    }
  }

  // Generate password reset token
  async generateResetToken(userId) {
    try {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const payload = {
        userId,
        type: 'reset',
        token: resetToken,
        iat: Math.floor(Date.now() / 1000)
      };

      const signedToken = jwt.sign(payload, this.jwtSecret, {
        expiresIn: this.resetTokenExpiry
      });

      // Store reset token in Redis
      const key = `reset_token:${userId}:${resetToken}`;
      
      // Ensure Redis is connected
      if (!redisClient.isReady) {
        await redisClient.connect();
      }
      
      await redisClient.setEx(key, 60 * 60, 'valid'); // 1 hour

      return signedToken;
    } catch (error) {
      console.error('Error generating reset token:', error);
      throw new Error('Failed to generate reset token');
    }
  }

  // Verify access token
  async verifyAccessToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      
      if (decoded.type !== 'access') {
        throw new Error('Invalid token type');
      }

      // Check if token is blacklisted
      const isBlacklisted = await this.isTokenBlacklisted(token);
      if (isBlacklisted) {
        throw new Error('Token is blacklisted');
      }

      return decoded;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Access token has expired');
      }
      throw new Error('Invalid access token');
    }
  }

  // Verify refresh token
  async verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      // Check if refresh token exists in Redis
      const key = `refresh_token:${decoded.userId}:${decoded.token}`;
      
      // Ensure Redis is connected
      if (!redisClient.isReady) {
        await redisClient.connect();
      }
      
      const exists = await redisClient.get(key);
      
      if (!exists) {
        throw new Error('Refresh token not found');
      }

      return decoded;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Refresh token has expired');
      }
      throw new Error('Invalid refresh token');
    }
  }

  // Verify reset token
  async verifyResetToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      
      if (decoded.type !== 'reset') {
        throw new Error('Invalid token type');
      }

      // Check if reset token exists in Redis
      const key = `reset_token:${decoded.userId}:${decoded.token}`;
      
      // Ensure Redis is connected
      if (!redisClient.isReady) {
        await redisClient.connect();
      }
      
      const exists = await redisClient.get(key);
      
      if (!exists) {
        throw new Error('Reset token not found or expired');
      }

      return decoded;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Reset token has expired');
      }
      throw new Error('Invalid reset token');
    }
  }

  // Blacklist token (for logout)
  async blacklistToken(token) {
    try {
      const decoded = jwt.decode(token);
      if (!decoded) {
        throw new Error('Invalid token');
      }

      // Calculate time until token expires
      const expiresAt = decoded.exp * 1000;
      const now = Date.now();
      const ttl = Math.max(0, Math.floor((expiresAt - now) / 1000));

      if (ttl > 0) {
        // Ensure Redis is connected
        if (!redisClient.isReady) {
          await redisClient.connect();
        }
        
        await redisClient.setEx(`blacklist:${token}`, ttl, 'blacklisted');
      }

      return true;
    } catch (error) {
      console.error('Error blacklisting token:', error);
      return false;
    }
  }

  // Check if token is blacklisted
  async isTokenBlacklisted(token) {
    try {
      // Ensure Redis is connected
      if (!redisClient.isReady) {
        await redisClient.connect();
      }
      
      const exists = await redisClient.get(`blacklist:${token}`);
      return !!exists;
    } catch (error) {
      console.error('Error checking token blacklist:', error);
      return false;
    }
  }

  // Invalidate refresh token
  async invalidateRefreshToken(userId, refreshToken) {
    try {
      const key = `refresh_token:${userId}:${refreshToken}`;
      
      // Ensure Redis is connected
      if (!redisClient.isReady) {
        await redisClient.connect();
      }
      
      await redisClient.del(key);
      return true;
    } catch (error) {
      console.error('Error invalidating refresh token:', error);
      return false;
    }
  }

  // Invalidate all refresh tokens for a user
  async invalidateAllRefreshTokens(userId) {
    try {
      const pattern = `refresh_token:${userId}:*`;
      
      // Ensure Redis is connected
      if (!redisClient.isReady) {
        await redisClient.connect();
      }
      
      const keys = await redisClient.keys(pattern);
      
      if (keys.length > 0) {
        await redisClient.del(...keys);
      }
      
      return keys.length;
    } catch (error) {
      console.error('Error invalidating all refresh tokens:', error);
      return 0;
    }
  }

  // Invalidate reset token
  async invalidateResetToken(userId, resetToken) {
    try {
      const key = `reset_token:${userId}:${resetToken}`;
      
      // Ensure Redis is connected
      if (!redisClient.isReady) {
        await redisClient.connect();
      }
      
      await redisClient.del(key);
      return true;
    } catch (error) {
      console.error('Error invalidating reset token:', error);
      return false;
    }
  }

  // Get token payload without verification (for debugging)
  decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      return null;
    }
  }

  // Generate token pair (access + refresh)
  async generateTokenPair(userId, email, role = 'user') {
    try {
      const accessToken = this.generateAccessToken(userId, email, role);
      const refreshToken = await this.generateRefreshToken(userId);

      return {
        accessToken,
        refreshToken,
        expiresIn: this.getTokenExpiry(this.accessTokenExpiry)
      };
    } catch (error) {
      console.error('Error generating token pair:', error);
      throw new Error('Failed to generate token pair');
    }
  }

  // Get token expiry in seconds
  getTokenExpiry(expiryString) {
    const units = {
      s: 1,
      m: 60,
      h: 60 * 60,
      d: 24 * 60 * 60
    };

    const match = expiryString.match(/^(\d+)([smhd])$/);
    if (match) {
      const [, value, unit] = match;
      return parseInt(value) * units[unit];
    }

    return 15 * 60; // Default 15 minutes
  }

  // Clean up expired tokens (cron job)
  async cleanupExpiredTokens() {
    try {
      // Redis automatically handles expiration for most keys
      // This method can be used for additional cleanup logic
      console.log('Token cleanup completed');
      return true;
    } catch (error) {
      console.error('Error cleaning up tokens:', error);
      return false;
    }
  }
}

module.exports = new TokenService(); 