<script>
  export let highlighted = false;
  export let x = 0;
  export let y = 0;
  export let text = "";
  export let color = "blue";
  export let size = 20;
  export let mouseenter = () => {};
  export let mouseleave = () => {};

  const extra = (highlighted) => size * (highlighted ? 0.1 : 0)
  const x1 = (highlighted) => x - extra(highlighted)
  const y1 = (highlighted) => y - extra(highlighted)
  const x2 = (highlighted) => x + size + extra(highlighted)
  const y2 = (highlighted) => y + size + extra(highlighted)
</script>

<g
  on:mouseenter={mouseenter}
  on:mouseleave={mouseleave}
>
  <path
    d="M{x1(highlighted)} {y1(highlighted)} {x2(highlighted)} {y1(highlighted)} {x2(highlighted)} {y2(highlighted)} {x1(highlighted)} {y2(highlighted)} z"
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
    cursor: default;
  }
  text.highlighted
  {
    font-weight: bold;
  }
</style>
