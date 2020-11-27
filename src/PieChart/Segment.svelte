<script>
  export let highlighted = false;
  export let begin = 0;
  export let radius = 10;
  export let ratio = 1;
  export let color = "blue";
  export let mouseenter = () => {};
  export let mouseleave = () => {};

  const radius_highlighted = radius * 1.05;

  const _radius = {
    [false]: radius,
    [true]: radius_highlighted,
  }

  const _diameter = {
    [false]: radius * 2,
    [true]: radius_highlighted * 2,
  }

  const fudge = 1
</script>

<circle
  r="{_radius[highlighted]}"
  cx="0"
  cy="0"
  fill="none"
  stroke="{color}"
  stroke-width="{_diameter[highlighted]}"
  stroke-dasharray="{(ratio * Math.PI * _diameter[highlighted]) + fudge} {Math.PI * _diameter[highlighted]}"
  transform="rotate({begin * 360})"
  on:mouseenter={mouseenter}
  on:mouseleave={mouseleave}
/>
