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
    get estimatestimatedRowSize(): number {
        return parseInt(this.element.attributes["AvgRowSize"].value);
    }

    /**
     * Gets the estimated total size of the data.
     */
    get estimatedDataSize(): number {
        return Math.round(this.estimatestimatedRowSize * this.estimatedRows);
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
     * Gets the NodeID.
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
    get queryPlan(): Element {
        return findAncestor(this.element, "qp-root").parentElement["xml"];
    }

    /**
     * Gets the xml for the relOp corresponding to this node.
     */
    get relOpXml(): Element {
        let elements = this.queryPlan.getElementsByTagName("RelOp");
        for (let i = 0; i < elements.length; i++) {
            let element = elements[i];
            if (element.attributes["NodeId"] && element.attributes["NodeId"].value == this.nodeId) {
                return element;
            }
        }
        return null;
    }

    /**
     * Gets a wrapped RelOp instance for this nodes RelOp query plan XML.
     */
    get relOp(): RelOp {
        return this.relOpXml ? new RelOp(this.relOpXml) : null;
    }
}

/**
 * Wraps a polyline element representing a line in a query plan.
 */
class Line {
    constructor (readonly element: Element) {
        if (!this.element) throw new Error("element cannot be null");
        if (this.element.className != "qp-node") throw new Error("element must have class qp-node");
    }
}

export { Node, Line, RelOp }