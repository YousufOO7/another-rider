/* eslint-disable @typescript-eslint/no-explicit-any */

export const setQuoteData = (data: any) => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem("priceQuoteData", JSON.stringify(data));
};

export const getQuoteData = () => {
  if (typeof window === "undefined") return null;

  const data = sessionStorage.getItem("priceQuoteData");
  return data ? JSON.parse(data) : null;
};

export const getDistanceData = () => {
  if (typeof window === "undefined") return null;

  const data = sessionStorage.getItem("distance");
  return data ? JSON.parse(data) : null;
};

export const clearQuoteData = () => {
  if (typeof window === "undefined") return;

  sessionStorage.removeItem("priceQuoteData");
  sessionStorage.removeItem("distance");
};