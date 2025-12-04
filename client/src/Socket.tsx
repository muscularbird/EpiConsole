import { io } from 'socket.io-client';

// Use Vite-exposed env `VITE_BACKEND_URL`. Treat the literal string "undefined" or empty as missing.
const rawBackend = (import.meta.env.VITE_BACKEND_URL as string) ?? '';
const backendHost = (!rawBackend || rawBackend === 'undefined')
  ? (typeof window !== 'undefined' ? `${window.location.hostname}:5000` : 'localhost:5000')
  : rawBackend;
const URL = `http://${backendHost}`;

// Debug: show the resolved socket URL in the browser console (helpful during development)
if (typeof window !== 'undefined') console.log('[Socket] connecting to', URL);

export const socket = io(URL, {
  transports: ["websocket"], // force websocket, skip long-polling
});