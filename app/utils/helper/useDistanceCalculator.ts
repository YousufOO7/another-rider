/* eslint-disable @typescript-eslint/no-explicit-any */
// app/hooks/useDistanceCalculator.ts
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getDistanceData } from "../storage";

export interface DistanceResult {
  distance: string;
  distanceValue: number;
  duration: string;
  durationValue: number;
  status: string;
}

/** Poll until Google Maps API is ready */
const waitForGoogleMaps = (): Promise<any> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(null);
    const g = (window as any).google;
    if (g?.maps?.DirectionsService) return resolve(g);

    let tries = 0;
    const MAX_TRIES = 100; // ~10s
    const interval = setInterval(() => {
      tries++;
      const gg = (window as any).google;
      if (gg?.maps?.DirectionsService) {
        clearInterval(interval);
        resolve(gg);
      } else if (tries >= MAX_TRIES) {
        clearInterval(interval);
        resolve(null);
      }
    }, 100);
  });
};

export const useDistanceCalculator = (savedDistance?: DistanceResult) => {
  const [distance, setDistance] = useState<DistanceResult | null>(() => {
    if (savedDistance) return savedDistance;
    const savedDistance2 = getDistanceData();
    return savedDistance2 || null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApiLoaded, setIsApiLoaded] = useState(false);

  const requestIdRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    waitForGoogleMaps().then((g) => {
      if (!cancelled) setIsApiLoaded(!!g);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (distance) {
      try {
        sessionStorage.setItem("distance", JSON.stringify(distance));
      } catch {}
    }
  }, [distance]);

  const calculateDistance = useCallback(
    async (origin: string, destination: string): Promise<DistanceResult | null> => {
      if (!origin || !destination) {
        setDistance(null);
        return null;
      }

      let google = (window as any).google;
      if (!google?.maps?.DirectionsService) {
        google = await waitForGoogleMaps();
      }
      if (!google?.maps?.DirectionsService) {
        setError("Google Maps API not loaded");
        return null;
      }
      if (!isApiLoaded) setIsApiLoaded(true);

      const myRequestId = ++requestIdRef.current;
      setLoading(true);
      setError(null);

      try {
        const directionsService = new google.maps.DirectionsService();

        const response = await directionsService.route({
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
        });

        // ignore stale responses
        if (myRequestId !== requestIdRef.current) return null;

        if (!response?.routes?.length) {
          setError("No route found");
          setDistance(null);
          return null;
        }

        const leg = response.routes[0].legs[0];

        const result: DistanceResult = {
          distance: leg.distance?.text ?? "",
          distanceValue: leg.distance?.value ?? 0,
          duration: leg.duration?.text ?? "",
          durationValue: leg.duration?.value ?? 0,
          status: "OK",
        };

        setDistance(result);
        return result;
      } catch (err: any) {
        console.error("[Distance] exception:", err);
        // Directions API returns status in err or in the response
        setError("Error calculating distance");
        setDistance(null);
        return null;
      } finally {
        if (myRequestId === requestIdRef.current) setLoading(false);
      }
    },
    [isApiLoaded]
  );

  return { distance, loading, error, calculateDistance, isApiLoaded };
};