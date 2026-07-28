/* eslint-disable @typescript-eslint/no-explicit-any */
// app/hooks/useDistanceCalculator.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { getDistanceData } from "../storage";

export interface DistanceResult {
  distance: string;
  distanceValue: number;
  duration: string;
  durationValue: number;
  status: string;
}

interface DistanceMatrixResponse {
  rows: Array<{
    elements: Array<{
      distance: { text: string; value: number };
      duration: { text: string; value: number };
      status: string;
    }>;
  }>;
}

export const useDistanceCalculator = (savedDistance?: DistanceResult) => {
  // Try to load previous distance from sessionStorage if no initialDistance
  const [distance, setDistance] = useState<DistanceResult | null>(() => {
    if (savedDistance) return savedDistance;
   const savedDistance2 = getDistanceData();
   return savedDistance2 || null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApiLoaded, setIsApiLoaded] = useState(false);

  // Check if Google Maps API is loaded
  useEffect(() => {
    const checkApiLoaded = () => {
      if (typeof window !== "undefined" && (window as any).google?.maps) {
        setIsApiLoaded(true);
      }
    };

    checkApiLoaded();
    window.addEventListener("load", checkApiLoaded);

    return () => window.removeEventListener("load", checkApiLoaded);
  }, []);

  // Save distance to sessionStorage whenever it updates
  useEffect(() => {
    if (distance) {
      sessionStorage.setItem("distance", JSON.stringify(distance));
    }
  }, [distance]);

  const calculateDistance = useCallback(
    async (origin: string, destination: string) => {
      if (!origin || !destination) {
        setDistance(null);
        return;
      }

      if (!isApiLoaded) {
        setError("Google Maps API not loaded");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const google = (window as any).google;
        const service = new google.maps.DistanceMatrixService();

        service.getDistanceMatrix(
          {
            origins: [origin],
            destinations: [destination],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
          },
          (response: DistanceMatrixResponse, status: string) => {
            setLoading(false);

            if (status === "OK" && response?.rows[0]?.elements[0]?.status === "OK") {
              const element = response.rows[0].elements[0];
              const result: DistanceResult = {
                distance: element.distance.text,
                distanceValue: element.distance.value,
                duration: element.duration.text,
                durationValue: element.duration.value,
                status: element.status,
              };
              setDistance(result);
            } else {
              console.error("DistanceMatrix failed", response?.rows[0]?.elements[0]?.status);
              setError("Could not calculate distance");
              setDistance(null);
            }
          }
        );
      } catch (err) {
        setLoading(false);
        setError("Error calculating distance");
        setDistance(null);
      }
    },
    [isApiLoaded]
  );

  return { distance, loading, error, calculateDistance, isApiLoaded };
};