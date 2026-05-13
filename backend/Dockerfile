# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files first (for layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Expose the port from environment (default 5000)
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
