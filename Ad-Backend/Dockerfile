# Use Node.js 18 LTS
FROM node:18-alpine

# Install PostgreSQL client tools
RUN apk add --no-cache postgresql-client curl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/

# Create necessary directories for file uploads and backups
RUN mkdir -p /app/temp /app/uploads /app/uploads/banners /app/uploads/thumbnails /app/backups

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of app directory and upload directories
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "src/app.js"]

