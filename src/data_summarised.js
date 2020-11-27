import { get_color, viridis } from "./ColourMaps"


// This data is copied from https://github.com/centerofci/SARS-CoV-2-testing-kit-validation-data/blob/master/data/summarised_data/latest.json

export const summarised_data = {
  "_README": "This data is generated from https://github.com/centerofci/SARS-CoV-2-testing-kit-validation-data/blob/master/src/summarised_data/summarise.py",
  "primer_probe_sequences": {
    "have_parsed": 62,
    "not_parsed": 82,
    "explicitly_specified": 4,
    "reference_available": 18,
    "not_specified": 40
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
      "example_ref": null
    },
    "inactivated_virus_chemical": {
      "count": 0,
      "example_ref": null
    },
    "inactivated_virus_gamma_radiation": {
      "count": 4,
      "example_ref": "58?h=4"
    },
    "inactivated_virus_heat": {
      "count": 13,
      "example_ref": "49?h=3"
    },
    "inactivated_virus_method_unspecified": {
      "count": 6,
      "example_ref": "132?h=4"
    },
    "live_virus": {
      "count": 18,
      "example_ref": "53?h=4"
    },
    "naked_rna": {
      "count": 77,
      "example_ref": "84?h=3"
    },
    "partial_live_virus": {
      "count": 1,
      "example_ref": "63?h=3"
    },
    "synthetic_viral_particles": {
      "count": 21,
      "example_ref": "62?h=4"
    },
    "not_specified": {
      "count": 2,
      "example_ref": "90?h=1"
    }
  },
  "lod_viral_material_top_10_tests_weighted": {
    "have_parsed": 9,
    "not_parsed": 0,
    "antigens": {
      "count": 0,
      "example_ref": null
    },
    "inactivated_virus_chemical": {
      "count": 0,
      "example_ref": null
    },
    "inactivated_virus_gamma_radiation": {
      "count": 0,
      "example_ref": null
    },
    "inactivated_virus_heat": {
      "count": 0,
      "example_ref": null
    },
    "inactivated_virus_method_unspecified": {
      "count": 18,
      "example_ref": "74?h=3"
    },
    "live_virus": {
      "count": 23,
      "example_ref": "22?h=0"
    },
    "naked_rna": {
      "count": 13,
      "example_ref": "29?h=1"
    },
    "partial_live_virus": {
      "count": 0,
      "example_ref": null
    },
    "synthetic_viral_particles": {
      "count": 15,
      "example_ref": "18?h=10"
    },
    "not_specified": {
      "count": 0,
      "example_ref": null
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
    const refs_as_urls = refs
      .filter(ref => !!ref)
      .map(ref => "https://anot8.org/1772.2/" + ref)

    const data = {
      label,
      percentage,
      label_w_percentage,
      ratio,
      begin: running_total + begin_offset,
      color,
      refs: refs_as_urls,
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
    refs: [summarised_data.lod_viral_material.live_virus.example_ref],
    color: COLORS.steel_blue,
  },
  {
    label: "Partial Live Virus",
    value: summarised_data.lod_viral_material.partial_live_virus.count,
    refs: [summarised_data.lod_viral_material.partial_live_virus.example_ref],
    color: COLORS.light_steel_blue,
  },
  {
    label: "Synthetic Viral Particles",
    value: summarised_data.lod_viral_material.synthetic_viral_particles.count,
    refs: [summarised_data.lod_viral_material.synthetic_viral_particles.example_ref],
    color: COLORS.sky_blue,
  },
  {
    label: "Inactivated Virus (Gamma Radiation)",
    value: summarised_data.lod_viral_material.inactivated_virus_gamma_radiation.count,
    refs: [summarised_data.lod_viral_material.inactivated_virus_gamma_radiation.example_ref],
    color: COLORS.pale_turquoise,
  },
  {
    label: "Inactivated Virus (Heat)",
    value: summarised_data.lod_viral_material.inactivated_virus_heat.count,
    refs: [summarised_data.lod_viral_material.inactivated_virus_heat.example_ref],
    color: COLORS.powder_blue,
  },
  {
    label: "Inactivated Virus (Method Unspecified)",
    value: summarised_data.lod_viral_material.inactivated_virus_method_unspecified.count,
    refs: [summarised_data.lod_viral_material.inactivated_virus_method_unspecified.example_ref],
    color: COLORS.vanilla_ice,
  },
  {
    label: "Naked RNA",
    value: summarised_data.lod_viral_material.naked_rna.count,
    refs: [summarised_data.lod_viral_material.naked_rna.example_ref],
    color: COLORS.thistle,
  },
  {
    label: "Not Specified",
    value: summarised_data.lod_viral_material.not_specified.count,
    refs: [summarised_data.lod_viral_material.not_specified.example_ref],
    color: COLORS.rosy_brown,
  },
], 0.25)
