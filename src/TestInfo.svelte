<script>
	import Icon from "./Icon.svelte"
	import { testUrl, methodsUrl, getNickname, steps, parseStep, parseTime, getOrdinalLevel, ordinalLevels, parseLocation,parseDate, formatDate } from "./data-utils"

  export let test = {}
  export let isInline = false
  export let onClose
</script>

<div class="test-info">
  {#if !isInline}
    <div class="test-info-close" on:click={onClose}>
      <Icon name="close" />
    </div>
    <h3>
      { test.name }
    </h3>
  {/if}
  <div>
    { test.summary }
  </div>
  {#if test.date}
    <h6>EUA Approval Date</h6>
    <div class="date">{ formatDate(parseDate(test.date)) }</div>
  {/if}
  {#if test.notes}
    <h6>Notes</h6>
    <div>
      { test.notes }
    </div>
  {/if}
  <h6>Steps</h6>
  <div class="test-info-steps">
    {#each test.unparsedSteps as step, i}
      <div class="test-info-step">
        <div class="test-info-step-index">
          { i + 1 }
        </div>
        <div class="test-info-step-text">
          {#if step}
            { step }
          {:else}
            <i>no information available</i>
          {/if}
        </div>
      </div>
    {/each}
  </div>
  <div class="row">
    <div>
      <h6>Processing Time</h6>
      <div>
        {#if test.time[2] && test.time[2] != "no information available"}
          { test.time[2] }
        {:else}
          <i>no information available</i>
        {/if}
      </div>
    </div>
    <div>
      <h6>Cost</h6>
      <div class="cost">
        {#if test.cost}
          {#each new Array(test.cost || 0).fill(0) as _}
            <Icon name="money" />
          {/each}
        {:else}
          <i>no information available</i>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
	.test-info {
    position: relative;
    width: 100%;
		padding: 1rem 1.6rem 3em;
		background: #E1DCE4;
		/* color: #E1DCE4; */
		font-size: 0.8em;
		overflow: auto;
    box-shadow: 0 6px 8px rgba(52, 73, 94, 0.2), 0 1px 1px rgba(52, 73, 94, 0.1);
	}
	.test-info .date {
		margin-bottom: 0.6em;
	}
	.test-info :global(h3) {
		display: flex;
		justify-content: space-between;
		margin-bottom: 0.3em;
		font-size: 1.6em;
	}
	.test-info :global(p) {
		margin: 0;
		padding: 0.3em 0 1.6em;
	}
	.test-info-step {
		display: flex;
		margin-bottom: 0.6em;
	}
	.test-info-step-index {
    margin-left: 0;
		margin-right: 0.6em;
    opacity: 0.5;
	}
	h3 {
		margin-top: 0.3em;
	}
	h6 {
		padding-top: 1.2em;
	}
	i {
		font-style: italic;
		opacity: 0.6;
	}
	.test-info-close {
		position: absolute;
		top: 1.8em;
		right: 1.2em;
		opacity: 0.6;
		padding: 0.4em;
		cursor: pointer;
	}
	.test-info-close:hover {
		opacity: 1;
	}
	.row {
		display: flex;
		justify-content: space-between;
	}
	.cost {
		text-align: right;
	}
	@media (max-width: 1100px) {
    .test-info {
      word-break: break-word;
    }
  }
</style>