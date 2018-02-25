import * as SVG from 'svgjs';
import { QpNode } from './node';

const lineSeparation = 5;

interface Point {
    x: number,
    y: number
}

function drawLines(container: Element) {
    let root = <HTMLElement>container.querySelector(".qp-root");
    let draw = SVG(root);

    let clientRect = root.getBoundingClientRect();

    let nodes = root.querySelectorAll('.qp-node');
    for (let i = 0; i < nodes.length; i++) {
        let node = new QpNode(nodes[i]);
        addPaddingForParent(node);
        drawLinesForParent(draw, clientRect, node);
    }
}

/**
 * Increases right-padding for a parent element depending on how many lines are being
 * draw to child nodes - the more child nodes there are, the more space are needed for
 * the lines.
 * @param parent Parent .qp-node element.
 */
function addPaddingForParent(parent: QpNode) {
    let qpNodeOuter = parent.element.parentElement;
    let paddingElement = qpNodeOuter.parentElement;
    paddingElement.style.paddingRight = `${parent.children.length * lineSeparation}px`;
}

/**
 * Enumerates all child nodes and draws line from those nodes to the given parent node.
 * @param draw SVG drawing context to use.
 * @param offset Bounding client rect of the root SVG context.
 * @param parent Parent .qp-node element.
 */
function drawLinesForParent(draw: SVG.Doc, offset: ClientRect, parent: QpNode) {
    let children = parent.children;
    for (let i = 0; i < children.length; i++) {
        drawArrowBetweenNodes(draw, offset, parent, children[i], i, children.length);
    }
}

/**
 * Draws the arrow between two nodes.
 * @param draw SVG drawing context to use.
 * @param offset Bounding client rect of the root SVG context.
 * @param parent Node element from which to draw the arrow (leftmost node).
 * @param child Node element to which to draw the arrow (rightmost node).
 */
function drawArrowBetweenNodes(draw: SVG.Doc, offset: ClientRect, parent: QpNode, child: QpNode, index: number, count: number) {
    let parentOffset = parent.element.getBoundingClientRect();
    let childOffset = child.element.getBoundingClientRect();

    let toX = parentOffset.right;
    let toY = (parentOffset.top + parentOffset.bottom) / 2;

    let fromX = childOffset.left;
    let fromY = (childOffset.top + childOffset.bottom) / 2;

    let midOffsetLeft = toX / 2 + fromX / 2;

    let toPoint = {
        x: toX - offset.left + 1,
        y: toY - (lineSeparation * count / 2) - offset.top + (lineSeparation * index) + (count % 2 == 1 ? lineSeparation / 2 : 0)
    };
    let fromPoint = {
        x: childOffset.left - offset.left - 1,
        y: fromY - offset.top
    };
    let bendOffsetX = midOffsetLeft + (lineSeparation * count / 2) - offset.left - (lineSeparation * index);
    drawArrow(draw, toPoint, fromPoint, bendOffsetX);
}

/**
 * Draws an arrow between two points.
 * @param draw SVG drawing context to use.
 * @param from {x,y} coordinates of tail (flat) end.
 * @param to {x,y} coordinates of the arrowhead (pointy) end.
 * @param bendX Offset from toPoint at which the "bend" should happen. (X axis).
 */
function drawArrow(draw: SVG.Doc, to: Point, from: Point, bendX: number) {
    let points: any = arrowPath(to, from, bendX);
    draw.polyline(points).fill('#E3E3E3').stroke({
        color: '#505050',
        width: 0.5
    });
}

/**
 * Creates the path for an arrow between two points.
 * @param to Coordinates of the the arrowhead (pointy) end.
 * @param from mid-point of the tail (flat) end.
 * @param bendX Offset from toPoint at which the "bend" should happen. (X axis).
 */
function arrowPath(to: Point, from: Point, bendX: number) {
    return [
        [to.x, to.y],
        [to.x + 3, to.y - 3],
        [to.x + 3, to.y - 1],
        [bendX + (to.y <= from.y ? 1 : -1), to.y - 1],
        [bendX + (to.y <= from.y ? 1 : -1), from.y - 1],
        [from.x, from.y - 1],
        [from.x, from.y + 1],
        [bendX + (to.y <= from.y ? -1 : 1), from.y + 1],
        [bendX + (to.y <= from.y ? -1 : 1), to.y + 1],
        [to.x + 3, to.y + 1],
        [to.x + 3, to.y + 3],
        [to.x, to.y]
    ];
}

export { drawLines, arrowPath }