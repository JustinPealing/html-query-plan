import { findAncestor } from "./utils";

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
 * Wraps a node in a query plan.
 */
class QpNode {
    constructor (readonly element:Element) {
        if (!this.element) throw new Error("element cannot be null");
        if (this.element.className != "qp-node") throw new Error("element must have class qp-node");
    }

    /**
     * Gets an array of child nodes.
     */
    get children(): Array<QpNode> {
        return [].slice.call(findAncestor(this.element, "qp-tr").children[1].children)
            .map(c => new QpNode(c.children[0].children[0].children[0]));
    }

    /**
     * Gets the NodeID.
     */
    get nodeId(): string {
        let nodeId = this.element.attributes["data-node-id"];
        return nodeId && nodeId.value;
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
     * Gets the estimated number of nodes returned by the operation.
     */
    get estimateRows(): number {
        return parseFloat(this.relOpXml.attributes["EstimateRows"].value);
    }

    /**
     * Gets the actual number of nodes returned by the operation.
     */
    get actualRows(): number {
        let runtimeInformation = find(this.relOpXml.childNodes, "RunTimeInformation");
        if (runtimeInformation.length == 0) {
            return null;
        }
        let runtimeCounters = find(runtimeInformation[0].childNodes, "RunTimeCountersPerThread");
        return runtimeCounters.reduce((a, b) => a + parseFloat(b.attributes["ActualRows"].value), 0);
    }
}

export { QpNode }