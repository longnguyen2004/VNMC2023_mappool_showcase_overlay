import pDebounce from "p-debounce";
import { writable, readonly, get } from "svelte/store";
import { MD5 } from "object-hash";

import { companion, changes } from "./companion";

let bg: Record<string, string | undefined> = {};
let store = writable(bg);

const getBg = async (osuFile: string) => {
    const path = osuFile.slice(osuFile.indexOf("Songs")).replaceAll("\\", "/");
    const directory = path.slice(0, path.lastIndexOf("/"));
    const file = await fetch("http://localhost:20727/" + path).then(res => res.text());
    const match = file.match(/0,0,"(.+?)",0,\d+/);
    if (match)
        return `http://localhost:20727/${directory}/${match[1]}`;
    else
        return undefined;
};

const cacheBg = pDebounce(async () => {
    const {
        osuFileLocation: osuFile,
        titleRoman: title,
        artistRoman: artist,
        creator: mapper,
        diffName: difficulty
    } = get(companion)!;
    const hash = MD5({ title, artist, mapper, difficulty }); // We use this hash, since there's no MD5 in config.json
    if (hash in bg) return;
    console.log(hash);
    store.set(bg = { ...bg, [hash]: await getBg(osuFile!) });
}, 100);

changes.subscribe(obj => {
    if (!obj) return;
    if (!("md5" in obj)) return; // Map didn't change, return
    cacheBg();
});

export const bgStore = readonly(store);