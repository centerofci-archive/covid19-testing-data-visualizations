<script>
  import Segment from "./PieChart/Segment.svelte"
  import Legend from "./PieChart/Legend.svelte"
  import {
    summarised_data,
    lod_units,
    lod_units_top_10_tests_weighted,
  } from "./data_summarised"

  const width = 1000
  const height = 600

  const radius = 140

  const x = 170
  const x_chart = 110
  const x_next = 520
  const x_center = x + (x_chart * 2 + x_next) / 2
  const x_percentages = 180

  const y_titles = 20
  const y_titles_second_line = y_titles + 22
  const y_graphs = y_titles + 180
  const y_percentages = -100
  const y_data_source = 180
  const y_legends = y_graphs + 240

  let selected_group = null;
  let selected_index = null;
  const mouse_move = (group, index) => () => {
    selected_group = group
    selected_index = index
  }
</script>

<div>
  <svg {width} {height} class="top" overflow="scroll">

    <svg x={x}>
      <text x={x_chart} y={y_titles} class="chart_title">LOD Units Used in All EUAs</text>

      <svg x={x_chart} y={y_graphs}>
        {#each lod_units as { ratio, begin, color, label, percentage }, i}
          <Segment
            highlighted={selected_group === "all" && selected_index === i}
            radius={radius}
            ratio={ratio}
            color={color}
            begin={begin}
            mouseenter={mouse_move("all", i)}
            mouseleave={mouse_move(null, null)}
          />
        {/each}

        {#each lod_units as { color, percentage }, i}
          <Legend
            highlighted={selected_group === "all" && selected_index === i}
            text={percentage}
            color={color}
            x={x_percentages}
            y={y_percentages + i * 50}
            mouseenter={mouse_move("all", i)}
            mouseleave={mouse_move(null, null)}
          />
        {/each}

        <text class="data_source" y={y_data_source}>
          {@html `Data from ${summarised_data.lod_units.have_parsed} EUAs`}
        </text>
      </svg>
    </svg>

    <svg x={x + x_next}>
      <text x={x_chart} y={y_titles} class="chart_title">LOD Units in EUAs of Top 10 Tests</text>
      <text x={x_chart} y={y_titles_second_line} class="chart_title">Used by US Labs Weighted by Usage<tspan baseline-shift="super">*</tspan></text>

      <svg x={x_chart} y={y_graphs}>
        {#each lod_units_top_10_tests_weighted as { ratio, begin, color, label, percentage }, i}
          <Segment
            highlighted={selected_group === "top" && selected_index === i}
            radius={radius}
            ratio={ratio}
            color={color}
            begin={begin}
            mouseenter={mouse_move("top", i)}
            mouseleave={mouse_move(null, null)}
          />
        {/each}

        {#each lod_units_top_10_tests_weighted as { color, percentage }, i}
          <Legend
            highlighted={selected_group === "top" && selected_index === i}
            text={percentage}
            color={color}
            x={x_percentages}
            y={y_percentages + i * 50}
            mouseenter={mouse_move("top", i)}
            mouseleave={mouse_move(null, null)}
          />
        {/each}

        <text class="data_source" y={y_data_source}>
          {@html `Data from EUAs of top 10 tests used by US labs.<tspan baseline-shift="super">*</tspan>`}
        </text>
      </svg>

    </svg>

    <svg x={x_center - 200} y={y_legends}>
    {#each lod_units.slice(0, 3) as { label, color }, i}
      <Legend
        highlighted={selected_index === i}
        text={label}
        color={color}
        y={i * 50}
      />
    {/each}
    </svg>

    <svg x={x_center + 100} y={y_legends}>
    {#each lod_units.slice(3) as { label, color }, i}
      <Legend
        highlighted={selected_index === (i + 3)}
        text={label}
        color={color}
        y={i * 50}
      />
    {/each}
    </svg>

  </svg>
</div>

<style>
  svg.top {
    /* overflow: scroll; */
    margin: 20px 100px;
  }
  svg {
    overflow: visible;
  }
  text {
    text-anchor: start;
    font-size: 0.8em;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: default;
  }
  text.data_source {
    font-size: 0.7em;
    text-anchor: middle;
  }
  text.chart_title {
    text-anchor: middle;
    font-size: 1em;
    text-transform: none;
    font-weight: bold;
  }
</style>
