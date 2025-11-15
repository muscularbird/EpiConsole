# Dockerfile for building and running the fullstack application on Railway
# -------------------------------
# 1. Build Vite frontend
# -------------------------------
FROM node:20-alpine AS client-builder

WORKDIR /client
COPY client/package*.json ./
RUN npm install

COPY client .
RUN npm run build   # Produces /dist folder

# -------------------------------
# 2. Build Node backend
# -------------------------------
FROM node:20-alpine AS server

WORKDIR /app

# Copy backend package.json and install
COPY server/package*.json ./
RUN npm install

# Copy backend source
COPY server .

# Copy built frontend into backend's static folder
# We'll serve it via Express
COPY --from=client-builder /client/dist ./public

# Expose port (Railway sets PORT env variable)
EXPOSE 5000

# Start the backend
CMD ["node", "app.js"]