<script>
  import { tweened } from 'svelte/motion'
  import { cubicOut } from 'svelte/easing'

  export let highlighted = false;
  export let begin = 0;
  export let radius = 10;
  export let ratio = 1;
  export let color = "blue";
  export let mouseenter = () => {};
  export let mouseleave = () => {};

  const computedRadius = tweened(radius, {
		duration: 200,
		easing: cubicOut
  })

  $: diameter = $computedRadius * 2

  $: {
    computedRadius.set((highlighted ? 1.05 : 1) * radius)
  }

  const fudge = 1
</script>

<circle
  r="{$computedRadius}"
  cx="0"
  cy="0"
  fill="none"
  stroke="{color}"
  stroke-width="{diameter}"
  stroke-dasharray="{(ratio * Math.PI * diameter) + fudge} {Math.PI * diameter}"
  transform="rotate({begin * 360})"
  on:mouseenter={mouseenter}
  on:mouseleave={mouseleave}
/>
