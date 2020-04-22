<script>
  import { flip } from "svelte/animate"
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

  let sortedMethods = []
  const sortMethods = () => {
    sortedMethods = steps.map((step, i) => (
      methods
        .filter(({ stepIndex }) => stepIndex == i)
        .sort((a, b) => (
          (activeSteps ? (
            (activeSteps[i].includes(a.name.toLowerCase()) && !activeSteps[i].includes(b.name.toLowerCase())) ? -100 :
            (activeSteps[i].includes(b.name.toLowerCase()) && !activeSteps[i].includes(a.name.toLowerCase())) ?  100 :
              0
          ) : 0)
          + (b.numTimesUsed - a.numTimesUsed)
        ))
    ))
  }
  $: activeSteps, methods, sortMethods()
</script>

<div class="c">
  {#each steps as step, i}
    <div class="step">
      <div class="step-label">
        {#if i}
          <div class="step-arrow">
            <Icon name="arrow" direction="e" />
          </div>
        {/if}
        <div class="step-index">
          { i + 1 }
        </div>
        { step }
      </div>
      <div class="step-options">
        {#each sortedMethods[i] as { name, description, cost, sensitivity, time, numTimesUsed, notes}, methodI (name)}
          <div class="step-option" animate:flip={{duration: 600}}>
            <div class="step-option-main">
              <div class="step-option-text" class:active={activeSteps && activeSteps[i].includes(name.toLowerCase())}>
                <div class="step-option-name">
                  <div class="step-option-checkbox">
                    {#if activeSteps && activeSteps[i].includes(name.toLowerCase())}
                      <div class="check">
                        <Icon name="check" />
                      </div>
                    {/if}
                  </div>
                  { name }
                </div>
                {#if description}
                  <div class="step-option-description">
                    { description }
                  </div>
                {/if}
              </div>
              <div class="step-dots">
                {#each new Array(numTimesUsed).fill(0) as i}
                  <div class="step-dot" />
                {/each}
              </div>
              {#if !i && !methodI}
                <div class="note step-dots-note">
                  <div class="arrow-swoop">
                    <Icon name="arrow-swoop" />
                  </div>
                  One dot for each test that uses this method
                </div>
              {/if}
            </div>
            <div class="step-bars">
              <div class="bar">
                {#if !i && !methodI}
                  <div class="bar-label">cost</div>
                {/if}
                <div class="bar-fill"
                  style={`width: ${((cost * 100) / 3) || 0}%`}
                />
                <div class="bar-value">{costOrdinalLabels[cost - 1] || ""}</div>
              </div>
              <div class="bar">
                {#if !i && !methodI}
                  <div class="bar-label">time</div>
                {/if}
                <div class="bar-fill"
                  style={`width: ${timeScale(time[0]) || 0}%`}
                />
                <div class="bar-value">{time[2] || ""}</div>
              </div>
              <div class="bar">
                {#if !i && !methodI}
                  <div class="bar-label">sensitivity</div>
                {/if}
                <div class="bar-fill"
                  style={`width: ${((sensitivity * 100) / 3) || 0}%`}
                />
                <div class="bar-value">{sensitivityOrdinalLabels[sensitivity - 1] || ""}</div>
              </div>
            </div>
          </div>
        {/each}
        {#each missingMethods[i] || [] as name}
          <div class="step-option-text step-option-temp" class:active={activeSteps && activeSteps[i].includes(name.toLowerCase())}>
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
    width: 98%;
		padding-top: 2em;
    /* text-align: center; */
    /* overflow: hidden; */
  }
  .step-label {
    position: sticky;
    top: 0;
    background: white;
    z-index: 10;
    height: 3em;
    display: flex;
    align-items: center;
    margin-left: -1.5em;
    margin-bottom: 0.6em;
    padding: 1em 0;
    /* justify-content: center; */
    font-weight: 800;
    width: 100%;
  }
  .step-arrow {
    position: absolute;
    left: -1.3em;
    margin-top: 2px;
    font-size: 0.8em;
    opacity: 0.5;
  }
  .step-index {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1.7em;
    width: 1.7em;
		flex: none;
    margin-right: 0.7em;
    margin-bottom: -0.1em;
    line-height: 1em;
    font-size: 0.8em;
    border: 1px solid;
    border-radius: 100%;
  }
  .step {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 1em 0 2em;
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
    margin: 0.3em;
    display: flex;
  }
  .step-option-main {
    flex: 3;
  }
  .step-option-text {
    padding: 0.9em 1em;
    /* background: #E1DCE4; */
    font-size: 0.9em;
    border-radius: 3px;
    border: 1px solid #E1DCE4;
    box-shadow: 0 6px 8px rgba(52, 73, 94, 0.2), 0 1px 1px rgba(52, 73, 94, 0.1);
    transition: all 0.2s ease-out;
  }
  .step-option-checkbox {
    width: 1em;
    height: 1em;
    background: white;
    margin-right: 0.6em;
    margin-left: -1.6em;
    border-radius: 3px;
    border: 1px solid #E1DCE4;
    /* transition: all 0.3s ease-out; */
  }
  @keyframes check {
    0% { width: 0; }
    100% { width: 1em; }
  }
  .check {
    font-size: 0.8em;
    overflow: hidden;
    animation: check 0.5s ease-out;
  }
  .step-option-name {
    display: flex;
    font-weight: 600;
  }
  .step-option-description {
    position: absolute;
    background: inherit;
    margin-top: 0.6em;
    margin-left: -1em;
    padding: 1em;
    font-size: 0.8em;
    font-weight: 400;
    line-height: 1.3em;
    z-index: 100;
    opacity: 0;
    pointer-events: none;
    box-shadow: 0 6px 8px rgba(52, 73, 94, 0.2), 0 1px 1px rgba(52, 73, 94, 0.1);
    border: 1px solid #3A3253;
    background: white;
  }
  .step-option-text:hover .step-option-description {
    opacity: 1;
    /* pointer-events: all; */
  }
  .step-option-temp {
    width: 72%;
    margin-bottom: 0.5em;
    margin-left: 0.4em;
    padding: 0.5em 1em;
    background: none;
    font-size: 0.9em;
    border: 1px dashed rgb(186, 182, 196);
  }
  .step-option-text.active {
    border-color: #3A3253;
		/* background: #3A3253; */
		/* color: #E1DCE4; */
  }
  .step-option-text.active .step-option-checkbox {
    color: white;
    background: #3A3253;
    border: 1px solid #3A3253;
  }
  .step-bars {
    flex: 1;
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
    border-radius: 0 3px 3px 0;
  }
  .bar-label {
    position: absolute;
    font-size: 0.6em;
    top: -0.3em;
    left: 0.4em;
    font-weight: 600;
    /* transform: translateX(-100%); */
    z-index: 10;
  }
  .bar-value {
    position: absolute;
    font-size: 0.6em;
    top: -0.3em;
    /* right: -0.4em; */
    left: 0.4em;
    max-width: 100%;
    font-weight: 600;
    white-space: nowrap;
    /* transform: translateX(100%); */
    opacity: 0;
  }
  .step-option:hover .bar-label {
    opacity: 0;
  }
  .step-option:hover .bar-value {
    opacity: 1;
  }
  .step-option:hover .bar-fill {
    opacity: 0.5;
  }
  .arrow-swoop {
    /* transform: scaleX(-1); */
  }
  .step-dots {
    /* position: absolute; */
    /* bottom: -0.9em; */
    /* height: 0.6em; */
    /* padding-left: 0.6em; */
    /* margin-top: 0.6em; */
    display: flex;
    flex-wrap: wrap;
    margin-top: 0.1em;
    margin-bottom: 0.3em;
    padding-left: 1em;
    padding-right: 1em;
    /* left: 0;
    right: 0; */
  }
  .step-dots-note {
    padding-top: 0.3em;
    padding-bottom: 0.6em;
    padding-left: 2em;
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
  @media (max-width: 1250px) {
    .c {
      flex-wrap: wrap;
    }
    .step {
      min-width: 15em;
      max-height: 50vw;
      overflow: auto;
    }
  }
	@media (max-width: 826px) {
    .step-arrow {
      transform: translate(90deg);
    }
    .step {
      border-bottom: 1px solid #000;
      padding-bottom: 1em;
      /* padding-top: 1em; */
      max-height: 25vh;
      align-items: flex-start;
    }
    .step-label {
      width: calc(100% + 2em);
      margin-left: -1em;
      box-shadow: 0 6px 8px rgba(52, 73, 94, 0.2), 0 1px 1px rgba(52, 73, 94, 0.1);
    }
    .c {
      padding-top: 0;
    }
    .bar-value {
      overflow: hidden;
    }
  }
</style>