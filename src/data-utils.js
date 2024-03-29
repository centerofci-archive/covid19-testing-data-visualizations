import { csv } from "d3-fetch"
import { timeFormat, timeParse } from "d3-time-format"

const sheetId = "1RLqXkzxKFItUN3abevxyXlvITqo0CpSKRgjW2o2o98M"
export const corsBase = "https://cors-anywhere.herokuapp.com/"
export const testUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?${[
  "format=csv",
  `gid=0`,
  `range=A2:Z`,
  `callback=googleDocCallback`
  ].join("&")}`
export const methodsUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?${[
  "format=csv",
  `gid=773065572`,
  `range=A2:Z`,
  `callback=googleDocCallback`
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
  sequences: {
    title: "Prevalence of Primer & Probe Sequences in SARS-CoV-2 Test EUAs",
    caption: `The prevalence of primer and probe sequences used in SARS-CoV-2 diagnostic tests given Emergency Use Authorizations (EUAs) by the FDA.  EUAs were categorised into one of three states: Explicitly Specified, Reference Available or Not Specified.  'Explicitly Specified' means the EUA or Instructions for Use (IFU) explicitly specified the sequence information for each primer / probe set including all the nucleotides and labeling 3 and 5 prime ends or providing other equivalent information.  'Reference Available' means the sequences referenced another resource or test's EUA where the sequence information could be found.  'Not Specified' includes test EUA where the information is incomplete or incorrect, i.e. the reference does not exist, in addition to including those EUAs which appeared not to contain primer / probe sequences.  <sup>*</sup> Does not include LDTs, which are used by 12% of the 100 laboratories in <a href="https://anot8.org/r/1772.2/1162?h=0">AMP's August survey</a>.  <sup>**</sup> CDC EUA does not include specific sequences or a <a href="https://www.cdc.gov/coronavirus/2019-ncov/lab/rt-pcr-panel-primer-probes.html">reference to them</a> but the sequences are widely known to be available.`,
  },
  lod_units: {
    title: "Limit of Detection (LOD) Units Used in SARS-CoV-2 Test EUAs",
    caption: `Units used to represent limit of detection (LOD) from SARS-CoV-2 diagnostic tests Emergency Use Authorizations (EUAs).  PFU: Plaque Forming Units.  "per volume": always referred to SI units of uL or mL.  TCID50: Median Tissue Culture Infectious Dose.  <sup>*</sup> Does not include LDTs, which are used by 12% of the 100 laboratories in <a href="https://anot8.org/r/1772.2/1162?h=0">AMP's August survey</a>.`,
  },
  viral_materials: {
    title: "Viral Materials Used for Limit of Detection (LOD) Studies in SARS-CoV-2 Test EUAs",
    caption: `Other categories with no examples as of this article were: Antigens and Chemically Inactivated Virus.  Analysis of use by top 10 tests showed approximately equal use of Naked RNA (19%), Synthetic Viral Particles (22%), Inactivated Virus (Method Unspecified) (26%) and Live Virus (33%).`
  },
}


export const grabCsv = async url => {
  try {
    const response = await csv(url)
    return response
  } catch(e) {
    try {
      console.log(`something went wrong with fetching from ${url}, trying with CORS base`, e)
      const response = await csv(corsBase + url)
      return response
    } catch(e) {
      console.log(`something went wrong with fetching from ${url}`, e)
    }
  }
}
