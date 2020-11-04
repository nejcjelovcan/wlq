export class LocalStorageError extends Error {}

export const getItem = (key: string): string => {
  if (typeof window !== "undefined") {
    const value = localStorage.getItem(key);
    if (value === null)
      throw new LocalStorageError(`Could not find item '${key}'`);
    return value;
  }
  throw new LocalStorageError("No window");
};

export const setItem = (key: string, value: string) => {
  if (typeof window !== "undefined") return localStorage.setItem(key, value);
  throw new LocalStorageError("No window");
};

// export const getItemJson = (key: string) => {
//   try {
//     return JSON.parse(getItem(key)!);
//   } catch (e) {
//     return undefined;
//   }
// };

// export const setItemJson = (key: string, obj: { [key: string]: any }) =>
//   setItem(key, JSON.stringify(obj));

export const clear = () =>
  typeof window !== "undefined" ? localStorage.clear() : undefined;
