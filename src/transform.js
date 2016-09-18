/*
 * Sets the contents of a container by transforming XML via XSLT.
 * @container {Element} Container to set the contens for.
 * @xml {string} Input XML.
 * @xslt {string} XSLT transform to use.
 */
function setContentsUsingXslt(container, xml, xslt) {
    if (window.ActiveXObject || "ActiveXObject" in window) {
        var xsltDoc = new ActiveXObject("Microsoft.xmlDOM");
        xsltDoc.async = false;
        xsltDoc.loadXML(xslt);

        var xmlDoc = new ActiveXObject("Microsoft.xmlDOM");
        xmlDoc.async = false;
        xmlDoc.loadXML(xml);

        var result = xmlDoc.transformNode(xsltDoc)
        container.innerHTML = result;
    } else if (document.implementation && document.implementation.createDocument) {
        var parser = new DOMParser()
        xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(parser.parseFromString(xslt, "text/xml"));
        var result = xsltProcessor.transformToFragment(parser.parseFromString(xml, "text/xml"), document);
        container.innerHTML = '';
        container.appendChild(result);
    }
}

module.exports.setContentsUsingXslt = setContentsUsingXslt;