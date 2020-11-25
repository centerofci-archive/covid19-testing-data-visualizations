<script>
  export let highlighted = false;
  export let x = 0;
  export let y = 0;
  export let text = "";
  export let color = "blue";
  export let size = 20;
  export let mouseenter = () => {};
  export let mouseleave = () => {};

  const extra = () => size * (highlighted ? 0.1 : 0)
  const x1 = () => x - extra()
  const y1 = () => y - extra()
  const x2 = () => x + size + extra()
  const y2 = () => y + size + extra()
</script>

<g
  on:mouseenter={mouseenter}
  on:mouseleave={mouseleave}
>
  <path
    d="M{x1()} {y1()} {x2()} {y1()} {x2()} {y2()} {x1()} {y2()} z"
    stroke="{color}"
    stroke-width="5"
    stroke-linecap="square"
    stroke-linejoin="round"
    fill="{color}"
  ></path>
  <text
    x={x + 10 + size}
    y={y + 5 + size / 2}
    class={highlighted ? "highlighted" : ""}
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
  text.highlighted
  {
    font-weight: bold;
  }
</style>
