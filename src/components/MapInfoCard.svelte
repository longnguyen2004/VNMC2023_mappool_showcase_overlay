<script lang="ts">
    import Fa from "svelte-fa";
    import { faLock } from "@fortawesome/free-solid-svg-icons";
    import { autoscroll } from "../actions/autoscroll";
    import { fade } from "svelte/transition";

    export let category: string;
    export let title: string;
    export let artist: string;
    export let mapper: string;
    export let difficulty: string;
    export let bg: string | undefined = undefined;
    export let opened: boolean = false;
</script>

<div
    class="card {opened ? category : ''}"
    style={bg && opened ? `background-image: url("${bg}")` : ""}
>
    {#if opened}
        <div class="info">
            <h1 use:autoscroll={{ axis: "x" }}>{artist} - {title}</h1>
            <span class="category {category}">{category}</span>
        </div>
        <div class="subinfo">
            <div class="mapper">
                <span>Mappers:&emsp;</span>
                <div use:autoscroll={{ axis: "x" }}>{mapper}</div>
            </div>
            <div class="difficulty">
                <span>Difficulty:&emsp;</span>
                <div use:autoscroll={{ axis: "x" }}>{difficulty}</div>
            </div>
        </div>
    {:else}
        <div class="placeholder" out:fade>
            <Fa icon={faLock} size="3x" />
        </div>
    {/if}
</div>

<style lang="scss">
    @use "src/styles/Card.scss" as *;
</style>
