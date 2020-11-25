import { get_color, viridis } from "./ColourMaps"


// This data is copied from https://github.com/centerofci/SARS-CoV-2-testing-kit-validation-data/blob/master/data/summarised_data/latest.json

export const summarised_data = {
  "_README": "This data is generated from https://github.com/centerofci/SARS-CoV-2-testing-kit-validation-data/blob/master/src/summarised_data/summarise.py",
  "primer_probe_sequences": {
    "have_parsed": 62,
    "not_parsed": 82,
    "explicitly_specified": 4,
    "reference_available": 17,
    "not_specified": 41
  },
  "primer_probe_sequences_in_top_10_test_EUAs": {
    "explicitly_specified": 0,
    "not_specified": 8,
    "reference_available": 1
  },
  "weighted_primer_probe_sequences_in_top_10_test_EUAs": {
    "explicitly_specified": 0,
    "not_specified": 65,
    "reference_available": 4
  },
  "lod_units": {
    "have_parsed": 143,
    "not_parsed": 1,
    "genome_copies_per_vol": 124,
    "plaque_forming_units_pfu_per_vol": 2,
    "tcid50_per_vol": 9,
    "genome_copies_per_reaction": 7,
    "other": 1
  },
  "lod_units_top_10_tests_weighted": {
    "have_parsed": 9,
    "not_parsed": 0,
    "genome_copies_per_vol": 23,
    "plaque_forming_units_pfu_per_vol": 6,
    "tcid50_per_vol": 31,
    "genome_copies_per_reaction": 9,
    "other": 0
  },
  "lod_viral_material": {
    "have_parsed": 142,
    "not_parsed": 2,
    "antigens": {
      "count": 0,
      "example_refs": []
    },
    "inactivated_virus_chemical": {
      "count": 0,
      "example_refs": []
    },
    "inactivated_virus_gamma_radiation": {
      "count": 4,
      "example_refs": [
        "114?h=4",
        "39?h=2",
        "96?h=2"
      ]
    },
    "inactivated_virus_heat": {
      "count": 13,
      "example_refs": [
        "79?h=3",
        "6?h=1",
        "83?h=6"
      ]
    },
    "inactivated_virus_method_unspecified": {
      "count": 6,
      "example_refs": [
        "97?h=1",
        "136?h=3",
        "121?h=2"
      ]
    },
    "live_virus": {
      "count": 17,
      "example_refs": [
        "140?h=7",
        "43?h=8",
        "22?h=0"
      ]
    },
    "naked_rna": {
      "count": 77,
      "example_refs": [
        "134?h=0",
        "77?h=7",
        "29?h=1"
      ]
    },
    "partial_live_virus": {
      "count": 1,
      "example_refs": [
        "63?h=3"
      ]
    },
    "synthetic_viral_particles": {
      "count": 21,
      "example_refs": [
        "85?h=1",
        "3?h=2",
        "93?h=3"
      ]
    },
    "not_specified": {
      "count": 3,
      "example_refs": [
        "82?h=12",
        "276?h=1",
        "90?h=1"
      ]
    }
  }
}


function generate_data_for_display (categories, begin_offset = 0)
{
  let total = 0
  categories.forEach(({ label, value, color }) => {
    if (!Number.isFinite(value))
    {
      console.error(`Got non-number as value: ${value}`)
      return
    }
    total += value
  })

  let running_total = 0
  return categories.map(({ label, value, color, refs = [] }, i) => {
    const ratio = value / total

    const percentage = `${(ratio * 100).toFixed(1)}%`
    const label_w_percentage = label + `  (${percentage})`

    const data = {
      label,
      percentage,
      label_w_percentage,
      ratio,
      begin: running_total + begin_offset,
      color,
      refs: refs.map(ref => "https://anot8.org/1772.2/" + ref),
    }

    running_total += ratio

    return data
  })
}



// https://offeo.com/learn/20-pastel-spring-summer-color-palettes/
const COLORS =
{
  steel_blue: "#4382BB",
  light_steel_blue: "#84A6D6",
  sky_blue: "#9AC8EB",
  pale_turquoise: "#B6D8F2",
  powder_blue: "#DDF2F4",
  vanilla_ice: "#F5E2E4",
  thistle: "#E4CEE0",
  rosy_brown: "#A15D98",
}


export const primer_probe_sequences__specified = generate_data_for_display([
  {
    label: "Explicitly Specified",
    value: summarised_data.primer_probe_sequences.explicitly_specified,
    color: COLORS.steel_blue,
  },
  {
    label: "Reference Available",
    value: summarised_data.primer_probe_sequences.reference_available,
    color: COLORS.light_steel_blue,
  },
  {
    label: "Not Specified",
    value: summarised_data.primer_probe_sequences.not_specified,
    color: COLORS.rosy_brown,
  },
], 0.24)


