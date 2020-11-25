<script>
  export let x = 0;
  export let y = 0;
  export let text = "";
  export let color = "blue";
  export let size = 20;
  export let mouseenter = () => {};
  export let mouseleave = () => {};
</script>

<g
  on:mouseenter={mouseenter}
  on:mouseleave={mouseleave}
>
  <path
    d="M{x} {y} {x + size} {y} {x + size} {y + size} {x} {size + y} z"
    stroke="{color}"
    stroke-width="5"
    stroke-linecap="square"
    stroke-linejoin="round"
    fill="{color}"
  ></path>
  <text
    x={x + 10 + size}
    y={y + 5 + size / 2}
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
    pointer-events: none;
  }
</style>
