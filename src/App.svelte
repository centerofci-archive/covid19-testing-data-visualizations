<script>
	import { onMount } from 'svelte'
	import { csv } from "d3-fetch"

	import { testUrl, methodsUrl, getNickname, steps, parseStep, parseTime, getOrdinalLevel, ordinalLevels, parseLocation,parseDate, formatDate } from "./data-utils"
	import { flatten, getUrlParams } from "./utils"
	import Steps from "./Steps.svelte"
	import Timeline from "./Timeline.svelte"
	import TestsTable from "./TestsTable.svelte"
	import Clusters from "./Clusters.svelte"

	let tests = []
	let methods = []
	let sections = ["steps"]
	let missingMethods = []
	let activeTest = null

	onMount(() => {
		const urlParams = getUrlParams()
		sections = urlParams["section"] ? urlParams["section"].split(",") : ["steps"]

		csv(testUrl)
			.then(res => {
				const parsedData = res.map(d => ({
					// ...d,
					name: d["Test Name"],
					nickname: getNickname(d["Test Name"]),
					date: d["Date of EUA"],
					summary: d["Diagnostic Summary"],
					time: parseTime(d["Time (Estimated)"]),
					cost: getOrdinalLevel(d["Cost"]),
					location: parseLocation(d["Centralized/POC"]),
					approvals: d["Approvals"],
					training: d["Training Requirements"],
					notes: d["Notes"],
					steps: steps.map((stepName, i) => (
						parseStep(d[stepName], i)
					)),
					unparsedSteps: steps.map((stepName, i) => (
						d[stepName]
					)),
				})).sort((a,b) => parseDate(b.date) - parseDate(a.date))
				tests = parsedData
				console.log(res, tests)
			})
		csv(methodsUrl)
			.then(res => {
				const parsedData = res.map(d => ({
					// ...d,
					name: d["Feature Name"],
					description: d["Descriptive Blurb"],
					links: d["Authoritative Links"],
					stepIndex: steps.indexOf(d["Step"]),
					time: parseTime(d["Time"]),
					cost: getOrdinalLevel(d["Cost"]),
					sensitivity: getOrdinalLevel(d["Sensitivity"]),
					location: d["Centralized/POC"] == "-" ? null : d["Centralized/POC"],
					approvals: d["Approvals"],
					training: d["Training Requirements"] == "no",
					equipment: d["Equipment Requirements"],
					otherSteps: d["Required other steps"],
					notes: d["Notes"],
				}))
				methods = parsedData
				console.log(res, methods)
			})
	})

	const updateMethods = () => {
		if (!tests.length || !methods.length) return

		missingMethods = steps.map((step, i) => ([
			...new Set(
				flatten(
					tests.map(({ steps }) => steps[i])
				)
			)
		].filter(d => (
			!methods.filter(({ stepIndex }) => (
				stepIndex == i
			)).map(d => d.name.toLowerCase()).includes(d)
		))))

		methods = methods.map(method => ({
			...method,
			numTimesUsed: tests.filter(({ steps }) => (
				steps[method.stepIndex].includes(method.name.toLowerCase())
			)).length,
		}))
	}

	$: tests, methods, updateMethods()

	$: activeSteps = !activeTest ? null : activeTest.steps
</script>

<main>
	{#if sections.includes("timeline")}
		<Timeline data={tests} />
	{/if}

	{#if sections.includes("table")}
		<TestsTable data={tests} />
	{/if}

	{#if sections.includes("scatter")}
		<Clusters data={tests} />
	{/if}

	{#if sections.includes("steps")}
		<div class="test-list">
			<div class="steps">
				<Steps {methods} {missingMethods} {activeSteps} />
			</div>

			<div class="list">
				<div class="tests">
					{#each tests as test}
						<div
							class="test"
							class:active={activeTest == test}
							on:mouseenter={() => activeTest = test}>
							{ test.name }
						</div>
					{/each}
				</div>
				{#if activeTest}
					<div class="test-info">
						<h3>
							{ activeTest.name }
							<div class="infos">
								<div class="info">
									{#if activeTest.cost}
										{#each new Array(activeTest.cost || 0).fill(0) as _}
											$
										{/each}
									{/if}
								</div>
							</div>
						</h3>
						<p>
							{ activeTest.summary }
						</p>
						{#if activeTest.date}
							<h6>EUA Approval Date</h6>
							<div class="date">{ formatDate(parseDate(activeTest.date)) }</div>
						{/if}
						{#if activeTest.notes}
							<h6>Notes</h6>
							<p>
								{ activeTest.notes }
							</p>
						{/if}
						<h6>Steps</h6>
						<div class="steps">
							{#each activeTest.unparsedSteps as step, i}
								<div class="step">
									<div class="step-index">
										{ i + 1 }
									</div>
									<div class="step-text">
										{#if step}
											{ step }
										{:else}
											<i>no information available</i>
										{/if}
									</div>
								</div>
							{/each}
						</div>
						<h6>Processing Time</h6>
						<p>
							{#if activeTest.time[2]}
								{ activeTest.time[2] }
							{:else}
								<i>no information available</i>
							{/if}
						</p>
					</div>
				{/if}
			</div>

		</div>
	{/if}

</main>

<style>
	@import url('https://rsms.me/inter/inter.css');

	:global(*) {
		box-sizing: border-box;
	}
	:global(body) {
		color: #3A3253;
		font-family: 'Inter', sans-serif;
	}
	:global(h6) {
		margin: 0.6em 0;
		font-size: 0.8em;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.test-list {
		display: flex;
		align-items: flex-start;
		/* margin-bottom: 6px; */
		/* height: 100%; */
		/* overflow: hidden; */
	}

	.list {
		flex: 0 0 20em;
		height: 100vh;
		display: flex;
		width: 20em;
		flex-direction: column;
	}
	.tests {
		flex: 1;
		padding: 1em;
		padding-bottom: 3em;
		overflow: auto;
	}

	.test {
		padding: 0.6em 1.6em;
		font-size: 0.9em;
		cursor: pointer;
	}
	.test:hover {
		background: #E1DCE4;
	}
	.test.active {
		background: #E1DCE4;
	}
	.steps {
		flex: 1;
		/* position: sticky; */
		/* top: 0; */
    align-self: flex-start;
		/* padding: 0 3em; */

		max-width: 96%;
    max-height: 100vh;
    overflow: auto;
	}
	.test-info {
		position: fixed;
		bottom: 2em;
		right: 2em;
		margin-bottom: 1px;
		max-width: 30em;
		max-height: 20em;
		height: 40em;
		padding: 0.6rem 1.6rem;
		background: #3A3253;
		color: #E1DCE4;
		font-size: 0.8em;
		overflow: auto;
	}
	.test-info .date {
		margin-bottom: 0.6em;
	}
	:global(body) {
		padding: 0;
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
	.test-info .steps {
		margin-bottom: 1.5em;
	}
	.step {
		display: flex;
		margin-bottom: 0.6em;
	}
	.step-index {
    margin-left: -4.2em;
		margin-right: 0.6em;
    opacity: 0.5;
	}
	i {
		font-style: italic;
		opacity: 0.6;
	}
</style>