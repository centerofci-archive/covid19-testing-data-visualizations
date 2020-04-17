<script>
	import { onMount } from 'svelte'
	import { csv } from "d3-fetch"

	import { testUrl, methodsUrl, steps, parseStep, ordinalLevels, parseDate, formatDate } from "./data-utils"
	import { flatten } from "./utils"
	import Steps from "./steps.svelte"


	let tests = []
	let methods = []
	let missingMethods = []
	let activeTest = null

	const getLevel = str => {
		const index = ordinalLevels.indexOf(str)
		return index == -1 ? null : index
	}

	onMount(() => {
		csv(testUrl)
			.then(res => {
				const parsedData = res.map(d => ({
					// ...d,
					name: d["Test Name"],
					date: d["Date of EUA"],
					summary: d["Diagnostic Summary"],
					time: d["Time (Estimated)"],
					cost: getLevel(d["Cost (high, medium or low)"]),
					location: d["Centralized/POC"],
					approvals: d["Approvals"],
					training: d["Training Requirements"],
					notes: d["Notes"],
					steps: steps.map((stepName, i) => (
						parseStep(d[stepName], i)
					)),
					unparsedSteps: steps.map((stepName, i) => (
						d[stepName]
					)),
				}))
				tests = parsedData
				console.log(res, tests)
			})
		csv(methodsUrl)
			.then(res => {
				const parsedData = res.map(d => ({
					// ...d,
					name: d["Feature Name"],
					stepIndex: steps.indexOf(d["Step"]),
					time: d["Time"],
					cost: getLevel(d["Cost"]),
					sensitivity: getLevel(d["Sensitivity"]),
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
		console.log(missingMethods)

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
				{#if activeTest.date}
					<div class="date">{ formatDate(parseDate(activeTest.date)) }</div>
				{/if}
				<p>
					{ activeTest.summary }
				</p>
				<h6>Notes</h6>
				<p>
					{ activeTest.notes }
				</p>
				<h6>Steps</h6>
				<p>
					{ activeTest.steps.join(", ") }
				</p>
				<h6>Time</h6>
				<p>
					{ activeTest.time }
				</p>
			</div>
		{/if}
	</div>

	<div class="steps">
		<Steps {methods} {missingMethods} {activeSteps} />
	</div>

</main>

<style>
	@import url('https://rsms.me/inter/inter.css');

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

	main {
		display: flex;
		align-items: flex-start;
		margin-bottom: 6px;
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
		padding: 0 3em;
	}
	.test-info {
		margin-bottom: 1px;
		width: 100%;
		height: 30em;
		padding: 0.6rem 1.6rem;
		font-size: 0.8em;
		background: #3A3253;
		color: #E1DCE4;
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
</style>