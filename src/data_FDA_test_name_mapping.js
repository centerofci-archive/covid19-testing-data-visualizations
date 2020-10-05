
/**
 * Not all tests parsed from the FDA EUA page:
 * https://www.fda.gov/medical-devices/coronavirus-disease-2019-covid-19-emergency-use-authorizations-medical-devices/vitro-diagnostics-euas
 * and the FDA reference panel page:
 * https://www.fda.gov/medical-devices/coronavirus-covid-19-and-medical-devices/sars-cov-2-reference-panel-comparative-data
 *
 * have the same name.  This maps one to the other.
 */

export const test_name_FDA_EUA_to_ref_panel_mapping = {
  "Abbott Real Time SARS-CoV-2 assay": "Abbott RealTime SARS-CoV-2 assay",
}

export const test_name_FDA_ref_panel_to_EUA_mapping = Object.keys(test_name_FDA_EUA_to_ref_panel_mapping)
  .reduce((accum, EUA_test_name) => {
    const ref_panel_test_name = test_name_FDA_EUA_to_ref_panel_mapping[EUA_test_name]

    if (accum[ref_panel_test_name])
    {
      console.error(`Already have ref_panel_test_name: ${ref_panel_test_name} with value: ${accum[ref_panel_test_name]}`)
    }
    else
    {
      accum[ref_panel_test_name] = EUA_test_name
    }

    return accum
  }, {})
