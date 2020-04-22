<script>
  import { extent } from "d3-array"
  import { scaleLinear, scaleSqrt } from "d3-scale"
  import { timeMonth } from "d3-time"
  import { timeFormat } from "d3-time-format"
  import { forceSimulation, forceX, forceY, forceCollide, forceRadial } from "d3-force"

  import { flatten, getOrdinal, rectCollide } from "./utils"
  import { ordinalLevels, locationColors, parseDate } from "./data-utils"

  export let data = []

  let width = 1200
  let height = 700

  const formatDate = timeFormat("%B %-d")
  const formatDay = timeFormat("%-d")
  const formatYear = timeFormat("%Y")
  const xAccessor = d => d.time[0]
  const x1Accessor = d => d.time[1]
  const yAccessor = d => d.cost
  const rAccessor = d => d.cost
  const colorAccessor = d => locationColors[d.location[0]] || "#CDCFD8"

  let hoveredPoint = null

  $: rScale = scaleSqrt()
    .domain(extent(data, rAccessor))
    .range([5, 20])

  $: xScale = scaleLinear()
    .domain([0, 60 * 5.15])
    .range([0, width])
    // .clamp(true)

  $: xTicks = [
    ["1 hour", xScale(60 * 1)],
    // ["2 hours", xScale(60 * 2)],
    ["3 hours", xScale(60 * 3)],
    // ["4 hours", xScale(60 * 4)],
    ["5 hours", xScale(50 * 6)],
    // ["6 hours", xScale(60 * 6)],
    // ["12 hours", xScale(60 * 12)],
    // ["1 day", xScale(60 * 24)],
  ]

  $: yPositions = [
    0,
    ...new Array(ordinalLevels.length + 1).fill(0).map((_, i) => (
      height - (height / 3) * (i + 0.5)
    ))
  ]

  $: yTicks = [
    ["more expensive", yPositions[3] - (height / 6)],
    ["medium price", yPositions[2] - (height / 6)],
    ["cheaper", yPositions[1] - (height / 6)],
  ]

  $: parsedTests = data.map(d => {
    const x0 = xScale(xAccessor(d))
    const x1 = xScale(x1Accessor(d))
    if (!xAccessor(d) || !yAccessor(d)) return

    return {
      ...d,
      x0,
      x1,
      x: (x1 - x0) / 2 + x0,
      xMid: (x1 - x0) / 2 + x0,
      yMid: yPositions[yAccessor(d)],
      y: yPositions[yAccessor(d)],
      r: width < 600 ? 15 : 21,
      color: colorAccessor(d),
    }
  }).filter(d => d && d.xMid < width)

  let adjustedTests = []
  let labels = []

  const moveTests = () => {
    adjustedTests = parsedTests
    let simulation = forceSimulation()
      // .force("x", forceX(d => d.x).strength(1))
      .force("x", forceX(d => d.xMid).strength(1))
      .force("y", forceY(d => d.yMid))
      .force("collide", forceCollide(d => d.r + 6).strength(0.6))
      .nodes(adjustedTests)
      .stop()

    new Array(30).fill(0).forEach((_, i) => {
      simulation.tick()
      adjustedTests.forEach(d => {
        d.y = Math.max(
          d.yMid - (height / 6),
          Math.min(
            d.yMid + (height / 6),
            d.y,
          )
        )
      })
    })
    labels = parsedTests.map(d => {
      const textWidth = d.nickname.length * 9

    var velocity = Math.random() * 2 + 1
    var angle = Math.random() * 360
      return {
        ...d,
        x: Math.min(
          width - textWidth * 0.8,
          Math.max(
            // textWidth / 2,
            d.x - d.r / 2,
          )
        ),
        y: d.y + 5,
        vx: velocity * Math.cos(angle * Math.PI / 180),
        vy: velocity * Math.sin(angle * Math.PI / 180),
        textWidth,
        width: textWidth,
        height: 23,
      }
    })
    const collisionForce = rectCollide()
      .size(d => [d.textWidth, d.height])

    let simulation2 = forceSimulation()
      .force("collide", collisionForce)
      .nodes(labels)
      .stop()

    new Array(30).fill(0).forEach((_, i) => {
      simulation2.tick()
    })
  }

  $: parsedTests, moveTests()



</script>

