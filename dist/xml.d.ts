/**
 * Sets the contents of a container by transforming XML via XSLT.
 * @param container {Element} Container to set the contens for.
 * @param xml {string} Input XML.
 * @param xslt {string} XSLT transform to use.
 */
declare function setContentsUsingXslt(container: Element, xml: string, xslt: string): void;
export { setContentsUsingXslt };
