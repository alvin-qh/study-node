
export function makeUniqueSymbol(name) {
    return Symbol(name)
}

export function makeNamedSymbol(name) {
    return Symbol.for(name)
}