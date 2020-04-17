
export const flatten = arr => (
  arr.reduce((a,b) => [...a, ...b])
)