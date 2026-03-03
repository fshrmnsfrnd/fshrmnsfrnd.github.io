export function startTicker(fn, ms = 1000) {
    const id = setInterval(fn, ms);
    return () => clearInterval(id);
}

export function formatNumber(n, digits = 0) {
    return Number(n).toFixed(digits);
}