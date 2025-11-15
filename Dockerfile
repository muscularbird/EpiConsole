# Dockerfile for building and running the fullstack application on Railway
# -------------------------------
# 1. Build Vite frontend
# -------------------------------
FROM node:20-alpine AS client-builder

WORKDIR /client
COPY client/package*.json ./
RUN npm install

ARG VITE_IP
COPY client .
RUN npm run build   # Produces /dist folder

FROM nginx:1.25-alpine

COPY --from=build-stage /app/dist/ /usr/share/nginx/html

# Optional: custom nginx config
# COPY nginx.conf /etc/nginx/conf.d/default.conf

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