<script>
	import { flip } from "svelte/animate"
  import { extent } from "d3-array"
	import { timeFormat } from "d3-time-format"
  import { scaleLinear } from "d3-scale"

	import { locationColors, parseDate } from "./data-utils"
	import { getOrdinal } from "./utils"
	import Icon from "./Icon.svelte"

  export let data = []

  const locationLabels = {
    poc: "Point-of-care",
    centralized: "Centralized",
  }

  let sortMetric = "time"
  let isSortReversed = false

  const formatDate = timeFormat("%b %d")
  const formatDay = timeFormat("%-d")

  const getMetric = (d, metric) => (
    metric == "name" ? d.name :
    metric == "date" ? -parseDate(d.date) :
    metric == "cost" ? d.cost :
    metric == "time" ? d.time[0] ? (
        (d.time[1] - d.time[0]) / 2 + d.time[0]
      ) : (isSortReversed ? -Infinity : Infinity) :
    metric == "location" ? (
      d.location[0] == "centralized" ? 100 :
      d.location[0] == "poc" ? 50 :
        (isSortReversed ? -100 : 100)
     ) :
      (isSortReversed ? 100 : -100)
  )
  $: sortedData = data.sort((a,b) => (
    (getMetric(a, sortMetric) > getMetric(b, sortMetric) ? 1 : -1) * (isSortReversed ? -1 : 1)
  ))

  const sortBy = metric => {
    isSortReversed = metric == sortMetric ? !isSortReversed : false
    sortMetric = metric
  }

  $: colorScale = scaleLinear()
    .domain(extent(data, d => d.time[1] || 0))
    .range(["#D9D8E1", "#fff"])

  const xAccessor = d => d.time[0]
  const x1Accessor = d => d.time[1]
  $: xScale = scaleLinear()
    .domain(extent([
      ...data.map(xAccessor),
      ...data.map(x1Accessor),
    ]))
    .range([0, 100])

  $: xTicks = [
    ["1 hour", xScale(60 * 1)],
    ["12 hours", xScale(60 * 12)],
    ["1 day", xScale(60 * 24)],
    ["1.5 days", xScale(60 * 24 * 1.5)],
    ["2 days", xScale(60 * 24 * 2)],
  ]
</script>

