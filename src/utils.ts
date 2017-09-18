export function findAncestor(element: HTMLElement, className: string): HTMLElement {
    if (element === null) {
        return null;
    }
    while ((element = element.parentElement) && element && !hasClass(element, className));
    return element;
}

export function hasClass(element: HTMLElement, cls: string): boolean {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}
