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

export const getOrdinalLevel = str => {
  const index = ordinalLevels.indexOf(str.toLowerCase())
  return index == -1 ? null : index + 1
}

const nasopharyngealKeywords = [
  "nasopharyngeal swab",
  // "nasal",
  // "combined nasal",
  // "throat",
]
export const parseStep = (str, index) => {
  const lowerString = str.toLowerCase()
  const parts = lowerString
    .split(" (")[0]
    .split("?")[0]
    .split(/(?: and | or |,)+/g)
    .map(d => d.trim())
    .map(part => {
      if (index == 0) {
        if (nasopharyngealKeywords.filter(d => part.includes(d)).length) return "nasopharyngeal swab"
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

const minuteInTimeInterval = {
  mins: 1,
  min: 1,
  minutes: 1,
  minute: 1,
  hours: 60,
  hour: 60,
  day: 60 * 24,
  days: 60 * 24,
}
const sum = (arr=[]) => arr.reduce((a,b) => +a + +b, [])
const timeIntervals = Object.keys(minuteInTimeInterval)
export const parseTime = str => {
  if (!str) return []
  if (str == "?") return [null, null, "no information available"]
  const parts = str.replace(/>|</g, "").split(/\s|,|(-)/g).filter(d => d)
  let runningMinutes = [0]
  let numbers = []
  let isTo = false
  parts.forEach(part => {
    const isNumber = !part.replace(/\d|\./g, "").length
    if (isNumber) {
      numbers = isTo ? [...numbers, [+part]] : [
        ...numbers.slice(0, -1),
        [...(numbers[numbers.length - 1] || []), +part]
      ]
    } else if (part == "-") {
      isTo = true
    } else if (timeIntervals.includes(part)) {
      runningMinutes = isTo ? numbers.map((number, i) => (
        +(runningMinutes[i] || 0) + +sum(number.map(d => d * minuteInTimeInterval[part]))
      )) : [
        +(runningMinutes[0] || 0) + +sum((numbers[0] || [3]).map(d => d * minuteInTimeInterval[part]))
      ]
      numbers = []
      isTo = false
    }
  })
  if (!runningMinutes[1]) runningMinutes[1] = runningMinutes[0]
  return [
    ...runningMinutes,
    str,
  ]
}

export const parseLocation = str => {
  const lowerString = (str || "").toLowerCase()
  const parts = lowerString.split(/\(|\)|,/g)
  return lowerString.includes("centralized") ? ["centralized", parts[1]] :
    lowerString.includes("poc") ? ["poc", parts[1]] :
    [null, lowerString]
}

export const locationColors = {
  poc: "#A4C0BF",
  // centralized: "#BE9D9F",
  centralized: "#BAA0A5",
  "": "#CDCFD8",
}

const maxStringLength = 13
export const getNickname = str => {
  let abbr = str.split(/\(/g).slice(-1)[0].replace(/\)/g, "")
  if (abbr.length > maxStringLength) abbr = (
    abbr
      .split(/ |\,/g)[0]
      .slice(0, maxStringLength - 3)
      + "..."
  )
  return abbr
}

export const context = {
  steps: {
    title: "FDA COVID-19 EUA Test Explorer",
    caption: "The FDA has been issuing Emergency Use Authorizations (EUA) for COVID-19 infection diagnostic tests. In this explorer, we break down and explore each EUA test concerning the four steps of (1) sampling, (2) upstream processing (3) amplification and (4) readouts. For each method in a step, we denote the processing time, sensitivity, and the relative cost, along with a short description of the technique.",
  },
  table: {
    title: "FDA COVID-19 EUA Tests List",
    caption: "This table, sortable by the test name, processing time, cost, location, and approval date, lists  Emergency Use Authorizations (EUA) for COVID-19 infection diagnostic tests. ",
  },
  scatter: {
    title: "Scatter Plot of Relative Cost Versus Processing Time",
    caption: "Each test is plotted as a function of its relative cost and processing time. Scalability and sensitivity of each test, which are difficult to estimate and not shown here,  are two complex metrics influenced by the technique of sampling, transporting of specimen collections to centralized labs, and other factors. ",
  },
}