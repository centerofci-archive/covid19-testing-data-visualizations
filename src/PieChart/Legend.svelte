<script>
  export let y = 0;
  export let text = "";
  export let color = "blue";
  export let size = 20;
</script>

<path
  d="M0 {y} {size} {y} {size} {size + y} 0 {size + y} z"
  stroke="{color}"
  stroke-width="5"
  stroke-linecap="square"
  stroke-linejoin="round"
  fill="{color}"
></path>
<text x={10 + size} y={y + 5 + size / 2}>{@html text}</text>

<style>
  text {
    text-anchor: start;
    font-size: 0.8em;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    pointer-events: none;
  }

</style>