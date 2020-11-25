<script>
  import Segment from "./PieChart/Segment.svelte"
  import Legend from "./PieChart/Legend.svelte"
  import {
    summarised_data,
    lod_viral_material,
  } from "./data_summarised"

  const width = 1000
  const height = 600

  const radius = 180

  const x = 170
  const x_chart = 180
  const x_legends = 240

  const y_titles = 50
  const y_titles_second_line = y_titles + 22
  const y_graphs = y_titles + 240
  const y_legends = -250
  const y_data_source = 220

</script>

<div>
  <svg {width} {height} class="top" overflow="scroll">
    <svg x={x}>

      <svg x={x_chart} y={y_graphs}>
        {#each lod_viral_material as { ratio, begin, color, label, percentage }}
          <Segment
            radius={radius}
            ratio={ratio}
            color={color}
            begin={begin}
          />
        {/each}

        {#each lod_viral_material as { color, label_w_percentage, refs }, i}
          <Legend text={label_w_percentage} color={color} x={x_legends} y={y_legends + i * 65} />
          <text
            x={x_legends + 30}
            y={y_legends + 33 + i * 65}
            class="references"
          >
            <a href={refs[0]}>Example in EUA</a>
          </text>
        {/each}

        <text class="data_source" y={y_data_source}>
          {@html `Data from ${summarised_data.lod_viral_material.have_parsed} EUAs`}
        </text>
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
    text-anchor: middle;
  }
  text.references {
    font-size: 0.62em;
    text-transform: none;
  }
  a {
    pointer-events: all;
    fill: rgb(0, 100, 200);
  }
  a:visited {
    fill: rgb(0, 80, 160);
  }
</style>
