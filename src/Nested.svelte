<script>
	export let name = "Ready";
	export let mouseenter = () => {};
	export let mouseleave = () => {};
</script>

<h1 on:mouseenter={mouseenter} on:mouseleave={mouseleave}>Hello {name}!</h1>
