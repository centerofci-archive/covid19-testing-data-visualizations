// import { get_color, viridis } from "./ColourMaps"


// This data is copied from https://github.com/centerofci/SARS-CoV-2-testing-kit-validation-data/blob/master/data/summarised_data/latest.json

export const summarised_data = {
  "_README": "This data is generated from https://github.com/centerofci/SARS-CoV-2-testing-kit-validation-data/blob/master/src/summarised_data/summarise.py",
  "primer_probe_sequences": {
    "have_parsed": 62,
    "not_parsed": 82,
    "explicitly_specified": 4,
    "not_specified": 41,
    "reference_available": 17
  },
  "sequence_data_in_top_10_test_EUAs": {
    "explicitly_specified": 0,
    "not_specified": 8,
    "reference_available": 1
  },
  "weighted_sequence_data_in_top_10_test_EUAs": {
    "explicitly_specified": 0,
    "not_specified": 65,
    "reference_available": 4
  }
}


function generate_data_for_display (categories, begin_offset = 0)
{
  let total = 0
  categories.forEach(({ label, value, color }) => {
    total += value
  })

  let running_total = 0
  return categories.map(({ label, value, color }) => {

    color = color || get_color(viridis, color_ratio)

    const ratio = value / total
    const label_w_percentage = label + `  (${(ratio * 100).toFixed(1)}%)`

    const data = {
      label,
      label_w_percentage,
      ratio,
      begin: running_total + begin_offset,
      color,
    }

    running_total += ratio

    return data
  })
}



// https://offeo.com/learn/20-pastel-spring-summer-color-palettes/
const COLOURS =
{
  powder_blue: "#DDF2F4",
  light_steel_blue: "#84A6D6",
  steel_blue: "#4382BB",
  thistle: "#E4CEE0",
  rosy_brown: "#A15D98",
}


export const primer_probe_sequences__specified = generate_data_for_display([
  {
    label: "Explicitly Specified",
    value: summarised_data.primer_probe_sequences.explicitly_specified,
    color: COLOURS.steel_blue,
  },
  {
    label: "Reference Available",
    value: summarised_data.primer_probe_sequences.reference_available,
    color: COLOURS.light_steel_blue,
  },
  {
    label: "Not Specified",
    value: summarised_data.primer_probe_sequences.not_specified,
    color: COLOURS.rosy_brown,
  },
], 0.24)


export const top_10_tests_sequences_specificed = generate_data_for_display([
  {
    label: `Explicitly Specified<tspan baseline-shift="super">*</tspan>`,
    value: summarised_data.sequence_data_in_top_10_test_EUAs.explicitly_specified,
    color: COLOURS.steel_blue,
  },
  {
    label: `Reference Available<tspan baseline-shift="super">**</tspan>`,
    value: summarised_data.sequence_data_in_top_10_test_EUAs.reference_available,
    color: COLOURS.light_steel_blue,
  },
  {
    label: "Not Specified",
    value: summarised_data.sequence_data_in_top_10_test_EUAs.not_specified,
    color: COLOURS.rosy_brown,
  },
], 0.24)


export const top_10_tests_sequences_specificed_weighted = generate_data_for_display([
  {
    label: `Explicitly Specified<tspan baseline-shift="super">*</tspan>`,
    value: summarised_data.weighted_sequence_data_in_top_10_test_EUAs.explicitly_specified,
    color: COLOURS.steel_blue,
  },
  {
    label: `Reference Available<tspan baseline-shift="super">**</tspan>`,
    value: summarised_data.weighted_sequence_data_in_top_10_test_EUAs.reference_available,
    color: COLOURS.light_steel_blue,
  },
  {
    label: "Not Specified",
    value: summarised_data.weighted_sequence_data_in_top_10_test_EUAs.not_specified,
    color: COLOURS.rosy_brown,
  },
], 0.24)
