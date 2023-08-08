import { array, object, union, literal, string, number, useDefault } from "valibot";
import { parse } from "jsonc-parser";

const validator = object({
    tb_duration: useDefault(number(), 3000),
    mappool: array(
        object({
            category: union([
                literal("RC"),
                literal("HB"),
                literal("LN"),
                literal("SV"),
                literal("TB")
            ]),
            title: string(),
            artist: string(),
            mapper: string(),
            difficulty: string()
        })
    )
});


export const config = await fetch(`./config.jsonc?t=${Date.now()}`) // cache busting
    .then(res => res.text())
    .then(text => parse(text))
    .then(obj => validator.parse(obj));

console.log("Configuration:\n", config);
