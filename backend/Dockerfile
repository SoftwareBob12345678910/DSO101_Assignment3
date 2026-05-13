# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files first (for layer caching)
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy all source files from backend directory
COPY backend/ .

# Expose the port from environment (default 5000)
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
