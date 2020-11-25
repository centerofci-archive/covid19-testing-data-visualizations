<script>
  export let highlighted = false;
  export let begin = 0;
  export let radius = 10;
  export let ratio = 1;
  export let color = "blue";
  export let mouseenter = () => {};
  export let mouseleave = () => {};

  const fudge = 1
</script>

<circle
  r="{radius / 2}"
  cx="0"
  cy="0"
  fill="none"
  stroke="{color}"
  stroke-width="{radius * (highlighted ? 1.05 : 1)}"
  stroke-dasharray="{(ratio * Math.PI * radius) + fudge} {Math.PI * radius}"
  transform="rotate({begin * 360})"
  on:mouseenter={mouseenter}
  on:mouseleave={mouseleave}
/>
