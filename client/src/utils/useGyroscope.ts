import { useEffect, useRef, useState, useCallback } from 'react';

type GyroState = { alpha: number | null; beta: number | null; gamma: number | null };

export function useGyroscope() {
  const [reading, setReading] = useState<GyroState>({ alpha: null, beta: null, gamma: null });
  const sensorRef = useRef<any>(null);
  const fallbackHandlerRef = useRef<((e: DeviceOrientationEvent) => void) | null>(null);

  const isGenericSupported = typeof (globalThis as any).Gyroscope === 'function';
  const hasDeviceOrientation = typeof window !== 'undefined' && 'DeviceOrientationEvent' in window;

  const start = useCallback(async () => {
    // Generic Sensor API
    if (isGenericSupported) {
      try {
        const Gyroscope = (globalThis as any).Gyroscope;
        sensorRef.current = new Gyroscope({ frequency: 60 });
        sensorRef.current.addEventListener('reading', () => {
          // map as needed; Generic Gyroscope gives angular velocity
          setReading({
            alpha: sensorRef.current.x ?? null,
            beta: sensorRef.current.y ?? null,
            gamma: sensorRef.current.z ?? null,
          });
        });
        sensorRef.current.addEventListener('error', (ev: any) => {
          console.warn('Gyroscope error', ev);
        });
        await sensorRef.current.start();
        return true;
      } catch (err) {
        console.warn('Generic Gyroscope failed:', err);
      }
    }

    // iOS permission flow for DeviceOrientationEvent
    if (hasDeviceOrientation && (DeviceOrientationEvent as any).requestPermission) {
      try {
        // NOTE: this must be called from a user gesture (button click)
        const perm = await (DeviceOrientationEvent as any).requestPermission();
        if (perm !== 'granted') {
          return false;
        }
      } catch (err) {
        console.warn('DeviceOrientation.requestPermission error', err);
        return false;
      }
    }

    // Fallback: deviceorientation event
    if (hasDeviceOrientation) {
      const handler = (e: DeviceOrientationEvent) => {
        setReading({
          alpha: e.alpha ?? null,
          beta: e.beta ?? null,
          gamma: e.gamma ?? null,
        });
      };
      fallbackHandlerRef.current = handler;
      window.addEventListener('deviceorientation', handler, { passive: true });
      return true;
    }

    return false;
  }, [isGenericSupported, hasDeviceOrientation]);

  const stop = useCallback(() => {
    if (sensorRef.current) {
      try { sensorRef.current.stop(); } catch {}
      sensorRef.current = null;
    }
    if (fallbackHandlerRef.current) {
      window.removeEventListener('deviceorientation', fallbackHandlerRef.current);
      fallbackHandlerRef.current = null;
    }
    setReading({ alpha: null, beta: null, gamma: null });
  }, []);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return {
    reading,
    supported: isGenericSupported || hasDeviceOrientation,
    start,
    stop,
  };
}