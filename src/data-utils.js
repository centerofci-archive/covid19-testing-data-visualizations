import { timeFormat, timeParse } from "d3-time-format"

const sheetId = "1RLqXkzxKFItUN3abevxyXlvITqo0CpSKRgjW2o2o98M"
export const testUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?${[
  "format=csv",
  `gid=0`,
  `range=A2:Z`,
  ].join("&")}`
export const methodsUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?${[
  "format=csv",
  `gid=773065572`,
  `range=A2:Z`,
  ].join("&")}`
export const steps = [
  "Sampling",
  "Upstream Sample Processing",
  "Detection & Signal Amplification",
  "Readout",
]
export const ordinalLevels = ["low", "medium", "high"]

export const parseStep = (str, index) => {
  const lowerString = str.toLowerCase()
  const parts = lowerString
    .split(" (")[0]
    .split("?")[0]
    .split(/(?: and | or |,)+/g)
    .map(d => d.trim())
    .map(part => {
      if (index == 0) {
        if (part.includes("nasopharyngeal")) return "nasopharyngeal swab"
      } else if (index == 1) {
        if (part.includes("extraction")) return "rna extraction"
        if (part.includes("purification")) return "rna purification"
      } else if (index == 2) {
        if (part.includes("rt-pcr")) return "rt-pcr"
        if (part.includes("isothermal")) return "isothermal amplification"
      }
      return part
    })
  return [...new Set(parts)]
    .filter(d => d.trim().length > 0)
    .filter(d => !d.startsWith("but"))
}

export const parseDate = timeParse("%m/%d/%Y")
export const formatDate = timeFormat("%B %-d, %Y")