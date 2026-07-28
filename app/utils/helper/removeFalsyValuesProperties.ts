/* eslint-disable @typescript-eslint/no-explicit-any */
export const removeFalsyValuesProperties = (
  selectedObject: any,
  propertiesName: string[]
) => {
  return Object.fromEntries(
    Object.entries(selectedObject)?.filter(([key, value]) => {
      return (
        !propertiesName.includes(key) ||
        (value !== "" && value !== 0 && value !== null)
      );
    })
  );
};