export const flatten = arr => (
  arr.reduce((a,b) => [...a, ...b])
)

export const getUrlParams = () => {
  const parts = window.location.search.slice(1).split("&")
  if (!parts) return
  let params = {}
  parts.forEach(part => {
    const [key, value] = part.split("=")
    if (!key) return
    params[key] = value
  })
  return params
}

export const getOrdinal = d => {
  const t = d % 10;
  return Math.floor((d % 100 / 10)) === 1 ? "th" :
    t === 1 ? "st" :
    t === 2 ? "nd" :
    t === 3 ? "rd" :
    "th"
}