<script>
	import { onMount } from 'svelte'

	import { context, grabCsv, corsBase, testUrl, methodsUrl, getNickname, steps, parseStep, parseTime, getOrdinalLevel, ordinalLevels, parseLocation, parseDate, formatDate } from "./data-utils"
	import { flatten, getUrlParams } from "./utils"
	import Icon from "./Icon.svelte"
	import Steps from "./Steps.svelte"
	import Timeline from "./Timeline.svelte"
	import TestsTable from "./TestsTable.svelte"
	import Clusters from "./Clusters.svelte"
	import TestInfo from "./TestInfo.svelte"
	import EUASequences from "./EUASequences.svelte"
	import EUA_LOD_units from "./EUA_LOD_units.svelte"

	let tests = []
	let methods = []
	let sections = ["steps"]
	let missingMethods = []
	let activeTest = null
	let title = null
	let caption = null

	onMount(async () => {
		const urlParams = getUrlParams()
		sections = urlParams["section"] ? urlParams["section"].split(",") : ["steps"]
		const contextData = sections.length > 1 ? {} : context[sections[0]] || {}
		title = contextData.title
		caption = contextData.caption

		let testResponse = await grabCsv(testUrl)
		tests = testResponse.map(d => ({
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
		// console.log(testResponse, tests)

		let methodsResponse = await grabCsv(methodsUrl)
		methods = methodsResponse.map(d => ({
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
		// console.log(methodsResponse, methods)
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
	{#if title}
		<div class="title">
			<h2>{ title }</h2>
		</div>
	{/if}
	<div class="main">
		{#if sections.includes("eua_sequences")}
			<EUASequences />
		{/if}

		{#if sections.includes("eua_lod_units")}
			<EUA_LOD_units />
		{/if}

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
						<h6 class="list-title">Tests</h6>
						{#each tests as test}
							<div
								class="test"
								class:active={activeTest == test}
								on:mouseenter={() => activeTest = test}>
								{ test.name }
							</div>
							{#if activeTest && activeTest == test}
								<div class="test-info--inline">
									<TestInfo test={activeTest} onClose={() => activeTest = null} isInline />
								</div>
							{/if}
						{/each}
					</div>
					{#if activeTest}
						<div class="test-info">
							<TestInfo test={activeTest} onClose={() => activeTest = null} />
						</div>
					{/if}
				</div>

			</div>
		{/if}
	</div>

	{#if caption}
		<div class="caption">{@html caption }</div>
	{/if}
</main>

<style>
	@import url('https://rsms.me/inter/inter.css');

	:global(*) {
		box-sizing: border-box;
	}
	:global(body) {
		padding: 0;
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
		flex-direction: column;
		max-height: 100vh;
		overflow: hidden;
	}

	.title {
		flex: 0 0 1rem;
		padding: 1rem 1.6rem;
		border-bottom: 1px solid;
		max-width: 1050px;
    margin: 0 auto;
    width: 100%;
	}
	.title h2 {
		margin: 0;
		padding: 0;
	}
	.main {
		flex: 3;
		/* overflow: auto; */
		display: flex;
		overflow: hidden;
	}
	.caption {
		flex: 0 0 2rem;
		padding: 1rem 1.6rem;
		font-weight: 500;
		font-size: 0.7em;
		line-height: 1.3em;
		background: #f4f4f4;
		border-top: 1px solid;
		max-width: 1050px;
    margin: 0 auto;
    width: 100%;
	}

	.test-list {
		display: flex;
		align-items: flex-start;
		font-size: 0.8em;
		margin: 0 auto;
		/* margin-bottom: 6px; */
		/* height: 100%; */
		/* overflow: hidden; */
	}

	.list {
		position: relative;
		flex: 0 0 20em;
		height: 100%;
		display: flex;
		width: 20em;
		flex-direction: column;
	}
	.list-title {
		padding-left: 1.7em;
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
		font-weight: 700;
	}
	.steps {
		flex: 1;
		/* position: sticky; */
		/* top: 0; */
    align-self: flex-start;
		/* padding: 0 3em; */

		max-width: 96%;
    max-height: 100vh;
		height: 100%;
    overflow: auto;
	}
	.test-info {
		display: flex;
		justify-content: flex-end;
		align-items: flex-end;
		position: fixed;
		bottom: 8em;
		right: 33em;
		margin-bottom: 1px;
		width: 30em;
		max-height: 50vh;
		height: 40em;
	}
	.test-info--inline {
		display: none;
	}
	@media (max-width: 820px) {
		.test-info {
			display: none;
		}
		.test-info--inline {
			display: block;
		}
	}
	@media (max-width: 800px) {
		.test-list {
			width: 100%;
		}
		.tests {
			padding-left: 0;
		}
		.test-info {
			display: none;
		}
		.test-info--inline {
			display: block;
		}
	}
</style>