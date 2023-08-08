<script lang="ts">
    import anime from "animejs";
    import Fa from "svelte-fa";
    import { faLock } from "@fortawesome/free-solid-svg-icons";
    import { autoscroll } from "../actions/autoscroll";
    import { config } from "../lib/config";
    import { emitterConfig } from "../lib/particles";
    import { random, randomIntInclusive } from "../lib/utils";
    import { uid } from "uid/single";
    import { onMount, getContext } from "svelte";
    import type { Readable } from "svelte/store";
    import type { RangeValue } from "tsparticles-engine";
    import type { EmitterContainer } from "tsparticles-plugin-emitters";
    import type { EmitterInstance } from "tsparticles-plugin-emitters/types/EmitterInstance";

    export let category: string;
    export let title: string;
    export let artist: string;
    export let mapper: string;
    export let difficulty: string;
    export let bg: string | undefined = undefined;
    export let opened: boolean = false;

    function jitter(node: HTMLDivElement, range: number, duration: number) {
        let timer: number | null = null;
        function changePosition(x: number, y: number) {
            node.style.left = x + "px";
            node.style.top = y + "px";
        }
        function randomPosition() {
            changePosition(
                random(-range, range),
                random(-range, range)
            );
            timer = requestAnimationFrame(randomPosition);
        }

        return new Promise<void>((resolve) => {
            randomPosition();
            setTimeout(() => {
                timer !== null && cancelAnimationFrame(timer);
                changePosition(0, 0);
                resolve();
            }, duration);
        });
    }
    let placeholder: HTMLDivElement;
    let openedInitial = opened;
    let openedReal = opened;
    let openedBg = opened;
    $: {
        if (emitter && opened && !openedInitial && !openedReal) {
            openedReal = true;
            stopJitter();
            (async () => {
                function bumpRange(quantity: RangeValue, amount: number) {
                    if (typeof quantity === "number") return quantity + amount;
                    else
                        return {
                            min: quantity.min + amount,
                            max: quantity.max + amount,
                        };
                }

                const jitterDuration = config.tb_duration / 3;
                const { quantity: oldQuantity } = emitter.options.rate;
                const { speed: oldSpeed } = [
                    emitter.options.particles
                ].flat()[0]!.move!;
                anime({
                    targets: placeholder,
                    backgroundColor: ["#000000", "#FFFFFF"],
                    duration: 3000,
                    easing: "easeInExpo",
                });
                emitter &&
                    (emitter.options.rate.quantity = bumpRange(
                        oldQuantity,
                        10
                    )) &&
                    // @ts-expect-error Trust me, I know what's going on
                    (emitter._particlesOptions.move.speed = bumpRange(
                        oldSpeed!,
                        5
                    ));
                await jitter(placeholder, 5, jitterDuration);

                emitter &&
                    (emitter.options.rate.quantity = bumpRange(
                        oldQuantity,
                        50
                    )) &&
                    // @ts-expect-error
                    (emitter._particlesOptions.move.speed = bumpRange(
                        oldSpeed!,
                        10
                    ));
                await jitter(placeholder, 10, jitterDuration);

                emitter &&
                    (emitter.options.rate.quantity = bumpRange(
                        oldQuantity,
                        100
                    )) &&
                    // @ts-expect-error
                    (emitter._particlesOptions.move.speed = bumpRange(
                        oldSpeed!,
                        15
                    ));
                await jitter(placeholder, 15, jitterDuration);

                emitter &&
                    (emitter.options.rate.quantity = oldQuantity) &&
                    // @ts-expect-error
                    (emitter._particlesOptions.move.speed = oldSpeed);
                anime({
                    targets: placeholder,
                    opacity: 0,
                    duration: 5000,
                    easing: "easeInExpo",
                });
                openedBg = true;
            })();
        }
    }

    let raf: number;
    let posLock1 = [0, 0],
        posLock2 = [0, 0];

    const stopJitter = () => {
        posLock1 = posLock2 = [0, 0];
        cancelAnimationFrame(raf);
    };
    onMount(() => {
        const startJitter = () => {
            const dice = randomIntInclusive(0, 9);
            if (dice == 5) {
                // 1/10 chance
                posLock1 = [random(-10, 10), random(-10, 10)];
                posLock2 = [random(-10, 10), random(-10, 10)];
                raf = requestAnimationFrame(() => {
                    posLock1 = posLock2 = [0, 0];
                    raf = requestAnimationFrame(startJitter);
                });
            } else {
                raf = requestAnimationFrame(startJitter);
            }
        };
        startJitter();
        return stopJitter;
    });

    const particles = getContext(
        "particlesContainer"
    ) as Readable<EmitterContainer | undefined>;
    let particlesInited = false;
    let card: HTMLDivElement;

    let emitter: EmitterInstance;
    onMount(() => {
        let containerCache: EmitterContainer;
        let raf: number;

        const unsubscribe = particles.subscribe((container) => {
            if (!container) return;
            function calculateEmitterPosition() {
                const { x: canvasX, y: canvasY } =
                    container!.canvas.element!.getBoundingClientRect();
                const {
                    x: cardX,
                    y: cardY,
                    height: cardHeight,
                    width: cardWidth,
                } = card.getBoundingClientRect();
                return {
                    x: cardX - canvasX + cardWidth / 2,
                    y: cardY - canvasY + cardHeight / 2,
                };
            }
            function updatePosition() {
                emitter && (emitter.position = calculateEmitterPosition());
                raf = requestAnimationFrame(updatePosition);
            }
            if (particlesInited || !container || container.destroyed) return;
            particlesInited = true;
            containerCache = container;
            emitter = container.addEmitter({
                ...emitterConfig,
                name: `emitter-${uid()}`,
            });
            updatePosition();
            console.log("Created emitter\n", emitter);
        });

        return () => {
            cancelAnimationFrame(raf);
            unsubscribe();
            containerCache.removeEmitter(emitter.name);
        };
    });
</script>

<div
    class="card {openedReal ? category : ''}"
    style={bg && openedBg ? `background-image: url("${bg}")` : ""}
    bind:this={card}
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
    {/if}
    {#if !openedInitial}
        <div class="placeholder" bind:this={placeholder}>
            <div class="locks">
                <Fa icon={faLock} size="3x" style="z-index: 1" />
                <Fa
                    color="red"
                    icon={faLock}
                    size="3x"
                    style="position:absolute;top:{posLock1[0]}px;left:{posLock1[1]}px;z-index:-1"
                />
                <Fa
                    color="cyan"
                    icon={faLock}
                    size="3x"
                    style="position:absolute;top:{posLock2[0]}px;left:{posLock2[1]}px;z-index:-1"
                />
            </div>
        </div>
    {/if}
</div>

<style lang="scss">
    @use "src/styles/Card.scss" as *;
    .card {
        filter: drop-shadow(0 0 75px #7f3d3d);
    }
    .locks {
        position: relative;
        z-index: 0;
    }
</style>
