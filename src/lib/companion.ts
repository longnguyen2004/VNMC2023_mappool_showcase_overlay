import ReconnectingWebSocket from "reconnecting-websocket";
import { readonly, writable, derived } from "svelte/store";
import { GameStates } from "./types";
import type { SCObject } from "./types";

const tokens = [
    "status", "osuIsRunning", "time", "mapKiaiPoints",
    "artistRoman", "titleRoman", "creator", "diffName", "username", "drainingtime", "md5",
    "osuFileLocation", "osuFileName",
    "mStars", "mHP", "mOD", "mBpm"
] as const satisfies readonly (keyof SCObject)[];
type SCObjectPicked = Pick<SCObject, typeof tokens[number]>;

const store = writable<SCObjectPicked | null>(null);
const storeMsg = writable<SCObjectPicked | null>(null);

let cache: SCObjectPicked | null = null;
const conn = new ReconnectingWebSocket("ws://localhost:20727/tokens?bulkupdates=MainPipeline", "", {
    minReconnectionDelay: 1000,
    maxReconnectionDelay: 1000
});
conn.onopen = () => {
    conn.send(JSON.stringify(tokens))
    store.set(cache = {});
};
conn.onclose = () => store.set(cache = null);
conn.onmessage = (e) => {
    const newData = JSON.parse(e.data) as SCObjectPicked;
    !(Object.keys(newData).length === 1 && ("time" in newData)) && console.log(newData);
    if ("status" in newData && [GameStates.Playing, GameStates.Watching].includes(newData.status!)) {
        // Explicitly set time to -Infinity, because SC didn't reset it properly
        newData.time = -Infinity;
    }
    store.set(cache = { ...cache, ...newData });
    storeMsg.set(newData); // order matters
};

export const companion = readonly(store);
export const changes = readonly(storeMsg);
export const isPlaying = derived(companion,
    (values) => values?.status && [GameStates.Playing, GameStates.Watching].includes(values.status)
);
