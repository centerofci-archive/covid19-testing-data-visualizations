<script>
  import { flip } from "svelte/animate"
  import { scaleLinear } from "d3-scale"
  import { extent } from "d3-array"

	import Icon from "./Icon.svelte"
  import { steps, ordinalLevels } from "./data-utils"
  import { compute_intercept_with_bounding_rect, scale_line } from "./graph_lines"
  import {
    combined_data,
    min_x_tidy,
    max_x_tidy,
    min_y_tidy,
    max_y_tidy,
  } from "./data"

  const width = 800
  const height = 400

  const min = Math.min(min_x_tidy, min_y_tidy)
  const max = Math.max(max_x_tidy, max_y_tidy)

  const same_scale = true
  const min_x = same_scale ? min : min_x_tidy
  const max_x = same_scale ? max : max_x_tidy
  const min_y = same_scale ? min : min_y_tidy
  const max_y = same_scale ? max : max_y_tidy

  const x_scale = scaleLinear()
    .domain([min_x, max_x])
    .range([0, width])

  const y_scale = scaleLinear()
    .domain([min_y, max_y])
    .range([height, 0])

  const scaled_test_data = combined_data.map(d => ({
    ...d,
    x: x_scale(d.x),
    y_min: y_scale(d.y_min),
    y_max: y_scale(d.y_max),
  }))

  const x_range_3 = Math.round((max_x - min_x) / 3)
  const x_ticks = [
    [min_x.toString(), x_scale(min_x)],
    [(min_x + x_range_3).toString(), x_scale(min_x + x_range_3)],
    [(min_x + x_range_3 * 2).toString(), x_scale(min_x + x_range_3 * 2)],
    [max_x.toString(), x_scale(max_x)],
  ]

  const y_range_3 = Math.round((max_y - min_y) / 3)
  const y_ticks = [
    [min_y.toString(), y_scale(min_y)],
    [(min_y + y_range_3).toString(), y_scale(min_y + y_range_3)],
    [(min_y + y_range_3 * 2).toString(), y_scale(min_y + y_range_3 * 2)],
    [max_y.toString(), y_scale(max_y)],
  ]

  let equivalence_line = compute_intercept_with_bounding_rect(0, min_x, max_x, min_y, max_y)
  if (equivalence_line) equivalence_line = scale_line(equivalence_line, x_scale, y_scale)

  const margin = 4
  let under_report_sensitivity_line = compute_intercept_with_bounding_rect(margin, min_x, max_x, min_y, max_y)
  if (under_report_sensitivity_line)
  {
    under_report_sensitivity_line = scale_line(under_report_sensitivity_line, x_scale, y_scale)
  }

  let over_report_sensitivity_line = compute_intercept_with_bounding_rect(-margin, min_x, max_x, min_y, max_y)
  if (over_report_sensitivity_line)
  {
    over_report_sensitivity_line = scale_line(over_report_sensitivity_line, x_scale, y_scale)
  }

  let hoveredPoint = null

  function display_lod (lod)
  {
    return parseFloat(lod.toPrecision(3))
  }

</script>

