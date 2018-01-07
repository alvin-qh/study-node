/**
 * 从字符串中获取字符串和模板量的值.
 * 例如：
 *      `Hello ${a} ${b}` => strings: ['Hello ', ' ', ''] and values => [a, b]
 */
export function tag(strings, ...values) {
    return {
        strings: strings,
        values: values
    }
}