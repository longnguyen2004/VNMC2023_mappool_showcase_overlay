<script lang="ts">
  import "./styles/fonts/satoshi/index.css";
  import "./styles/fonts/kihim/index.css";
  import "./styles/fonts/felix-titling/index.css";
  import { companion } from "./lib/companion";
  import { parseIntWithFallback } from "./lib/utils";
  import Gameplay from "./screen/Gameplay.svelte";
  import Mappool from "./screen/Mappool.svelte";

  const urlParams = new URLSearchParams(window.location.search);
  const enableMappool =
    parseIntWithFallback(urlParams.get("mappool"), 10, 0);
</script>

<main>
  {#if !$companion}
    <strong class="error">Not connected to Stream Companion!</strong>
  {:else if !$companion.osuIsRunning}
    <strong class="error">Please open osu!</strong>
  {:else}
    <Gameplay />
    {#if enableMappool}
      <Mappool />
    {/if}
  {/if}
</main>

<style>
  .error {
    color: red;
  }
</style>
