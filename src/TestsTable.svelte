<script>
	import { flip } from "svelte/animate"
	import { timeFormat } from "d3-time-format"
  import { scaleLinear } from "d3-scale"
  import { extent } from "d3-array"

	import { parseDate } from "./data-utils"
	import { getOrdinal } from "./utils"
	import Icon from "./Icon.svelte"

  export let data = []
  $: console.table(data[0])

  let sortMetric = "time"
  let isSortReversed = false

  const formatDate = timeFormat("%b %d")
  const formatDay = timeFormat("%-d")

  const getMetric = (d, metric) => (
    metric == "date" ? parseDate(d.date) :
    metric == "cost" ? d.cost :
    metric == "time" ? -d.time[0] || (isSortReversed ? Infinity : -Infinity) :
    metric == "location" ? (
      d.location[0] == "poc" ? 100 :
      d.location[0] == "centralized" ? 50 :
        (isSortReversed ? 100 : -100)
     ) :
      (isSortReversed ? 100 : -100)
  )
  $: sortedData = data.sort((a,b) => (
    (getMetric(a, sortMetric) > getMetric(b, sortMetric) ? -1 : 1) * (isSortReversed ? -1 : 1)
  ))

  const sortBy = metric => {
    isSortReversed = metric == sortMetric ? !isSortReversed : false
    sortMetric = metric
  }

  $: colorScale = scaleLinear()
    .domain(extent(data, d => d.time[1] || 0))
    .range(["#D9D8E1", "#fff"])
</script>

<div class="c">
  <div class="headers">
    <div class="col">Test name</div>
    <div class="col">Methods</div>
    <div class="col sym clickable" on:click={() => sortBy("cost")}>
      <div>
        {#if sortMetric == "cost"}
          <span class="sort-icon">
            <Icon name="arrow" direction={isSortReversed ? "n" : "s"} />
          </span>
        {/if}
        Cost
      </div>
    </div>
    <div class="col text clickable" on:click={() => sortBy("time")}>
      <div>
        {#if sortMetric == "time"}
          <span class="sort-icon">
            <Icon name="arrow" direction={isSortReversed ? "n" : "s"} />
          </span>
        {/if}
        Time
      </div>
    </div>
    <div class="col sym clickable" on:click={() => sortBy("location")}>
      <div>
        {#if sortMetric == "location"}
          <span class="sort-icon">
            <Icon name="arrow" direction={isSortReversed ? "n" : "s"} />
          </span>
        {/if}
        Location
      </div>
    </div>
    <div class="col text clickable" on:click={() => sortBy("date")}>
      <div>
        {#if sortMetric == "date"}
          <span class="sort-icon">
            <Icon name="arrow" direction={isSortReversed ? "n" : "s"} />
          </span>
        {/if}
        Approvals
      </div>
    </div>
    <div class="col text med-wide">Training</div>
  </div>
  <div class="rows">
    {#each sortedData as test}
      <div class="row">
        <div class="col vert bold">
          <div class="name">
            { test.name }
          </div>
          <div class="note">
            { test.summary }
          </div>
          {#if test.notes}
            <div class="note" style="color: #16535E">
              { test.notes }
            </div>
          {/if}
        </div>
        <div class="col small vert">
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
        <div class="col text" class:colored={Number.isFinite(test.time[1])}>
          {#if test.time[2] == "no information available"}
            <div class="note">no information available</div>
          {:else}
            { test.time[2] || "" }
          {/if}
          <div
            class="color-overlay"
            style={`background: ${Number.isFinite(test.time[1]) ? colorScale(test.time[1]) : "#fff"}`}
          />
        </div>
        <div class="col sym">
          <Icon name={test.location[0]} />
        </div>
        <div class="col text vert">
          { test.approvals }
          <div class="note">
            { formatDate(parseDate(test.date)) }<sup>{
              getOrdinal(formatDay(+parseDate(test.date)))
            }</sup>
          </div>
        </div>
        <div class="col text small med-wide">
          { test.training }
        </div>
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
    border-bottom: 1px solid #EAEAEE;
  }
  .row:hover {
    background: #eaeaee;
  }
  .col {
    position: relative;
    display: flex;
    align-items: center;
    padding: 0.6rem 1rem;
    flex: 3 0;
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
  .sym {
    flex: 0 5rem;
    text-align: center;
    justify-content: center;
    /* font-size: 0.8em; */
    /* font-weight: 900; */
  }
  .text {
    flex: 0 0 5rem;
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
    flex: 0 0 9rem;
    overflow: hidden;
  }
</style>