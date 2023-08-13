export function formatAvatarFallback(name: string): string {
  const splits = name.split(" ")

  if (splits.length >= 2) {
    return `${splits[0][0].toUpperCase()}${splits[1][0].toUpperCase()}`
  }

  return name[0].toUpperCase()
}

export function formatWithCommas(x: string | number | null) {
  if (!x) return ""

  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
