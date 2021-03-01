import { findAncestor, findAncestorP } from "./utils";

function find(nodes, type: string) {
    let returnValue = [];
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeName === type) {
            returnValue.push(nodes[i]);
        }
    }
    return returnValue;
}

function getNodeXml(queryPlanXml: Element, statementId: string, nodeId: string): Element {
    let statement = queryPlanXml.querySelector(`[StatementId="${statementId}"]`);
    if (!nodeId) return statement;
    let elements = statement.getElementsByTagName("RelOp");
    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        if (element.attributes["NodeId"] && element.attributes["NodeId"].value == nodeId) {
            return element;
        }
    }
    return null;
}

/**
 * Wraps a RelOp element in the query plan schema.
 */
class RelOp {
    constructor (readonly element: Element) {
        if (!this.element) throw new Error("element cannot be null");
        if (this.element.tagName != "RelOp") throw new Error("element must be a RelOp element");
    }

    /**
     * Gets the estimated number of nodes returned by the operation.
     */
    get estimatedRows(): number {
        return parseFloat(this.element.attributes["EstimateRows"].value);
    }

    /**
     * Gets the estimated row size in bytes.
     */
    get estimatedRowSize(): number {
        return parseInt(this.element.attributes["AvgRowSize"].value);
    }

    /**
     * Gets the estimated total size of the data.
     */
    get estimatedDataSize(): number {
        return Math.round(this.estimatedRowSize * this.estimatedRows);
    }

    /**
     * Gets an array of the RunTimeCountersPerThread elements for the RelOp, or returns an empty array if the
     * RunTimeInformation is not present.
     */
    get runtimeCountersPerThread(): Element[] {
        let runtimeInformation = find(this.element.childNodes, "RunTimeInformation");
        if (runtimeInformation.length == 0) {
            return [];
        }
        return find(runtimeInformation[0].childNodes, "RunTimeCountersPerThread");
    }

    /**
     * Gets the actual number of rows returned by the operation.
     */
    get actualRows(): number {
        return this.runtimeCountersPerThread.length == 0 ? null
            : this.runtimeCountersPerThread.reduce((a, b) => a + parseFloat(b.attributes["ActualRows"].value), 0);
    }

    /**
     * Gets the actual number of rows read.
     */
    get actualRowsRead(): number {
        return this.runtimeCountersPerThread.length == 0 || !this.runtimeCountersPerThread[0].attributes["ActualRowsRead"] ? null
            : this.runtimeCountersPerThread.reduce((a, b) => a + parseFloat(b.attributes["ActualRowsRead"].value), 0);
    }
}

/**
 * Wraps the HTML element represending a node in a query plan.
 */
class Node {
    constructor (readonly element: Element) {
        if (!this.element) throw new Error("element cannot be null");
        if (this.element.className != "qp-node") throw new Error("element must have class qp-node");
    }

    /**
     * Gets an array of child nodes.
     */
    get children(): Array<Node> {
        return [].slice.call(findAncestor(this.element, "qp-tr").children[1].children)
            .map(c => new Node(c.children[0].children[0].children[0]));
    }

    /**
     * Gets the NodeID for the wrapped query plan node, or returns null if the node doesn't have a node ID (e.g.
     * if its a top-level statement).
     */
    get nodeId(): string {
        let nodeId = this.element.attributes["data-node-id"];
        return nodeId && nodeId.value;
    }

    /**
     * Gets the statement ID of the node.
     */
    get statementId(): string {
        let statement = findAncestorP(this.element, e => e.hasAttribute("data-statement-id"));
        return statement.attributes["data-statement-id"].value;
    }

    /**
     * Gets the xml for the whole query plan.
     */
    get queryPlanXml(): Element {
        const root = findAncestor(this.element, "qp-root");
        return root == null ? null : root.parentElement["xml"];
    }

    /**
     * Gets the xml element corresponding to this node from the query plan xml.
     */
    get nodeXml(): Element {
        if (this.queryPlanXml == null) return null;
        return getNodeXml(this.queryPlanXml, this.statementId, this.nodeId);
    }

    /**
     * Gets a wrapped RelOp instance for this nodes RelOp query plan XML.
     */
    get relOp(): RelOp {
        let nodeXml = this.nodeXml;
        return nodeXml && nodeXml.tagName == "RelOp" ? new RelOp(this.nodeXml) : null;
    }
}

/**
 * Wraps a polyline element representing a line in a query plan.
 */
class Line {
    constructor (readonly element: Element) {
        if (!this.element) throw new Error("element cannot be null");
        if (this.element.nodeName != "polyline") throw new Error("element must be a polyline");
    }

    /**
     * Gets the NodeID for the node corresponding to this line, or returns null if the node doesn't have a node ID (e.g.
     * if its a top-level statement).
     */
    get nodeId(): string {
        let nodeId = this.element.attributes["data-node-id"];
        return nodeId && nodeId.value;
    }

    /**
     * Gets the Statement ID for the node corresponding to this line.
     */
    get statementId(): string {
        return this.element.attributes["data-statement-id"].value;
    }

    /**
     * Gets the xml for the whole query plan.
     */
    get queryPlanXml(): Element {
        return findAncestor(this.element, "qp-root").parentElement["xml"];
    }

    /**
     * Gets the xml element corresponding to this node from the query plan xml.
     */
    get nodeXml(): Element {
        return getNodeXml(this.queryPlanXml, this.statementId, this.nodeId);
    }

    /**
     * Gets a wrapped RelOp instance for this nodes RelOp query plan XML.
     */
    get relOp(): RelOp {
        let nodeXml = this.nodeXml;
        return nodeXml && nodeXml.tagName == "RelOp" ? new RelOp(this.nodeXml) : null;
    }
}

export { Node, Line, RelOp }