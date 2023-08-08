<script lang="ts">
    import { companion, isPlaying } from "../lib/companion";
    import { formatMillis, parseIntWithFallback } from "../lib/utils";
    import { autoscroll } from "../actions/autoscroll";
    import { onMount } from "svelte";
    import { slide } from "svelte/transition";
    import { backOut, backIn } from "svelte/easing";

    import Logo from "../assets/LOGO.webp";
    import DexY from "../assets/mascot1.webp";
    import Aiko from "../assets/mascot2.webp";

    const logoSlideDuration = 500;
    const infoSlideDuration = 500;
    const autoscrollParams = {
        axis: "x",
        speed: 50,
        delay: 2000,
    } as const;

    let artist: string,
        title: string,
        mapper: string,
        difficulty: string,
        length: number,
        player: string;
    let OD: number, HP: number, SR: number, BPM: string;
    $: $companion &&
        ({
            artistRoman: artist,
            titleRoman: title,
            creator: mapper,
            diffName: difficulty,
            username: player,
            drainingtime: length,
            mOD: OD,
            mHP: HP,
            mStars: SR,
            mBpm: BPM,
        } = {
            artistRoman: "N/A",
            titleRoman: "N/A",
            creator: "N/A",
            diffName: "N/A",
            username: "N/A",
            drainingtime: NaN,
            mOD: NaN,
            mHP: NaN,
            mStars: NaN,
            mBpm: "N/A",
            ...$companion,
        });

    // I don't even know why we need this, and it was working before, until it
    // suddenly doesn't. Seems like the browser doesn't parse the CSS on time, or
    // something related, which causes the logo to not pop up properly. In any
    // case, showing the overlay once will fix the issue, so I did that here
    let showGameplayHack = true;
    onMount(() => {
        setTimeout(() => (showGameplayHack = false), 1000);
    });

    const urlParams = new URLSearchParams(window.location.search);
    const startTime =
        parseIntWithFallback(urlParams.get("startTime"), 10, -Infinity) / 1000;
    const endTime =
        parseIntWithFallback(urlParams.get("endTime"), 10, Infinity) / 1000;
</script>

{#if showGameplayHack}
    <strong style="color: black">Initializing... Please wait</strong>
{/if}
{#if showGameplayHack || ($isPlaying && startTime <= ($companion?.time ?? -Infinity) && ($companion?.time ?? -Infinity) <= endTime)}
    <div
        id="image"
        in:slide={{
            easing: backOut,
            duration: logoSlideDuration,
        }}
        out:slide={{
            easing: backIn,
            delay: infoSlideDuration,
            duration: logoSlideDuration,
        }}
    >
        <img id="logo" src={Logo} alt="Logo" />
    </div>
    <section
        id="info"
        in:slide={{
            axis: "x",
            delay: logoSlideDuration,
            duration: infoSlideDuration,
        }}
        out:slide={{ axis: "x", duration: infoSlideDuration }}
    >
        <img id="dexy" class="mascot" src={DexY} />
        <div>
            <h1 class="name" use:autoscroll={autoscrollParams}>
                {title}
            </h1>
            <strong id="artist">
                Artist: {artist}
            </strong>
            <span id="difficulty">
                Difficulty: {difficulty}
            </span>
            <span id="mapper">
                Mapped by: {mapper}
            </span>
        </div>
    </section>
    <section
        id="player"
        in:slide={{
            axis: "x",
            delay: logoSlideDuration,
            duration: infoSlideDuration,
        }}
        out:slide={{ axis: "x", duration: infoSlideDuration }}
    >
        <div>
            <h1 class="name" use:autoscroll={autoscrollParams}>
                Player: {player}
            </h1>
            <strong id="star-rating">
                Star Rating: {(SR ?? 0).toFixed(2)}&star;
            </strong>
            <span>
                Length: {formatMillis(length)}&emsp;BPM: {BPM}
            </span>
            <span>
                OD: {OD}&emsp;HP: {HP}
            </span>
        </div>
        <img id="aiko" class="mascot" src={Aiko} />
    </section>
{/if}

<style lang="scss">
    @use "sass:math" as math;
    $logo-width: 15rem;
    $logo-padding: math.div($logo-width, 2) + 1.5rem;

    $mascot-size: 250px;
    $mascot-padding: math.div($mascot-size, 2) + 25px;

    section {
        position: absolute;
        bottom: 0;
        z-index: 1;
        width: 900px;
        display: flex;
        flex-direction: row;
        align-items: flex-end;

        div {
            overflow: hidden;
            white-space: nowrap;
            padding: 1rem;
            width: 100%;
            display: flex;
            flex-direction: column;
            background-color: rgba(204, 141, 132, 0.5);
            border: solid 2px rgb(255, 252, 178);
            border-bottom: 0;
        }
        &#info div {
            align-items: flex-end;
        }
    }
    #info {
        right: 50%;

        div {
            * {
                margin-left: $mascot-padding;
                margin-right: $logo-padding;
            }
            border-top-left-radius: 25px;
            border-right: 0;
        }
    }
    #player {
        left: 50%;

        div {
            * {
                margin-left: $logo-padding;
                margin-right: $mascot-padding;
            }
            border-top-right-radius: 25px;
            border-left: 0;
        }
    }

    h1 {
        font-family: "Quicksand";
        margin: 0;
        max-width: 100%;
        overflow: hidden;
    }

    #image {
        position: absolute;
        left: 50%;
        bottom: 0;
        z-index: 2;
        transform: translate(-50%, 35%);
        width: $logo-width;
        height: auto;
        overflow: hidden;

        img {
            width: 100%;
        }
    }
    .mascot {
        height: $mascot-size;
        width: $mascot-size;
        object-fit: contain;
    }
    #dexy {
        transform: translateX(50%);
    }
    #aiko {
        transform: translateX(-50%);
    }
</style>