export const top_10_tests_sequences_specificed = generate_data_for_display([
  {
    label: `Explicitly Specified<tspan baseline-shift="super">*</tspan>`,
    value: summarised_data.primer_probe_sequences_in_top_10_test_EUAs.explicitly_specified,
    color: COLORS.steel_blue,
  },
  {
    label: `Reference Available<tspan baseline-shift="super">**</tspan>`,
    value: summarised_data.primer_probe_sequences_in_top_10_test_EUAs.reference_available,
    color: COLORS.light_steel_blue,
  },
  {
    label: "Not Specified",
    value: summarised_data.primer_probe_sequences_in_top_10_test_EUAs.not_specified,
    color: COLORS.rosy_brown,
  },
], 0.24)


export const top_10_tests_sequences_specificed_weighted = generate_data_for_display([
  {
    label: `Explicitly Specified<tspan baseline-shift="super">*</tspan>`,
    value: summarised_data.weighted_primer_probe_sequences_in_top_10_test_EUAs.explicitly_specified,
    color: COLORS.steel_blue,
  },
  {
    label: `Reference Available<tspan baseline-shift="super">**</tspan>`,
    value: summarised_data.weighted_primer_probe_sequences_in_top_10_test_EUAs.reference_available,
    color: COLORS.light_steel_blue,
  },
  {
    label: "Not Specified",
    value: summarised_data.weighted_primer_probe_sequences_in_top_10_test_EUAs.not_specified,
    color: COLORS.rosy_brown,
  },
], 0.24)


export const lod_units = generate_data_for_display([
  {
    label: `Genome copies per volume`,
    value: summarised_data.lod_units.genome_copies_per_vol,
    color: COLORS.steel_blue,
  },
  {
    label: `PFU per volume`,
    value: summarised_data.lod_units.plaque_forming_units_pfu_per_vol,
    color: COLORS.light_steel_blue,
  },
  {
    label: "Genome copies per reaction",
    value: summarised_data.lod_units.genome_copies_per_reaction,
    color: COLORS.thistle,
  },
  {
    label: "TCID50 per volume",
    value: summarised_data.lod_units.tcid50_per_vol,
    color: COLORS.rosy_brown,
  },
  {
    label: "Other",
    value: summarised_data.lod_units.other,
    color: COLORS.powder_blue,
  },
], 0.25)


export const lod_units_top_10_tests_weighted = generate_data_for_display([
  {
    label: `Genome copies per volume`,
    value: summarised_data.lod_units_top_10_tests_weighted.genome_copies_per_vol,
    color: COLORS.steel_blue,
  },
  {
    label: `PFU per volume`,
    value: summarised_data.lod_units_top_10_tests_weighted.plaque_forming_units_pfu_per_vol,
    color: COLORS.light_steel_blue,
  },
  {
    label: "Genome copies per reaction",
    value: summarised_data.lod_units_top_10_tests_weighted.genome_copies_per_reaction,
    color: COLORS.thistle,
  },
  {
    label: "TCID50 per volume",
    value: summarised_data.lod_units_top_10_tests_weighted.tcid50_per_vol,
    color: COLORS.rosy_brown,
  },
  {
    label: "Other",
    value: summarised_data.lod_units_top_10_tests_weighted.other,
    color: COLORS.powder_blue,
  },
], 0.25)


export const lod_viral_material = generate_data_for_display([
  {
    label: "Live Virus",
    value: summarised_data.lod_viral_material.live_virus.count,
    refs: summarised_data.lod_viral_material.live_virus.example_refs,
    color: COLORS.steel_blue,
  },
  {
    label: "Partial Live Virus",
    value: summarised_data.lod_viral_material.partial_live_virus.count,
    refs: summarised_data.lod_viral_material.partial_live_virus.example_refs,
    color: COLORS.light_steel_blue,
  },
  {
    label: "Synthetic Viral Particles",
    value: summarised_data.lod_viral_material.synthetic_viral_particles.count,
    refs: summarised_data.lod_viral_material.synthetic_viral_particles.example_refs,
    color: COLORS.sky_blue,
  },
  {
    label: "Inactivated Virus (Gamma Radiation)",
    value: summarised_data.lod_viral_material.inactivated_virus_gamma_radiation.count,
    refs: summarised_data.lod_viral_material.inactivated_virus_gamma_radiation.example_refs,
    color: COLORS.pale_turquoise,
  },
  {
    label: "Inactivated Virus (Heat)",
    value: summarised_data.lod_viral_material.inactivated_virus_heat.count,
    refs: summarised_data.lod_viral_material.inactivated_virus_heat.example_refs,
    color: COLORS.powder_blue,
  },
  {
    label: "Inactivated Virus (Method Unspecified)",
    value: summarised_data.lod_viral_material.inactivated_virus_method_unspecified.count,
    refs: summarised_data.lod_viral_material.inactivated_virus_method_unspecified.example_refs,
    color: COLORS.vanilla_ice,
  },
  {
    label: "Naked RNA",
    value: summarised_data.lod_viral_material.naked_rna.count,
    refs: summarised_data.lod_viral_material.naked_rna.example_refs,
    color: COLORS.thistle,
  },
  {
    label: "Not Specified",
    value: summarised_data.lod_viral_material.not_specified.count,
    refs: summarised_data.lod_viral_material.not_specified.example_refs,
    color: COLORS.rosy_brown,
  },
], 0.25)
