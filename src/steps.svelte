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
        {#each methods.filter(({ stepIndex }) => stepIndex == i) as { name, numTimesUsed}, methodI}
          <div class="step-option" class:active={activeSteps && activeSteps[i].includes(name.toLowerCase())}>
            { name }
            <div class="step-dots">
              {#each new Array(numTimesUsed).fill(0) as i}
                <div class="step-dot" />
              {/each}
            </div>
          </div>
          {#if !i && !methodI}
            <div class="note">
              <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.36765 0.587956C5.46303 0.493131 5.57277 0.421499 5.68985 0.373059ZM6.77761 0.587956C6.59682 0.408236 6.3477 0.29718 6.07263 0.29718C5.93704 0.29718 5.80776 0.324166 5.68985 0.373059M6.77761 0.587956C6.77846 0.588793 6.7793 0.589631 6.78014 0.590471ZM5.07263 3.71139L1.77974 7.00429C1.38921 7.39481 0.756049 7.39481 0.365525 7.00429C-0.0249992 6.61376 -0.0249992 5.9806 0.365525 5.59007L5.36513 0.590471M5.07263 3.71139V13.2972C5.07263 14.6233 5.59942 15.895 6.5371 16.8327C7.47478 17.7704 8.74655 18.2972 10.0726 18.2972H17.0726C17.6249 18.2972 18.0726 17.8495 18.0726 17.2972C18.0726 16.7449 17.6249 16.2972 17.0726 16.2972H10.0726C9.27698 16.2972 8.51392 15.9811 7.95131 15.4185C7.3887 14.8559 7.07263 14.0928 7.07263 13.2972V3.71139L10.3655 7.00429C10.756 7.39481 11.3892 7.39481 11.7797 7.00429C12.1703 6.61376 12.1703 5.9806 11.7797 5.59007L6.78014 0.590471" fill="black"/>
              </svg>
              One dot for each test that uses this method
            </div>
          {/if}
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
  .note {
    display: flex;
    align-items: center;
    padding-right: 1em;
    font-size: 0.76em;
    text-align: left;
    line-height: 1.2em;
    opacity: 0.7;
    font-style: italic;
  }
  .note svg {
    margin-left: 1em;
    margin-right: 0.6em;
  }
</style>