<script lang="ts" context="module">
    import { companion, isPlaying } from "../lib/companion";
    import { GameStates } from "../lib/types";
    import { MD5 } from "object-hash";
    import { writable } from "svelte/store";

    let opened: Record<string, boolean> = {};
    const openedStore = writable(opened);

    companion.subscribe((obj) => {
        if (!obj) return;
        if (!(obj.status === GameStates.ResultsScreen)) return;
        const {
            titleRoman: title,
            artistRoman: artist,
            creator: mapper,
            diffName: difficulty,
        } = obj;
        openedStore.set(
            (opened = {
                ...opened,
                [MD5({ title, artist, mapper, difficulty })]: true,
            })
        );
    });
</script>

<script lang="ts">
    import Particles from "svelte-particles";
    import { loadFull } from "tsparticles";

    import MapInfoCard from "../components/MapInfoCard.svelte";
    import TbMapInfoCard from "../components/TbMapInfoCard.svelte";
    import { bgStore } from "../lib/bgStore";
    import { config } from "../lib/config";
    import { containerConfig } from "../lib/particles";
    import { setContext } from "svelte";
    import { fade } from "svelte/transition";

    import type { Engine, Container } from "tsparticles-engine";

    function chunk<T>(array: T[], size: number) {
        function* range(start: number, end: number, step: number) {
            for (let i = start; i < end; i += step) yield i;
        }
        return [...range(0, array.length, size)].map((elem) =>
            array.slice(elem, elem + size)
        );
    }

    const maps = config.mappool;

    const particlesEngine = writable<Engine>();
    const particlesContainer = writable<Container | undefined>();
    setContext("particlesEngine", particlesEngine);
    setContext("particlesContainer", particlesContainer);
</script>

{#if !$isPlaying}
    <div class="wrapper">
        <Particles
            options={containerConfig}
            particlesInit={(engine) => loadFull(($particlesEngine = engine))}
            on:particlesLoaded={({ detail }) => {
                console.log(($particlesContainer = detail.particles));
            }}
        />
        <section id="mappool" transition:fade>
            <div id="non-tb">
                {#each chunk( maps.filter((el) => el.category !== "TB"), 3 ) as row}
                    <div class="map-row">
                        {#each row as map}
                            {@const { title, artist, mapper, difficulty } = map}
                            {@const hash = MD5({
                                title,
                                artist,
                                mapper,
                                difficulty,
                            })}
                            <div>
                                <MapInfoCard
                                    {...map}
                                    bg={$bgStore[hash]}
                                    opened={$openedStore[hash]}
                                />
                            </div>
                        {/each}
                    </div>
                {/each}
            </div>
            <div id="tb">
                <span>
                    TIEBREAKERTIEBREAKERTIEBREAKERTIEBREAKERTIEBREAKERTIEBREAKERTIEBREAKERTIEBREAKERTIEBREAKER
                </span>
                {#each maps.filter((el) => el.category === "TB") as map}
                    {@const { title, artist, mapper, difficulty } = map}
                    {@const hash = MD5({ title, artist, mapper, difficulty })}
                    <div>
                        <TbMapInfoCard
                            {...map}
                            bg={$bgStore[hash]}
                            opened={$openedStore[hash]}
                        />
                    </div>
                {/each}
            </div>
        </section>
    </div>
{/if}

<style lang="scss">
    .wrapper {
        position: fixed;
        width: 100%;
        height: 100%;
        background: rgba(28, 28, 28, 0.83) url("../assets/bg.png");
        background-blend-mode: darken;
        background-size: cover;
    }
    #mappool {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .map-row {
        display: flex;
        flex-direction: row;
        justify-content: center;

        width: 100%;
        height: 7.5rem;
        gap: 0.5rem;
        > div {
            width: 30%;
        }
    }
    #non-tb {
        margin: 50px 0 0 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    #tb {
        position: relative;
        padding: 0 0 75px 0;
        background-image: linear-gradient(
            rgba(124, 39, 39, 0),
            rgba(124, 39, 39, 0.25)
        );
        > div {
            margin: 0 auto;
            width: 30%;
            height: 7.5rem;
        }
        span {
            position: absolute;
            left: 50%;
            top: 0;
            transform: translate(-50%, -17.5%);
            font-family: "Kihim-Regular";
            font-size: 99pt;
            color: #2e2020;
            z-index: -1;
        }
    }
</style>
