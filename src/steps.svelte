<script>
  export let methods
  export let missingMethods
  export let activeSteps

	import { steps, ordinalLevels } from "./data-utils"
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
        {#each methods.filter(({ stepIndex }) => stepIndex == i) as { name, numTimesUsed }}
          <div class="step-option" class:active={activeSteps && activeSteps[i].includes(name.toLowerCase())}>
            { name }
            <div class="step-dots">
              {#each new Array(numTimesUsed).fill(0) as i}
                <div class="step-dot" />
              {/each}
            </div>
          </div>
        {/each}
        {#each missingMethods[i] || [] as name}
          <div class="step-option step-option-temp" class:active={activeSteps && activeSteps[i].includes(name.toLowerCase())}>
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
    margin-bottom: 0.3em;
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
    padding: 0.9em 1em;
    background: #E1DCE4;
    border-radius: 0.6em;
    font-weight: 600;
    border: 2px solid transparent;
    transition: all 0.2s ease-out;
  }
  .step-option-temp {
    margin-bottom: 0.1em;
    font-size: 0.9em;
    background: none;
    border: 1px dashed rgb(186, 182, 196);
  }
  .step-option.active {
    border-color: #3A3253;
		background: #3A3253;
		color: #E1DCE4;
  }
  .step-dots {
    position: absolute;
    bottom: -0.9em;
    height: 0.6em;
    display: flex;
    flex-wrap: wrap;
    left: 0;
    right: 0;
  }
  .step-dot {
    height: 3px;
    width: 3px;
    margin: 1px;
    background: #3A3253;
    border-radius: 100%;
  }
</style>