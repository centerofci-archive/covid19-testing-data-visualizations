import { FDA_reference_panel_LoD_data } from "./data_FDA_reference_panel_LoD"
import { FDA_EUAs_data } from "./data_FDA_EUAs"
import { test_name_FDA_ref_panel_to_EUA_mapping } from "./data_FDA_test_name_mapping"


function filter_FDA_LoD (data)
{
  return data
    .slice(1)
    .filter(row => !!row[3])
}

function transform_FDA_LoD (data)
{
  return data.map(row => ({
    developer_name: row[0],
    test_name: row[1],
    results_status: row[2],
    LoD: parseFloat(row[3]),
    sample_media_type: row[4],
  }))
}

const processed_FDA_reference_panel_LoD_data = transform_FDA_LoD(filter_FDA_LoD(FDA_reference_panel_LoD_data))

//

const FDA_EUAs_data_by_name = FDA_EUAs_data.reduce((accum, test) =>
  {
    if (accum[test.test_name])
    {
      console.error(`Already have test named: ${test.test_name}.  Overwriting: `, accum[test.test_name], ` with: `, test)
    }

    accum[test.test_name] = test
    return accum
  }, {})

//

const combined_data = processed_FDA_reference_panel_LoD_data.map(d => {
  let test_EUA_data = FDA_EUAs_data_by_name[d.test_name]

  if (!test_EUA_data)
  {
    const mapped_name = test_name_FDA_ref_panel_to_EUA_mapping[d.test_name]
    test_EUA_data = FDA_EUAs_data_by_name[mapped_name]
  }

  if (!test_EUA_data)
  {
    console.error(`No test named: "${d.test_name}" from "${d.developer_name}" in FDA_EUAs_data_by_name (window.FDA_EUAs_data_by_name)`)
    return false
  }

  // Note:  * 1000 to do conversion from per uL to per mL
  const own_LoD_min = test_EUA_data.lod_min * 1000
  const own_LoD_max = test_EUA_data.lod_max * 1000

  const y_min = Math.log(own_LoD_min)
  const y_max = Math.log(own_LoD_max)

  return {
    developer_name: d.developer_name,
    test_name: d.test_name,
    results_status: d.results_status,
    ref_panel_LoD: d.LoD,
    own_LoD_min,
    own_LoD_max,
    min_max_diff: own_LoD_min !== own_LoD_max,
    x: Math.log(d.LoD),
    y_min,
    y_max,
    sample_media_type: d.sample_media_type,
  }
})
.filter(d => !!d)

let min_x = Number.MAX_SAFE_INTEGER
let max_x = Number.MIN_SAFE_INTEGER
let min_y = Number.MAX_SAFE_INTEGER
let max_y = Number.MIN_SAFE_INTEGER

combined_data.forEach(d => {
  min_x = Math.min(d.x, min_x)
  max_x = Math.max(d.x, max_x)
  min_y = Math.min(d.y_min, min_y)
  max_y = Math.max(d.y_max, max_y)
})

const min_x_tidy = Math.floor(min_x)
const max_x_tidy = Math.ceil(max_x)
const min_y_tidy = Math.floor(min_y)
const max_y_tidy = Math.ceil(max_y)

export {
  combined_data,
  min_x_tidy,
  max_x_tidy,
  min_y_tidy,
  max_y_tidy,
}