export function clone(src) {
    let target = {};
    for (let prop in src) {
        if (src.hasOwnProperty(prop)) {
            target[prop] = src[prop];
        }
    }
    return target;
}

export function isEmpty(obj) {
    return Object.keys(obj).length === 0
}