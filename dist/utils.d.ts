/**
 * Finds the first ancestor that has the given class name.
 * @param element Element to search.
 * @param className Class name to search for.
 */
declare function findAncestor(element: Element, className: string): Element;
/**
 * Finds the first ancestor that matches the given predicate.
 * @param element Element to search.
 * @param predicate Predicate for the ancestor to find.
 */
declare function findAncestorP(element: Element, predicate: (e: Element) => boolean): Element;
declare function hasClass(element: Element, cls: string): boolean;
export { findAncestor, findAncestorP, hasClass };
