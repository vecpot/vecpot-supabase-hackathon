import NodeCache from "node-cache"

const globalCache = new NodeCache({
  stdTTL: 60 * 10,
  checkperiod: 600,
})

export function setCacheKey(key: string) {
  globalCache.set(key, true)
}

export function getCacheKey(key: string): boolean {
  const value = globalCache.get(key)

  if (value) {
    return true
  }
  return false
}
