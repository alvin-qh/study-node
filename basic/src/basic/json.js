/**
 * 将json字符串解析为对象
 */
export function fromJson(json) {
    return JSON.parse(json);
}

/**
 * 将对象
 * @param json
 * @returns {any}
 */
export function fromJson_es5(json) {
    return eval(`(${json})`);
}

export function toJson(obj) {
    return JSON.stringify(obj);
}
