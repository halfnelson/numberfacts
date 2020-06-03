export function shuffle(inp) {
    // https://en.wikipedia.org/wiki/Fisher–Yates_shuffle
    let out = inp.slice();
    for (let i=0; i < inp.length; i++) {
        let swapWith = Math.floor(Math.random() * inp.length);
        let tmp = out[swapWith]
        out[swapWith] = out[i]
        out[i] = tmp;
    }
    return out;
}
