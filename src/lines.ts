import * as SVG from "svgjs";
import { Node } from "./node";

/**
 * Separation between each line, measured as the number of pixels between the bottom
 * edge of one line and the top edge of the next.
 */
const lineSeparation = 5;

interface Point {
    x: number,
    y: number
}

function drawLines(container: Element) {
    let root = <HTMLElement>container.querySelector(".qp-root");
    let draw = SVG(root);

    let clientRect = root.getBoundingClientRect();

    let nodes = root.querySelectorAll(".qp-node");
    for (let i = 0; i < nodes.length; i++) {
        drawLinesForParent(draw, clientRect, new Node(nodes[i]));
    }
}

/**
 * Increases right-padding for a parent element depending on how many lines are being
 * draw to child nodes - the more child nodes there are, the more space are needed for
 * the lines.
 * @param parent Parent .qp-node element.
 */
function addPaddingForParent(parent: Node, padding: number) {
    let qpNodeOuter = parent.element.parentElement;
    let paddingElement = qpNodeOuter.parentElement;
    paddingElement.style.paddingRight = `${padding}px`;
}

/**
 * Works out the position that each arrow should be drawn based on the offsets, for example
 * if there are 3 lines with thicknesses 2, 4 and 4 (and a gap of 2 pixels between lines) then
 * the lines need to be drawn at offsets -6, -1 and 5 relative to the center of the node.
 * @param thicknesses Array of line thicknesses.
 * @param gap Gap between each line.
 * @returns Array of offsets.
 */
function thicknessesToOffsets(thicknesses: Array<number>, gap: number): Array<number> {
    let result = [];
    let total = thicknesses.reduce((a, b) => a + b, 0) + (thicknesses.length - 1) * gap;
    let left = -total / 2
    for (let i = 0; i < thicknesses.length; i++) {
        let right = left + thicknesses[i];
        result.push((right + left) / 2);
        left = right + gap;
    }
    return result;
}

/**
 * Works out how thick a line should be for a node.
 * @param node Node to work out the line thickness for.
 */
function nodeToThickness(node: Node): number {
    let rows = 0;
    if (node.relOp != null) {
        rows = node.relOp.actualRows == null ? node.relOp.estimatedRows : node.relOp.actualRows;
    }
    return Math.max(1, Math.min(Math.floor(Math.log(rows > 0 ? rows : 1)), 12));
}

/**
 * Enumerates all child nodes and draws line from those nodes to the given parent node.
 * @param draw SVG drawing context to use.
 * @param clientRect Bounding client rect of the root SVG context.
 * @param parent Parent .qp-node element.
 */
function drawLinesForParent(draw: SVG.Doc, clientRect: ClientRect, parent: Node) {
    let children = parent.children;
    let thicknesses = children.map(nodeToThickness);
    let padding = thicknesses.reduce((a, b) => a + b, 0) + lineSeparation * (children.length -1);
    addPaddingForParent(parent, padding);
    let offsets = thicknessesToOffsets(thicknesses, lineSeparation);
    for (let i = 0; i < children.length; i++) {
        drawArrowBetweenNodes(draw, clientRect, parent, children[i], thicknesses[i], offsets[i]);
    }
}

/**
 * Draws the arrow between two nodes.
 * @param draw SVG drawing context to use.
 * @param clientRect Bounding client rect of the root SVG context.
 * @param parent Node element from which to draw the arrow (leftmost node).
 * @param child Node element to which to draw the arrow (rightmost node).
 */
function drawArrowBetweenNodes(draw: SVG.Doc, clientRect: ClientRect, parent: Node, child: Node, thickness: number, offset: number) {
    let parentOffset = parent.element.getBoundingClientRect();
    let childOffset = child.element.getBoundingClientRect();

    let toX = parentOffset.right;
    let toY = (parentOffset.top + parentOffset.bottom) / 2;

    let fromX = childOffset.left;
    let fromY = (childOffset.top + childOffset.bottom) / 2;

    let midOffsetLeft = toX / 2 + fromX / 2;

    let toPoint = {
        x: toX - clientRect.left + 1,
        y: toY - clientRect.top + offset
    };
    let fromPoint = {
        x: childOffset.left - clientRect.left - 1,
        y: fromY - clientRect.top
    };
    let bendOffsetX = midOffsetLeft - clientRect.left - offset;
    drawArrow(draw, toPoint, fromPoint, bendOffsetX, thickness, child.nodeId, child.statementId);
}

/**
 * Draws an arrow between two points.
 * @param draw SVG drawing context to use.
 * @param from {x,y} coordinates of tail (flat) end.
 * @param to {x,y} coordinates of the arrowhead (pointy) end.
 * @param bendX Offset from toPoint at which the "bend" should happen. (X axis).
 * @param nodeId Value to use for the data-node-id attribute used to identify the node to which this arrow belongs.
 * @param statementId Value to use for the data-statement-id attribute used to identify the node to which this arrow belongs.
 */
function drawArrow(draw: SVG.Doc, to: Point, from: Point, bendX: number, thickness: number, nodeId: string, statementId: string) {
    let points: any = arrowPath(to, from, bendX, thickness);
    let line = draw.polyline(points)
        .fill("#E3E3E3").stroke({color: "#505050", width: 0.5})
        .data("statement-id", statementId);

    // Not all nodes have a node ID, e.g. top level statements
    if (nodeId) {
        line.data("node-id", nodeId);
    }
}

/**
 * Creates the path for an arrow between two points.
 * @param to Coordinates of the the arrowhead (pointy) end.
 * @param from mid-point of the tail (flat) end.
 * @param bendX Offset from toPoint at which the "bend" should happen. (X axis).
 * @param thickness Width of the line / arrow, in pixels
 */
function arrowPath(to: Point, from: Point, bendX: number, thickness: number) {
    let w2 = thickness / 2;
    return [
        [to.x, to.y],
        [to.x + w2 + 2, to.y - (w2 + 2)],
        [to.x + w2 + 2, to.y - w2],
        [bendX + (to.y <= from.y ? w2 : -w2), to.y - w2],
        [bendX + (to.y <= from.y ? w2 : -w2), from.y - w2],
        [from.x, from.y - w2],
        [from.x, from.y + w2],
        [bendX + (to.y <= from.y ? -w2 : w2), from.y + w2],
        [bendX + (to.y <= from.y ? -w2 : w2), to.y + w2],
        [to.x + w2 + 2, to.y + w2],
        [to.x + w2 + 2, to.y + w2 + 2],
        [to.x, to.y]
    ];
}

export { drawLines, arrowPath, thicknessesToOffsets, nodeToThickness }