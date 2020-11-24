<script>
    export let begin = 0;
    export let radius = 10;
    export let ratio = 1;
    export let color = "blue";

    const fudge = 1
</script>

<circle r="{radius / 2}" cx="0" cy="0" fill="none"
    stroke="{color}"
    stroke-width="{radius}"
    stroke-dasharray="{(ratio * Math.PI * radius) + fudge} {Math.PI * radius}"
    transform="rotate({begin * 360})"/>`
