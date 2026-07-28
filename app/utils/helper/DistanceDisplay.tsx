// app/components/DistanceDisplay.tsx
"use client";

import { FiNavigation } from 'react-icons/fi';

interface DistanceDisplayProps {
  distance: string;
  duration: string;
  loading?: boolean;
}

const DistanceDisplay = ({ distance, duration, loading }: DistanceDisplayProps) => {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
        Calculating distance...
      </div>
    );
  }

  if (!distance || !duration) return null;

  return (
    <div className="mt-2 flex items-center gap-4 rounded-lg border bg-gray-50 px-4 py-3">
      <div className="flex items-center gap-2">
        <FiNavigation className="text-gray-500" />
        <div>
          <p className="text-xs text-gray-500">Distance</p>
          <p className="font-semibold">{distance}</p>
        </div>
      </div>
      
      <div className="h-6 w-px bg-gray-300" />
      
      <div>
        <p className="text-xs text-gray-500">Estimated Time</p>
        <p className="font-semibold">{duration}</p>
      </div>
    </div>
  );
};

export default DistanceDisplay;