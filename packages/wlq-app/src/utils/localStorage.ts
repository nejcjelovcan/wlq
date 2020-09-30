export const getItem = (key: string) => localStorage.getItem(key)

export const setItem = (key: string, value: string) =>
  localStorage.setItem(key, value)

export const getItemJson = (key: string) => {
  try {
    return JSON.parse(getItem(key)!)
  } catch (e) {
    return undefined
  }
}

export const setItemJson = (key: string, obj: { [key: string]: any }) =>
  setItem(key, JSON.stringify(obj))

export const clear = () => localStorage.clear()
