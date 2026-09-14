// /* eslint-disable @typescript-eslint/no-explicit-any */
// // app/hooks/useDistanceCalculator.ts
// "use client";

// import { useState, useEffect, useCallback, useRef } from "react";
// import { getDistanceData } from "../storage";

// export interface DistanceResult {
//   distance: string;
//   distanceValue: number;
//   duration: string;
//   durationValue: number;
//   status: string;
// }

// /** Poll until Google Maps API is ready */
// const waitForGoogleMaps = (): Promise<any> => {
//   return new Promise((resolve) => {
//     if (typeof window === "undefined") return resolve(null);
//     const g = (window as any).google;
//     if (g?.maps?.DirectionsService) return resolve(g);

//     let tries = 0;
//     const MAX_TRIES = 100; // ~10s
//     const interval = setInterval(() => {
//       tries++;
//       const gg = (window as any).google;
//       if (gg?.maps?.DirectionsService) {
//         clearInterval(interval);
//         resolve(gg);
//       } else if (tries >= MAX_TRIES) {
//         clearInterval(interval);
//         resolve(null);
//       }
//     }, 100);
//   });
// };

// export const useDistanceCalculator = (savedDistance?: DistanceResult) => {
//   const [distance, setDistance] = useState<DistanceResult | null>(() => {
//     if (savedDistance) return savedDistance;
//     const savedDistance2 = getDistanceData();
//     return savedDistance2 || null;
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [isApiLoaded, setIsApiLoaded] = useState(false);

//   const requestIdRef = useRef(0);

//   useEffect(() => {
//     let cancelled = false;
//     waitForGoogleMaps().then((g) => {
//       if (!cancelled) setIsApiLoaded(!!g);
//     });
//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   useEffect(() => {
//     if (distance) {
//       try {
//         sessionStorage.setItem("distance", JSON.stringify(distance));
//       } catch {}
//     }
//   }, [distance]);

//   const calculateDistance = useCallback(
//     async (origin: string, destination: string): Promise<DistanceResult | null> => {
//       if (!origin || !destination) {
//         setDistance(null);
//         return null;
//       }

//       let google = (window as any).google;
//       if (!google?.maps?.DirectionsService) {
//         google = await waitForGoogleMaps();
//       }
//       if (!google?.maps?.DirectionsService) {
//         setError("Google Maps API not loaded");
//         return null;
//       }
//       if (!isApiLoaded) setIsApiLoaded(true);

//       const myRequestId = ++requestIdRef.current;
//       setLoading(true);
//       setError(null);

//       try {
//         const directionsService = new google.maps.DirectionsService();

//         const response = await directionsService.route({
//           origin,
//           destination,
//           travelMode: google.maps.TravelMode.DRIVING,
//         });

//         // ignore stale responses
//         if (myRequestId !== requestIdRef.current) return null;

//         if (!response?.routes?.length) {
//           setError("No route found");
//           setDistance(null);
//           return null;
//         }

//         const leg = response.routes[0].legs[0];

//         const result: DistanceResult = {
//           distance: leg.distance?.text ?? "",
//           distanceValue: leg.distance?.value ?? 0,
//           duration: leg.duration?.text ?? "",
//           durationValue: leg.duration?.value ?? 0,
//           status: "OK",
//         };

//         setDistance(result);
//         return result;
//       } catch (err: any) {
//         console.error("[Distance] exception:", err);
//         // Directions API returns status in err or in the response
//         setError("Error calculating distance");
//         setDistance(null);
//         return null;
//       } finally {
//         if (myRequestId === requestIdRef.current) setLoading(false);
//       }
//     },
//     [isApiLoaded]
//   );

//   return { distance, loading, error, calculateDistance, isApiLoaded };
// };

/* eslint-disable @typescript-eslint/no-explicit-any */
// app/hooks/useDistanceCalculator.ts
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getDistanceData } from "../storage";

export interface DistanceResult {
  distance: string;       // সবসময় km এ formatted, যেমন "8.5 km"
  distanceValue: number;  // meters (raw)
  duration: string;       // formatted, যেমন "38 mins"
  durationValue: number;  // seconds (raw)
  status: string;
}

/* ---------- Formatting helpers ---------- */

/**
 * Meters → "8.5 km" / "149 km" / "850 m"
 * সবসময় metric, locale নির্বিশেষে।
 */
export const formatDistanceKm = (meters: number): string => {
  if (!Number.isFinite(meters) || meters <= 0) return "0 km";

  // ১ কিমি এর কম হলে মিটারে দেখাও
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }

  const km = meters / 1000;

  // ১০ km এর বেশি হলে decimal ছাড়া, নাহলে ১ decimal
  if (km >= 10) return `${Math.round(km)} km`;
  return `${km.toFixed(1)} km`;
};

/**
 * Seconds → "38 mins" / "3 hours 3 mins" / "1 hour"
 */
export const formatDuration = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0 mins";

  const totalMins = Math.round(seconds / 60);
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;

  if (h > 0) {
    const hourLabel = h === 1 ? "hour" : "hours";
    return m > 0 ? `${h} ${hourLabel} ${m} mins` : `${h} ${hourLabel}`;
  }
  return `${m} mins`;
};

/* ---------- Google Maps loader ---------- */

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

/* ---------- Hook ---------- */

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
    async (
      origin: string,
      destination: string
    ): Promise<DistanceResult | null> => {
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

        // ✅ IMPORTANT: text ব্যবহার করছি না — value (meters/seconds) থেকে নিজে format করছি
        const meters = leg.distance?.value ?? 0;
        const seconds = leg.duration?.value ?? 0;

        const result: DistanceResult = {
          distance: formatDistanceKm(meters),   // সবসময় "X km" / "X m"
          distanceValue: meters,                // raw meters
          duration: formatDuration(seconds),    // সবসময় "X mins" / "X hours Y mins"
          durationValue: seconds,               // raw seconds
          status: "OK",
        };

        setDistance(result);
        return result;
      } catch (err: any) {
        console.error("[Distance] exception:", err);
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