<div class="c" bind:clientWidth={width}>
  <div class="title">
    Each circle is a specific test, processed at either <span style={`color: ${locationColors["poc"]}; font-weight: 700`}>the point of care</span> or <span style={`color: ${locationColors["centralized"]}; font-weight: 700`}>in a centralized location</span>
  </div>
  <!-- <div class="legend">
    <div class="legend-item">
      <div class="legend-item-square" style={`color: ${locationColors["poc"]}`} />
      <div class="legend-item-label">
        POC
      </div>
    </div>
    <div class="legend-item">
      <div class="legend-item-square" style={`color: ${locationColors["centralized"]}`} />
      <div class="legend-item-label">
        Centralized
      </div>
    </div>
  </div> -->
  <svg {width} {height}>
    {#each yTicks as [tick, y]}
      <rect
        class="tier"
        y={y}
        {width}
        height={height / 3 - 20}
      />
      <text
        class="y-tick"
        x={16}
        y={y + 23}
      >
        { tick }
      </text>
    {/each}
    {#each xTicks as [tick, x]}
      <text
        class="x-tick"
        x={x}
        y={height + 23}
      >
        { tick }
      </text>
      <line
        class="tick-line"
        x1={x}
        x2={x}
        y1={height - 3}
        y2={height + 3}
      />
    {/each}
    <text
      class="x-label"
      x={10}
      y={height + 6}
    >
      Processing
    </text>
    <text
      class="x-label"
      x={10}
      y={height + 23}
    >
      Time
    </text>
    {#each adjustedTests as test}
      <circle
        class="test"
        cx={test.x}
        cy={test.y}
        r={test.r}
        fill={test.color}
        on:mouseenter={() => hoveredPoint = test}
        on:mouseleave={() => hoveredPoint = null}
      />
    {/each}
    {#each labels as { x, y, nickname }}
      <text class="name name-bg" {x} {y}>
        { nickname }
        <!-- { name.split(/ /g)[0] }... -->
      </text>
      <text class="name" {x} {y}>
        { nickname }
        <!-- { name.split(/ /g)[0] }... -->
      </text>
    {/each}
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
      hoveredPoint.y
    }px + ${
      hoveredPoint.y < 200 ? "4em" : "-100%"
    }))`}>
      <h3 class="tooltip-name">
        { hoveredPoint.name }
      </h3>
      <div class="summary">
        { hoveredPoint.summary }
      </div>
      {#if hoveredPoint.date}
        <h6>EUA approval date</h6>
        <div class="date">
          { formatDate(parseDate(hoveredPoint.date)) }<sup>{
            getOrdinal(formatDay(+parseDate(hoveredPoint.date)))
          }</sup>, { formatYear(parseDate(hoveredPoint.date)) }
        </div>
      {/if}
      {#if hoveredPoint.notes}
        <h6>Notes</h6>
        <div>
          { hoveredPoint.notes }
        </div>
      {/if}
      <div class="infos">
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
      </div>
    </div>
  {/if}
</div>

<style>
  .c {
    position: relative;
    width: 80%;
    height: 700px;
    margin: 1em auto;
    padding-top: 3em;
  }
  svg {
    overflow: visible;
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
  .y-tick {
    text-anchor: start;
    font-weight: 700;
    fill: #787d92;
  }
  .x-label {
    text-anchor: start;
    font-size: 0.8em;
    font-weight: 700;
    fill: #787d92;
  }
  .x-tick {
    font-size: 0.8em;
    font-weight: 700;
    fill: #787d92;
  }
  .tick-line {
    stroke: #787d92;
    stroke-width: 1;
  }
  .name-bg {
    stroke: #f4f4f4;
    stroke-width: 2;
    mix-blend-mode: soft-light;
  }
  .name {
    font-size: 0.8em;
    font-weight: 600;
    text-anchor: start;
    /* shape-rendering: crispEdges; */
  }
  .tier {
    pointer-events: none;
    fill: #f4f4f4;
  }
  .legend {
    display: flex;
    align-items: center;
    margin-bottom: 0.3em;
  }
  .legend-item {
    flex: none;
    display: flex;
    align-items: center;
    margin-left: 1em;
  }
  .legend-item-square {
    height: 0.9em;
    width: 0.9em;
    background: currentColor;
  }
  .legend-item-label {
    margin-left: 0.4em;
    font-size: 0.9em;
    font-weight: 700;
    color: #787d92;
  }
  text {
    pointer-events: none;
  }
  .title {
    padding: 0 0 0.6em 1em;
  }
  .tooltip {
    position: absolute;
    top: 4em;
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
	.steps {
		margin-bottom: 1.5em;
	}
	.step {
		display: flex;
		margin-bottom: 0.6em;
	}
	.step-index {
    margin-left: 0;
		margin-right: 0.6em;
    opacity: 0.5;
	}
  h3 {
    margin-top: 0;
    margin-bottom: 0.3em;
    font-weight: 800;
  }
	i {
		font-style: italic;
		opacity: 0.6;
	}
  h6 {
    margin-top: 1.6em;
    margin-bottom: 0.3em;
  }
  .summary {
    margin-top: 1em;
    margin-bottom: 1em;
  }
  .infos {
    display: flex;
    justify-content: space-between;
  }
  .cost {
    text-align: right;
  }
</style>