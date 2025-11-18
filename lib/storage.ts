"use client"

const isBrowser = typeof window !== "undefined"

export function readJSONStorage<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback
  try {
    const value = window.localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : fallback
  } catch (error) {
    console.error(`[storage] Failed to read key "${key}"`, error)
    return fallback
  }
}

export function writeJSONStorage(key: string, value: unknown) {
  if (!isBrowser) return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`[storage] Failed to write key "${key}"`, error)
  }
}

export function removeStorageItem(key: string) {
  if (!isBrowser) return
  try {
    window.localStorage.removeItem(key)
  } catch (error) {
    console.error(`[storage] Failed to remove key "${key}"`, error)
  }
}
