export const getItem = (key: string) =>
  typeof window !== "undefined" ? localStorage.getItem(key) : undefined;

export const setItem = (key: string, value: string) =>
  typeof window !== "undefined" ? localStorage.setItem(key, value) : undefined;

export const getItemJson = (key: string) => {
  try {
    return JSON.parse(getItem(key)!);
  } catch (e) {
    return undefined;
  }
};

export const setItemJson = (key: string, obj: { [key: string]: any }) =>
  setItem(key, JSON.stringify(obj));

export const clear = () =>
  typeof window !== "undefined" ? localStorage.clear() : undefined;
