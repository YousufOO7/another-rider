// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useEffect, useRef } from "react";

// export const usePlacesAutocomplete = (
//   value: string,
//   onSelect: (address: string) => void
// ) => {
//   const inputRef = useRef<HTMLInputElement | null>(null);
//   const autocompleteRef = useRef<any>(null);

//   useEffect(() => {
//     if (!(window as any).google || !inputRef.current) return;

//     if (!autocompleteRef.current) {
//       autocompleteRef.current =
//         new (window as any).google.maps.places.Autocomplete(
//           inputRef.current,
//           { types: ["geocode"] }
//         );

//       autocompleteRef.current.addListener("place_changed", () => {
//         const place = autocompleteRef.current.getPlace();
//         if (place?.formatted_address) {
//           onSelect(place.formatted_address);
//         }
//       });
//     }
//   }, [onSelect]);

//   // 🔥 VERY IMPORTANT
//   useEffect(() => {
//     if (inputRef.current && inputRef.current.value !== value) {
//       inputRef.current.value = value;
//     }
//   }, [value]);

//   return inputRef;
// };

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef } from "react";

export const usePlacesAutocomplete = (
  value: string,
  onSelect: (address: string) => void
) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const autocompleteRef = useRef<any>(null);

  /*
   * Keep the latest onSelect callback.
   *
   * This prevents Google Autocomplete from holding
   * an old version of the callback if React rerenders.
   */
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  /*
   * Initialize Google Places Autocomplete
   */
  useEffect(() => {
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let removeListener: (() => void) | undefined;

    const initialize = () => {
      const google = (window as any).google;

      /*
       * Make sure:
       * 1. Google Maps is loaded
       * 2. Places library is loaded
       * 3. Input exists
       */
      if (
        !google?.maps?.places?.Autocomplete ||
        !inputRef.current
      ) {
        // The Maps script loads after hydration; extra-stop inputs also mount later.
        retryTimer = setTimeout(initialize, 100);
        return;
      }

      /*
       * Prevent creating autocomplete more than once.
       */
      if (autocompleteRef.current) {
        return;
      }

      /*
       * IMPORTANT:
       *
       * DO NOT use:
       *
       * types: ["geocode"]
       *
       * because that mainly targets geographic/address
       * results and can prevent hotels/businesses/POIs
       * from appearing properly.
       *
       * Leaving types unrestricted allows:
       *
       * - Hotels
       * - Airports
       * - Restaurants
       * - Businesses
       * - Landmarks
       * - Buildings
       * - Street addresses
       * - Other Google Places
       */
      const autocomplete =
        new google.maps.places.Autocomplete(
          inputRef.current,
          {
            fields: [
              "place_id",
              "name",
              "formatted_address",
              "geometry",
              "types",
            ],
          }
        );

      autocompleteRef.current = autocomplete;

      /*
       * Fired when user selects one of Google's suggestions.
       */
      const listener = autocomplete.addListener(
        "place_changed",
        () => {
          const place = autocomplete.getPlace();

          if (!place) {
            return;
          }

          const name = place.name?.trim() || "";
          const address = place.formatted_address?.trim() || "";
          const isNamedPlace = place.types?.some((type: string) =>
            ["establishment", "point_of_interest", "lodging"].includes(type)
          );

          // Keep hotel/business names while retaining the address for routing.
          // Street results already have a complete label in formatted_address.
          const addressIncludesName =
            address.toLocaleLowerCase() === name.toLocaleLowerCase() ||
            address.toLocaleLowerCase().startsWith(`${name.toLocaleLowerCase()},`);
          const label =
            isNamedPlace && name && address && !addressIncludesName
              ? `${name}, ${address}`
              : address || name;

          if (label) {
            onSelectRef.current(label);
          }
        }
      );

      removeListener = () => google.maps.event.removeListener(listener);
    };

    initialize();

    return () => {
      clearTimeout(retryTimer);
      removeListener?.();
      autocompleteRef.current = null;
    };
  }, []);

  /*
   * Sync external React state with Google's input.
   *
   * Google modifies the actual input when a suggestion
   * is selected, while your component also controls
   * the value through React state.
   */
  useEffect(() => {
    if (
      inputRef.current &&
      inputRef.current.value !== value
    ) {
      inputRef.current.value = value;
    }
  }, [value]);

  return inputRef;
};