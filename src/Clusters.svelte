<script>
  import { extent } from "d3-array"
  import { scaleLinear, scaleSqrt } from "d3-scale"
  import { timeMonth } from "d3-time"
  import { timeFormat } from "d3-time-format"

  import { flatten } from "./utils"
  import { parseDate } from "./data-utils"

  export let data = []

  let width = 1200
  let height = 600

  const xAccessor = d => d.time[0]
  const x1Accessor = d => d.time[1]
  const yAccessor = d => d.cost
  const rAccessor = d => d.cost

  $: rScale = scaleSqrt()
    .domain(extent(data, rAccessor))
    .range([5, 20])

  $: xScale = scaleLinear()
    .domain(extent([
      ...data.map(xAccessor),
      ...data.map(x1Accessor),
    ]))
    .range([0, width])

  $: xTicks = xScale.ticks(3)
    .map(d => ([
      d,
      xScale(d),
    ]))

  $: yScale = scaleLinear()
    .domain(extent(data.map(yAccessor)))
    .range([height, 1])

  $: yTicks = yScale.ticks(3)
    .map(d => ([
      d,
      yScale(d),
    ]))

</script>

<div class="c" bind:clientWidth={width}>
  <svg {width} {height}>
    {#each data as test}
      <line
        class="test"
        x1={xScale(xAccessor(test))}
        x2={xScale(x1Accessor(test))}
        y1={yScale(yAccessor(test)) || height + 50}
        y2={yScale(yAccessor(test)) || height + 50}
      />
    {/each}
    {#each xTicks as [tick, x]}
      <text
        x={x}
        y={height}
      >
        { tick }
      </text>
    {/each}
    {#each yTicks as [tick, y]}
      <text
        x={-10}
        y={y}
        style="text-anchor: end"
      >
        { tick }
      </text>
    {/each}
  </svg>
</div>

<style>
  .c {
    width: 80%;
    margin: 1em auto;
  }
  svg {
    overflow: visible;
  }
  .test {
    fill: #256D69;
    stroke: #256D69;
    stroke-width: 9;
    fill-opacity: 0.6;
    mix-blend-mode: multiply;
    stroke-linecap: round;
  }
  text {
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: 0.9em;
  }
</style>