<div>
  <svg {width} {height}>
    {#each y_ticks as [tick, y]}
      <text
        class="y-tick"
        x={-16}
        y={y + 5}
      >
        { tick }
      </text>
      <line
        class="tick-line"
        x1={-6}
        x2={0}
        y1={y}
        y2={y}
      />
    {/each}

    {#each x_ticks as [tick, x]}
      <text
        class="x-tick"
        x={x}
        y={height + 25}
      >
        { tick }
      </text>
      <line
        class="tick-line"
        x1={x}
        x2={x}
        y1={height}
        y2={height + 6}
      />
    {/each}

    {#each scaled_test_data as test}
      <circle
        class="test"
        cx={test.x}
        cy={test.y_min}
        r={5}
        fill={"rgba(200, 50, 255, 0.8)"}
        on:mouseenter={() => hoveredPoint = test}
        on:mouseleave={() => hoveredPoint = null}
      />
    {/each}

    {#if equivalence_line}
      <line
        class="equivalence-line"
        x1={equivalence_line.x1}
        y1={equivalence_line.y1}
        x2={equivalence_line.x2}
        y2={equivalence_line.y2}
      />
    {/if}

    {#if under_report_sensitivity_line}
      <line
        class="equivalence-line"
        x1={under_report_sensitivity_line.x1}
        y1={under_report_sensitivity_line.y1}
        x2={under_report_sensitivity_line.x2}
        y2={under_report_sensitivity_line.y2}
      />
    {/if}

    {#if over_report_sensitivity_line}
      <line
        class="equivalence-line"
        x1={over_report_sensitivity_line.x1}
        y1={over_report_sensitivity_line.y1}
        x2={over_report_sensitivity_line.x2}
        y2={over_report_sensitivity_line.y2}
      />
    {/if}

    <defs>
      <linearGradient id="Gradient1" x1="0.5" x2="1" y1="0.5" y2="1" gradientTransform="rotate(0)">
        <stop class="stop1" offset="0%"/>
        <stop class="stop2" offset="50%"/>
        <stop class="stop3" offset="100%"/>
      </linearGradient>
    </defs>

    <polygon id="polygon" points={`0,${height} ${width},0 ${width},${height} 0,${height}`}></polygon>

    <!-- <rect id="rect1" x="10" y={height} width={width} height={height/2} transform="rotate(-35)"/> -->
  </svg>

  {#if hoveredPoint}
    <div class="tooltip" style={`transform: translate(calc(${
      Math.min(
        width - 120,
        Math.max(
          120,
          hoveredPoint.x,
        )
      )
    }px - 50%), calc(${
      hoveredPoint.y_max
    }px + ${
      hoveredPoint.y_max < 200 ? "2em" : "2em"
    }))`}>
      <h3 class="tooltip-name">
        { hoveredPoint.test_name }
      </h3>
      <div class="summary">
        { hoveredPoint.developer_name }
      </div>

      <h6>Limit of Detection</h6>
      <div class="date">
        <table>
          <thead>
            <tr>
              <th>Reference material</th>
              <th>Value</th>
              <th>Units</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>FDA reference panel</td>
              <td>{display_lod(hoveredPoint.ref_panel_LoD)}</td>
              <td>NDU / mL</td>
            </tr>
            <tr>
              <td></td>
              <td>{display_lod(hoveredPoint.own_LoD_min)}{hoveredPoint.min_max_diff ? " (min)" : ""}</td>
              <td>genomic copies / mL</td>
            </tr>
            {#if (hoveredPoint.min_max_diff)}
            <tr>
              <td></td>
              <td>{display_lod(hoveredPoint.own_LoD_max)} (max)</td>
              <td>genomic copies / mL</td>
            </tr>
            {/if}
          </tbody>
        </table>
      </div>

      <!-- {#if hoveredPoint.notes}
        <h6>Notes</h6>
        <div>
          { hoveredPoint.notes }
        </div>
      {/if} -->
      <!-- <div class="infos">
        <div class="info">
          <h6>Processing Time</h6>
          <div>
            {#if hoveredPoint.time[2]}
              { hoveredPoint.time[2] }
            {:else}
              <i>no information available</i>
            {/if}
          </div>
        </div>
        <div class="info cost">
          <h6>Cost</h6>
          <div>
            {#if hoveredPoint.cost}
              {#each new Array(hoveredPoint.cost || 0).fill(0) as _}
                $
              {/each}
            {/if}
          </div>
        </div>
      </div> -->
    </div>
  {/if}
</div>

<style>
  #polygon { fill: url(#Gradient1); }
  .stop1 { stop-color: green; }
  .stop2 { stop-color: white; stop-opacity: 0; }
  .stop3 { stop-color: red; }

  svg {
    overflow: visible;
    margin: 100px;
  }
  .test {
    /* fill: #256D69; */
    /* stroke: #256D69; */
    /* stroke-width: 9; */
    /* fill-opacity: 0.6; */
    mix-blend-mode: multiply;
    stroke-linecap: round;
  }
  text {
    text-anchor: middle;
    font-size: 0.9em;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .x-tick, .y-tick {
    font-size: 0.8em;
    font-weight: 700;
    fill: #787d92;
  }
  .y-tick {
    text-anchor: end;
  }
  .tick-line {
    stroke: #787d92;
    stroke-width: 1;
  }

  .equivalence-line {
    stroke: #787d92;
    stroke-width: 1;
  }

  text {
    pointer-events: none;
  }

  .tooltip {
    position: absolute;
    top: -2em;
    left: 0;
    /* width: 20em; */
    max-width: 20em;
    /* margin-left: -10em; */
    /* text-align: center; */
    background: white;
    padding: 1em 1.3em;
    font-size: 0.8em;
    line-height: 1.3em;
    box-shadow: 0 6px 8px rgba(52, 73, 94, 0.2), 0 1px 1px rgba(52, 73, 94, 0.1);
    pointer-events: none;
  }

  h3 {
    margin-top: 0;
    margin-bottom: 0.3em;
    font-weight: 800;
  }

  h6 {
    margin-top: 1.6em;
    margin-bottom: 0.3em;
  }
  .summary {
    margin-top: 1em;
    margin-bottom: 1em;
  }
</style>