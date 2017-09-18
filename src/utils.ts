/**
 * 
 * @param element 
 * @param className 
 */
export function findAncestor(element: HTMLElement, className: string): HTMLElement {
    if (element === null) {
        return null;
    }
    while ((element = element.parentElement) && element && !hasClass(element, className));
    return element;
}

/**
 * 
 * @param element 
 * @param cls 
 */
export function hasClass(element: HTMLElement, cls: string): boolean {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}
