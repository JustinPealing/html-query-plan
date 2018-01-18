/**
 * Sets the contents of a container by transforming XML via XSLT.
 * @param container Container to set the contens for.
 * @param xml Input XML.
 * @param xslt XSLT transform to use.
 */
export function setContentsUsingXslt(container: HTMLElement, xml: string, xslt: string) {
    if (window.ActiveXObject || "ActiveXObject" in window) {
        let xsltDoc = new ActiveXObject("Microsoft.xmlDOM");
        xsltDoc.async = false;
        xsltDoc.loadXML(xslt);

        let xmlDoc = new ActiveXObject("Microsoft.xmlDOM");
        xmlDoc.async = false;
        xmlDoc.loadXML(xml);

        let result = xmlDoc.transformNode(xsltDoc)
        container.innerHTML = result;
    } else if (document.implementation && document.implementation.createDocument) {
        let parser = new DOMParser();
        let xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(parser.parseFromString(xslt, "text/xml"));
        let result = xsltProcessor.transformToFragment(parser.parseFromString(xml, "text/xml"), document);
        container.innerHTML = '';
        container.appendChild(result);
    }
}
