export function formatMillis(ms: number) {
    const s = Math.floor((ms / 1000) % 60);
    const m = Math.floor((ms / 60000) % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function isEmpty(obj: Record<string, unknown>) {
    for (let _ in obj)
        return false;
    return true;
}

export function parseIntWithFallback(s: string | null, radix: number, fallback: number) {
    if (!s) return fallback;
    const num = parseInt(s, radix);
    return isNaN(num) ? fallback : num;
}

export function random(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export function randomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}