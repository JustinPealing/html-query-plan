function findAncestor(element: Element, className: string) {
    if (element === null) {
        return null;
    }
    while ((element = element.parentElement) && element && !hasClass(element, className));
    return element;
}

function hasClass(element: Element, cls: string) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

export { findAncestor, hasClass }