<div class="c">
  <div class="headers">
    <div class="col title clickable" on:click={() => sortBy("name")}>
      {#if sortMetric == "name"}
        <span class="sort-icon">
          <Icon name="arrow" direction={isSortReversed ? "s" : "n"} />
        </span>
      {/if}
      Test name
    </div>
    <div class="col">Methods</div>
    <div class="col sym clickable" on:click={() => sortBy("cost")}>
      <div>
        {#if sortMetric == "cost"}
          <span class="sort-icon">
            <Icon name="arrow" direction={isSortReversed ? "s" : "n"} />
          </span>
        {/if}
        Cost
      </div>
    </div>
    <!-- <div class="col text clickable" on:click={() => sortBy("time")}>
      <div>
        {#if sortMetric == "time"}
          <span class="sort-icon">
            <Icon name="arrow" direction={isSortReversed ? "s" : "n"} />
          </span>
        {/if}
        Time
      </div>
    </div> -->
    <div class="col sym clickable" on:click={() => sortBy("location")}>
      <div>
        {#if sortMetric == "location"}
          <span class="sort-icon">
            <Icon name="arrow" direction={isSortReversed ? "s" : "n"} />
          </span>
        {/if}
        Location
      </div>
    </div>
    <div class="col text clickable" on:click={() => sortBy("date")}>
      <div>
        {#if sortMetric == "date"}
          <span class="sort-icon">
            <Icon name="arrow" direction={isSortReversed ? "s" : "n"} />
          </span>
        {/if}
        Approvals
      </div>
    </div>
    <div class="col text med-wide">Training</div>
  </div>
  <div class="rows">
    {#each sortedData as test, i}
      <div class="row">
        <div class="col title vert">
          <div class="name">
            { test.name }
          </div>
          <div class="note">
            { test.summary }
          </div>
          {#if test.notes}
            <div class="note" style="margin-top: 0.6em; margin-bottom: 0.6em;">
              { test.notes }
            </div>
          {/if}
        </div>
        <div class="col small vert steps">
          {#each test.unparsedSteps as step, i}
            <div class="step">
              <span class="index">{ i + 1 }.</span> {#if step}
                { step }
              {:else}
                <i>no information available</i>
              {/if}
            </div>
          {/each}
        </div>
        <div class="col sym">
          {#each new Array(test.cost).fill(0) as _}
            <Icon name="money" />
          {/each}
        </div>
        <!-- <div class="col text" class:colored={Number.isFinite(test.time[1])}>
          {#if test.time[2] == "no information available"}
            <div class="note">no information available</div>
          {:else}
            { test.time[2] || "" }
          {/if}
          <div
            class="color-overlay"
            style={`background: ${Number.isFinite(test.time[1]) ? colorScale(test.time[1]) : "#fff"}`}
          />
        </div> -->
        <div class="col sym vert">
          <div style={`color: ${locationColors[test.location[0]]}`}>
            <Icon name={test.location[0]} />
          </div>
          <div class="note">
            { locationLabels[test.location[0]] || "" }
          </div>
        </div>
        <div class="col text vert">
          { test.approvals }
          <div class="note" style="white-space: nowrap">
            { formatDate(parseDate(test.date)) }<sup>{
              getOrdinal(formatDay(+parseDate(test.date)))
            }</sup>
          </div>
        </div>
        <div class="col text small med-wide">
          { test.training }
        </div>
        {#if test.time[1]}
          <div class="time-row">
            <div class="time-row-label">
              <div class="time-row-sort" on:click={() => sortBy("time")}>
                {#if sortMetric == "time"}
                  <span class="sort-icon">
                    <Icon name="arrow" direction={isSortReversed ? "s" : "n"} />
                  </span>
                {/if}
                Processing Time
              </div>
              <div class="time-row-value">
                { test.time[2] || "" }
              </div>
            </div>
            {#if test.time[1]}
              <div class="time-row-chart">
                <div
                  class="time-row-chart-fill-background"
                  style={[
                    `width: ${xScale(x1Accessor(test))}%`,
                  ].join("; ")}
                />
                <div
                  class="time-row-chart-fill"
                  class:time-row-chart-fill--has-error={x1Accessor(test) - xAccessor(test) > 10}
                  style={[
                    `left: ${xScale(xAccessor(test)) - (xAccessor(test) == x1Accessor(test) ? 0.5 : 0)}%`,
                    `width: ${Math.max(1, xScale(x1Accessor(test)) - xScale(xAccessor(test)))}%`,
                  ].join("; ")}
                />
                {#each xTicks as [label, offset]}
                  <div class="time-row-tick" style={`left: ${offset}%`}>
                    { label }
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .c {
    margin: 1em auto;
    padding: 0 1em;
    max-width: 90em;

  }
  .headers {
    position: sticky;
    top: 0;
    display: flex;
    z-index: 100;
  }
  sup {
    font-size: 0.7em;
    margin-bottom: 0.4em;
  }
  .headers .col {
    background: #E1DCE4;
    font-weight: 600;
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    border-bottom: 1px solid #EAEAEE;
  }
  .row:hover {
    /* background: #f4f4f4; */
  }
  .row:hover .time-row-chart {
    /* background: #eaeaee; */
  }
  .col {
    position: relative;
    display: flex;
    align-items: center;
    width: 1em;
    flex: 3 0 1em;
    padding: 0.6rem 1rem;
    overflow: hidden;
  }
  .color-overlay {
    position: absolute;
    top: -1px;
    right: 0;
    bottom: -1px;
    left: 0;
    mix-blend-mode: multiply;
  }
  .text {
    flex: 0 0 7rem;
    text-align: left;
  }
  .bold {
    font-weight: 600;
  }
  .small {
    font-size: 0.7em;
    line-height: 1.3em;
  }
  .vert {
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }
  .sym {
    flex: 0 7rem;
    text-align: center;
    justify-content: center;
    align-items: center;
    /* font-size: 0.8em; */
    /* font-weight: 900; */
  }
  .sym .note {
    padding-right: 0;
  }
  .colored {
    background: #D9D8E1;
    overflow: visible;
  }
  .row:hover .colored {
    /* background: none; */
  }
  .note {
    display: flex;
    align-items: center;
    padding-right: 1em;
    margin-top: 0.3em;
    font-size: 0.76em;
    text-align: left;
    font-weight: 400;
    line-height: 1.2em;
    opacity: 0.7;
    font-style: italic;
  }
  i {
    opacity: 0.5;
  }
  .index {
    margin-left: -1em;
    opacity: 0.5;
  }
  .step {
    margin: 0.2em 0;
  }
  .name {
    margin-bottom: 0.3em;
    font-weight: 700;
  }
  .clickable {
    cursor: pointer;
  }
  .sort-icon {
    position: absolute;
    margin-top: 0.3em;
    margin-left: -1.3em;
    color: #759D8C;
    font-size: 0.7em;
  }
  .med-wide {
    flex: 0 0 15rem;
    overflow: hidden;
  }
  .title {
    flex: 0 0 27rem;
    justify-content: flex-start;
    padding-top: 1em;
  }
  .steps {
    padding-top: 1.2em;
    padding-bottom: 1.2em;
  }
  .time-row {
    flex: 1 0 100%;
    display: flex;
    margin-top: 0.9em;
  }
  .time-row-label {
    width: 27rem;
    flex: 0 0 27rem;
    text-align: right;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    padding-right: 0.6em;
    font-size: 0.8em;
    /* font-weight: 600; */
  }
  .time-row-sort {
    text-align: left;
    cursor: pointer;
    padding-left: 1em;
  }
  .time-row-value {
    margin-top: 0.2em;
    font-size: 0.9em;
    opacity: 0.6;
  }
  .time-row-chart {
    position: relative;
    flex: 1;
    height: 3em;
    background: #f4f4f4;
  }
  .time-row-chart-fill {
    height: 1em;
    position: absolute;
    top: 50%;
    left: 0;
    /* border-radius: 1em; */
    /* opacity: 0.3; */
    /* mix-blend-mode: multiply; */
    transform: translate(0, -50%);
  }
  .time-row-tick {
    position: absolute;
    top: -1.5em;
    left: 0;
    font-size: 0.5em;
    /* border-radius: 1em; */
    /* opacity: 0.3; */
    /* mix-blend-mode: multiply; */
    text-transform: uppercase;
    letter-spacing: 0.1em;
    transform: translate(-50%, 0);
    opacity: 0.6;
    white-space: nowrap;
  }
  .time-row-tick:before {
    content: "";
    position: absolute;
    bottom: -0.9em;
    left: 50%;
    height: 0.5em;
    margin-left: -1px;
    border-left: 1px solid;
    opacity: 0.6;
  }
  .time-row-chart-fill--has-error {
    border-left: 1.5px solid #6d84aa;
    border-right: 1.5px solid #6d84aa;
    background: linear-gradient(
      to right,
      rgba(164, 191, 238, 0.3),
      rgba(79, 161, 146, 0.3)
    );
    background-size: 70em;
  }
  .time-row-chart-fill:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0.7em;
    height: 0.7em;
    background: #7b97d4;
    /* background: currentColor; */
    border-radius: 100%;
    border: 1px solid #6d84aa;
    transform: translate(-50%, -50%);
  }
  .time-row-chart-fill-background {
    height: 0.5em;
    position: absolute;
    top: 50%;
    left: 0;
    /* border-radius: 0 1em 1em 0; */
    background: linear-gradient(
      to right,
      rgb(164, 191, 238),
      rgb(79, 161, 146)
    );
    background-size: 70em;
    opacity: 0.5;
    /* border: 1px solid #6d84aa; */
    /* background-size: 70em; */
    transform: translate(0, -50%);
  }
</style>