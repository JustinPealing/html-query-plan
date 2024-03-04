/**
 * Wraps a RelOp element in the query plan schema.
 */
declare class RelOp {
    readonly element: Element;
    constructor(element: Element);
    /**
     * Gets the estimated number of nodes returned by the operation.
     */
    readonly estimatedRows: number;
    /**
     * Gets the estimated row size in bytes.
     */
    readonly estimatedRowSize: number;
    /**
     * Gets the estimated total size of the data.
     */
    readonly estimatedDataSize: number;
    /**
     * Gets an array of the RunTimeCountersPerThread elements for the RelOp, or returns an empty array if the
     * RunTimeInformation is not present.
     */
    readonly runtimeCountersPerThread: Element[];
    /**
     * Gets the actual number of rows returned by the operation.
     */
    readonly actualRows: number;
    /**
     * Gets the actual number of rows read.
     */
    readonly actualRowsRead: number;
}
/**
 * Wraps the HTML element represending a node in a query plan.
 */
declare class Node {
    readonly element: Element;
    constructor(element: Element);
    /**
     * Gets an array of child nodes.
     */
    readonly children: Array<Node>;
    /**
     * Gets the NodeID for the wrapped query plan node, or returns null if the node doesn't have a node ID (e.g.
     * if its a top-level statement).
     */
    readonly nodeId: string;
    /**
     * Gets the statement ID of the node.
     */
    readonly statementId: string;
    /**
     * Gets the xml for the whole query plan.
     */
    readonly queryPlanXml: Element;
    /**
     * Gets the xml element corresponding to this node from the query plan xml.
     */
    readonly nodeXml: Element;
    /**
     * Gets a wrapped RelOp instance for this nodes RelOp query plan XML.
     */
    readonly relOp: RelOp;
}
/**
 * Wraps a polyline element representing a line in a query plan.
 */
declare class Line {
    readonly element: Element;
    constructor(element: Element);
    /**
     * Gets the NodeID for the node corresponding to this line, or returns null if the node doesn't have a node ID (e.g.
     * if its a top-level statement).
     */
    readonly nodeId: string;
    /**
     * Gets the Statement ID for the node corresponding to this line.
     */
    readonly statementId: string;
    /**
     * Gets the xml for the whole query plan.
     */
    readonly queryPlanXml: Element;
    /**
     * Gets the xml element corresponding to this node from the query plan xml.
     */
    readonly nodeXml: Element;
    /**
     * Gets a wrapped RelOp instance for this nodes RelOp query plan XML.
     */
    readonly relOp: RelOp;
}
export { Node, Line, RelOp };
