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
  const parts = lowerString.split(/(?:and|,)+/g).map(d => d.trim())
    .map(part => {
      if (index == 0) {
        if (str.includes("nasopharyngeal")) return "nasopharyngeal swab"
      } else if (index == 1) {
        if (str.includes("extraction")) return "rna extraction"
        if (str.includes("purification")) return "rna purification"
      } else if (index == 2) {
        if (str.includes("rt-pcr")) return "rt-pcr"
      }
      return part
    })
  return [...new Set(parts)]
}

export const parseDate = timeParse("%m/%d/%Y")
export const formatDate = timeFormat("%B %-d, %Y")