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
 * @param clientRect Bounding client rect of the root SVG context.
 * @param parent Parent .qp-node element.
 */
function drawLinesForParent(draw: SVG.Doc, clientRect: ClientRect, parent: QpNode) {
    let children = parent.children;
    for (let i = 0; i < children.length; i++) {
        let offset = (lineSeparation * i) - (lineSeparation * children.length / 2) + (children.length % 2 == 1 ? lineSeparation / 2 : 0)
        drawArrowBetweenNodes(draw, clientRect, parent, children[i], offset);
    }
}

/**
 * Draws the arrow between two nodes.
 * @param draw SVG drawing context to use.
 * @param clientRect Bounding client rect of the root SVG context.
 * @param parent Node element from which to draw the arrow (leftmost node).
 * @param child Node element to which to draw the arrow (rightmost node).
 */
function drawArrowBetweenNodes(draw: SVG.Doc, clientRect: ClientRect, parent: QpNode, child: QpNode, offset: number) {
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
    let points: any = arrowPath(to, from, bendX, 2);
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
 * @param width Width of the line / arrow, in pixels
 */
function arrowPath(to: Point, from: Point, bendX: number, width: number) {
    let w2 = width / 2;
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

export { drawLines, arrowPath }