<script>
  import { scaleLinear } from "d3-scale"
  import { extent } from "d3-array"

	import Icon from "./Icon.svelte"
  import { steps, ordinalLevels } from "./data-utils"

  export let methods
  export let missingMethods
  export let activeSteps

  $: timeScale = scaleLinear()
    .domain(extent(methods, d => d.time[0] || 0))
    .range([0, 100])

  const costOrdinalLabels = ["cheaper", "medium cost", "expensive"]
  const sensitivityOrdinalLabels = ["low sensitivity", "medium sensitivity", "high sensitivity"]

  $: sortedMethods = steps.map((step, i) => (
    methods
      .filter(({ stepIndex }) => stepIndex == i)
      .sort((a, b) => b.numTimesUsed - a.numTimesUsed)
  ))
</script>

<div class="c">
  {#each steps as step, i}
    <div class="step">
      <h6 class="step-index">
        { i + 1 }
      </h6>
      <h6 class="step-label">
        { step }
      </h6>
      <div class="step-options">
        {#each sortedMethods[i] as { name, cost, sensitivity, time, numTimesUsed, notes}, methodI}
          <div class="step-option">
            <div class="step-option-name" class:active={activeSteps && activeSteps[i].includes(name.toLowerCase())}>
              <div class="step-name">
                { name }
              </div>
              <!-- <div class="step-note note">
                { notes }
              </div> -->
            </div>
            <div class="step-bars">
              <div class="bar">
                {#if !i && !methodI}
                  <div class="bar-label">cost</div>
                {/if}
                <div class="bar-fill"
                  style={`width: ${((cost * 100) / 3) || 0}%`}
                >
                  <div class="bar-value">{costOrdinalLabels[cost - 1] || ""}</div>
                </div>
              </div>
              <div class="bar">
                {#if !i && !methodI}
                  <div class="bar-label">sensitivity</div>
                {/if}
                <div class="bar-fill"
                  style={`width: ${((sensitivity * 100) / 3) || 0}%`}
                >
                  <div class="bar-value">{sensitivityOrdinalLabels[sensitivity - 1] || ""}</div>
                </div>
              </div>
              <div class="bar">
                {#if !i && !methodI}
                  <div class="bar-label">time</div>
                {/if}
                <div class="bar-fill"
                  style={`width: ${timeScale(time[0]) || 0}%`}
                >
                  <div class="bar-value">{time[2] || ""}</div>
                </div>
              </div>
            </div>
            <div class="step-dots">
              {#each new Array(numTimesUsed).fill(0) as i}
                <div class="step-dot" />
              {/each}
            </div>
            {#if !i && !methodI}
              <div class="note">
                <Icon name="arrow-swoop" />
                One dot for each test that uses this method
              </div>
            {/if}
          </div>
        {/each}
        {#each missingMethods[i] || [] as name}
          <div class="step-option-name step-option-temp" class:active={activeSteps && activeSteps[i].includes(name.toLowerCase())}>
            { name }
          </div>
        {/each}
      </div>
    </div>
  {/each}
</div>

<style>
  .c {
    display: flex;
    justify-content: center;
    text-align: center;
  }
  .step-index {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1.7em;
    width: 1.7em;
    margin-bottom: -0.1em;
    line-height: 1em;
    border: 1px solid;
    border-radius: 100%;
  }
  .step-label {
    height: 3em;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .step {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 1em;
  }
  .step-options {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    margin: 0 -0.6em;
  }
  .step-option {
    position: relative;
    margin: 0.6em;
  }
  .step-option-name {
    padding: 0.9em 1em;
    background: #E1DCE4;
    border-radius: 0.6em;
    font-weight: 600;
    border: 2px solid transparent;
    transition: all 0.2s ease-out;
  }
  .step-option-temp {
    margin-bottom: 0.5em;
    font-size: 0.9em;
    padding: 0.5em 1em;
    background: none;
    border: 1px dashed rgb(186, 182, 196);
  }
  .step-option-name.active {
    border-color: #3A3253;
		background: #3A3253;
		color: #E1DCE4;
  }
  .step-bars {
    width: 100%;
    margin-top: 0.5em;
  }
  .bar {
    position: relative;
    left: 0;
    height: 6px;
    width: 100%;
    margin-bottom: 3px;
  }
  .bar:nth-of-type(1) .bar-fill {
    background: linear-gradient(
      to right,
      #E9D5C5,
      #E2A38C
    );
    background-size: 25em;
  }
  .bar:nth-of-type(2) .bar-fill {
    background: linear-gradient(
      to right,
      #bfd5fc,
      #7bc4b7
    );
    background-size: 25em;
  }
  .bar:nth-of-type(3) .bar-fill {
    background: linear-gradient(
      to right,
      #d5c7db,
      #928ab4
    );
    background-size: 25em;
  }
  .bar-fill {
    position: relative;
    height: 100%;
    background: #16535E;
    border-radius: 3px;
  }
  .bar-label {
    position: absolute;
    font-size: 0.6em;
    top: -0.3em;
    left: -0.4em;
    transform: translateX(-100%);
  }
  .bar-value {
    position: absolute;
    font-size: 0.6em;
    top: -0.3em;
    /* right: -0.4em; */
    left: 0.4em;
    font-weight: 600;
    white-space: nowrap;
    /* transform: translateX(100%); */
    opacity: 0;
  }
  .step-option:hover .bar-value {
    opacity: 1;
  }
  .step-dots {
    /* position: absolute; */
    /* bottom: -0.9em; */
    /* height: 0.6em; */
    /* padding-left: 0.6em; */
    margin-top: 0.6em;
    margin-bottom: 0.5em;
    display: flex;
    flex-wrap: wrap;
    /* left: 0;
    right: 0; */
  }
  .step-dot {
    height: 3px;
    width: 3px;
    margin: 1px;
    background: #3A3253;
    border-radius: 100%;
  }
  .note {
    display: flex;
    align-items: center;
    padding-right: 1em;
    font-size: 0.7em;
    text-align: left;
    font-weight: 400;
    /* margin-top: 0.3em; */
    margin-top: -0.5em;
    /* margin-bottom: 0.6em; */
    line-height: 1.2em;
    opacity: 0.7;
    font-style: italic;
  }
  .note :global(svg) {
    /* margin-left: 1em; */
    margin-top: -0.6em;
    margin-right: 0.6em;
  }
</style>