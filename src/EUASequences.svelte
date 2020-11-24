<script>
  import Segment from "./PieChart/Segment.svelte"
  import Legend from "./PieChart/Legend.svelte"
  import {
    summarised_data,
    primer_probe_sequences__specified,
    top_10_tests_sequences_specificed,
    top_10_tests_sequences_specificed_weighted,
  } from "./data_summarised"

  const width = 1000
  const height = 600

  const x = 140
  const x_chart = 110
  const x_next = 375

  const y_titles = 20
  const y_titles_second_line = y_titles + 22
  const y_graphs = y_titles + 180
  const y_legends = y_graphs + 200

  const radius = 140

</script>

<div>
  <svg {width} {height} class="top" overflow="scroll">

    <svg x={x}>
      <text x={x_chart} y={y_titles} class="chart_title">All EUAs</text>

      <svg x={x_chart} y={y_graphs}>
        <circle r="{radius}" cx="0" cy="0" fill="white" />
        {#each primer_probe_sequences__specified as { ratio, begin, color }}
          <Segment radius={radius} ratio={ratio} color={color} begin={begin} />
        {/each}
      </svg>

      <svg y={y_legends}>
      {#each primer_probe_sequences__specified as { label_w_percentage, color }, i}
        <Legend text={label_w_percentage} color={color} y={i * 50} />
      {/each}

        <text class="data_source" x={0} y={150}>
          {`Data from ${summarised_data.primer_probe_sequences.have_parsed} EUAs`}
        </text>
      </svg>
    </svg>


    <text x={x + (x_next * 3 + x_chart * 2) / 2} y={y_titles} class="chart_title">EUAs Of Top 10 Tests Used By US Labs<tspan baseline-shift="super">*</tspan></text>

    <svg x={x + x_next}>
      <text x={x_chart} y={y_titles_second_line} class="chart_title">Percentage</text>

      <svg x={x_chart} y={y_graphs}>
        <circle r="{radius}" cx="0" cy="0" fill="white" />
        {#each top_10_tests_sequences_specificed as { ratio, begin, color }}
          <Segment radius={radius} ratio={ratio} color={color} begin={begin} />
        {/each}
      </svg>

      <svg y={y_legends}>
      {#each top_10_tests_sequences_specificed as { label_w_percentage, color }, i}
        <Legend text={label_w_percentage} color={color} y={i * 50} />
      {/each}
        <text class="data_source" x={0} y={150}>
          {@html `Data from EUAs of top 10 tests used by labs.<tspan baseline-shift="super">*</tspan>`}
        </text>
      </svg>
    </svg>


    <svg x={x + x_next * 2}>
      <text x={x_chart} y={y_titles_second_line} class="chart_title">Percentage Weighted By Number Of Labs</text>

      <svg x={x_chart} y={y_graphs}>
        <circle r="{radius}" cx="0" cy="0" fill="white" />
        {#each top_10_tests_sequences_specificed_weighted as { ratio, begin, color }}
          <Segment radius={radius} ratio={ratio} color={color} begin={begin} />
        {/each}
      </svg>

      <svg y={y_legends}>
      {#each top_10_tests_sequences_specificed_weighted as { label_w_percentage, color }, i}
        <Legend text={label_w_percentage} color={color} y={i * 50} />
      {/each}
      </svg>
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
    pointer-events: none;
  }
  text.data_source {
    font-size: 0.7em;
  }
  text.chart_title {
    text-anchor: middle;
    font-size: 1em;
    text-transform: none;
    font-weight: bold;
  }
</style>
