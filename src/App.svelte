<script>
	import Nested from "./Nested.svelte"

	const mouse_move = v => () => {
		selected_index = v
		console.log(selected_index)
	}

	let selected_index = 1;
</script>
{selected_index}
<Nested name={selected_index} mouseenter={mouse_move("here")} mouseleave={mouse_move("gone")}/>
