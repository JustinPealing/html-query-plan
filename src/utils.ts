/**
 * Finds the first ancestor that has the given class name.
 * @param element Element to search.
 * @param className Class name to search for.
 */
function findAncestor(element: Element, className: string) {
    return findAncestorP(element, e => hasClass(e, className));
}

/**
 * Finds the first ancestor that matches the given predicate.
 * @param element Element to search.
 * @param predicate Predicate for the ancestor to find.
 */
function findAncestorP(element: Element, predicate: (e: Element) => boolean) {
    if (element === null) {
        return null;
    }
    while ((element = element.parentElement) && element && !predicate(element));
    return element;
}

function hasClass(element: Element, cls: string) {
    return (" " + element.className + " ").indexOf(" " + cls + " ") > -1;
}

export { findAncestor, findAncestorP, hasClass }