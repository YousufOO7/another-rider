/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";

export const usePlacesAutocomplete = (
  value: string,
  onSelect: (address: string) => void
) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    if (!(window as any).google || !inputRef.current) return;

    if (!autocompleteRef.current) {
      autocompleteRef.current =
        new (window as any).google.maps.places.Autocomplete(
          inputRef.current,
          { types: ["geocode"] }
        );

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        if (place?.formatted_address) {
          onSelect(place.formatted_address);
        }
      });
    }
  }, [onSelect]);

  // 🔥 VERY IMPORTANT
  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== value) {
      inputRef.current.value = value;
    }
  }, [value]);

  return inputRef;
};