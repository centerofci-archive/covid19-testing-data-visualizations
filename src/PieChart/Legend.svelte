<script>
	import { tweened } from 'svelte/motion'
	import { cubicOut } from 'svelte/easing'

  export let highlighted = false
  export let x = 0
  export let y = 0
  export let text = ""
  export let color = "blue"
  export let size = 20
  export let mouseenter = () => {}
  export let mouseleave = () => {}

  const max_ratio = 0.1

  const highlight_ratio = tweened(0, {
		duration: 200,
		easing: cubicOut
  })

  $: {
    highlight_ratio.set(highlighted ? max_ratio : 0)
  }

  $: extra = size * $highlight_ratio
  $: x1 = x - extra
  $: y1 = y - extra
  $: x2 = x + size + extra
  $: y2 = y + size + extra

  $: font_color = ((max_ratio - $highlight_ratio) / max_ratio) * 120
</script>

<g
  on:mouseenter={mouseenter}
  on:mouseleave={mouseleave}
>
  <path
    d="M{x1} {y1} {x2} {y1} {x2} {y2} {x1} {y2} z"
    stroke="{color}"
    stroke-width="5"
    stroke-linecap="square"
    stroke-linejoin="round"
    fill="{color}"
  ></path>
  <text
    x={x + 10 + size}
    y={y + 5 + size / 2}
    fill={`rgb(${font_color}, ${font_color}, ${font_color})`}
  >
    {@html text}
  </text>
</g>

<style>
  text {
    text-anchor: start;
    font-size: 0.8em;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: default;
  }
</style>
