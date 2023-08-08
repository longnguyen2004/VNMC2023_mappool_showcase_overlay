import anime from "animejs";
import pDebounce from "p-debounce";
import { tweened } from "svelte/motion";
import { linear } from "svelte/easing";
import type { Action } from "svelte/action";
import type { EasingFunction } from "svelte/transition";

type AutoscrollParams = {
    axis: "x" | "y",
    speed?: number,
    delay?: number,
    easing?: EasingFunction,
    fromEnd?: boolean;
    pingPong?: boolean;
};

export const autoscroll = ((node, {
    axis, speed = 50, delay = 2000, easing = linear, fromEnd = false, pingPong = true
}) => {
    function setScroll(pos: number) {
        axis === "x" ? (node.scrollLeft = pos) : (node.scrollTop = pos);
    }

    if (axis === "x")
        node.style.overflowX = "hidden";
    else
        node.style.overflowY = "hidden";

    let stop = false;
    let delayTimer: number;
    const scrollPosition = tweened<number>(0, { easing });
    const unsubscribe = scrollPosition.subscribe(setScroll);
    const init = pDebounce(() => {
        clearTimeout(delayTimer);
        const scrollRange = axis === "x"
            ? node.scrollWidth - node.clientWidth
            : node.scrollHeight - node.clientHeight;
        scrollPosition.set(fromEnd ? scrollRange : 0, { duration: 0 });
        function updatePosition(reverse: boolean) {
            if (scrollRange === 0) return;
            if (pingPong)
            {
                delayTimer = setTimeout(async () => {
                    await scrollPosition.set(reverse ? 0 : scrollRange,
                        { duration: scrollRange / speed * 1000 }
                    );
                    if (stop) return;
                    updatePosition(!reverse);
                }, delay);
            }
            else
            {
                delayTimer = setTimeout(async () => {
                    await scrollPosition.set(reverse ? 0 : scrollRange,
                        { duration: scrollRange / speed * 1000 }
                    );
                    if (stop) return;
                    await anime({
                        targets: node,
                        opacity: ["100%", "0%"],
                        duration: 500,
                        easing: "linear"
                    }).finished;
                    if (stop) return;
                    await scrollPosition.set(!reverse ? 0 : scrollRange,
                        { duration: 0 }
                    );
                    if (stop) return;
                    await new Promise(resolve => setTimeout(resolve, delay / 2));
                    if (stop) return;
                    await anime({
                        targets: node,
                        opacity: ["0%", "100%"],
                        duration: 500,
                        easing: "linear"
                    }).finished;
                    if (stop) return;
                    updatePosition(reverse);
                }, delay / 2);
            }
        }
        updatePosition(fromEnd);
    }, 100);
    init();
    const resizeObserver = new ResizeObserver(init);
    resizeObserver.observe(node);
    for (const child of node.children)
        resizeObserver.observe(child);

    const mutationObserver = new MutationObserver((list) => {
        init();
        for (const elem of list) {
            for (const node of elem.addedNodes)
                node instanceof Element && resizeObserver.observe(node);
            for (const node of elem.removedNodes)
                node instanceof Element && resizeObserver.unobserve(node);
        }
    });
    mutationObserver.observe(node, { characterData: true, childList: true });

    return {
        destroy() {
            stop = true;
            unsubscribe();
            clearTimeout(delayTimer);
            resizeObserver.disconnect();
            mutationObserver.disconnect();
        }
    };
}) satisfies Action<HTMLElement, AutoscrollParams>;
