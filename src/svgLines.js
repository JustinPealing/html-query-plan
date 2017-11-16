import SVG from 'svgjs';
import { findAncestor } from './utils.js';

function drawSvgLines(container) {
    let root = container.querySelector(".qp-root");
    let draw = SVG(root);

    let clientRect = root.getBoundingClientRect();

    let nodes = root.querySelectorAll('.qp-node'); 
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i]; 
        let previousNode = findParent(node);
        if (previousNode != null) {
            drawArrowBetweenNodes(draw, clientRect, previousNode, node);
        }
    }
}

function findParent(node) {
    let row = findAncestor(node, 'qp-tr');
    let parentRow = findAncestor(row, 'qp-tr');
    if (!parentRow) {
        return null;
    }
    return parentRow.children[0].children[0];
}

/**
 * Draws the arrow between two nodes.
 * @draw SVG drawing context to use.
 * @offset Bounding client rect of the root SVG context.
 * @fromElement Node element from which to draw the arrow (leftmost node).
 * @toElement Node element to which to draw the arrow (rightmost node).
 */
function drawArrowBetweenNodes(draw, offset, fromElement, toElement) {
    let fromOffset = fromElement.getBoundingClientRect();
    let toOffset = toElement.getBoundingClientRect();

    let fromX = fromOffset.right;
    let fromY = (fromOffset.top + fromOffset.bottom) / 2;

    let toX = toOffset.left;
    let toY = (toOffset.top + toOffset.bottom) / 2;

    let midOffsetLeft = fromX / 2 + toX / 2;

    let fromPoint = {
        x: fromX - offset.left + 1,
        y: fromY - offset.top
    };
    let toPoint = {
        x: toOffset.left - offset.left - 1,
        y: toY - offset.top
    };
    let bendOffsetX = midOffsetLeft - offset.left;
    drawArrow(draw, fromPoint, toPoint, bendOffsetX);
}

/**
 * Draws an arrow between two points.
 * @draw SVG drawing context to use.
 * @from {x,y} coordinates of tail end.
 * @to {x,y} coordinates of the pointy end.
 * @bendX Offset from toPoint at which the "bend" should happen. (X axis) 
 */
function drawArrow(draw, from, to, bendX) {

    let points = [
        [from.x, from.y],
        [from.x + 3, from.y - 3],
        [from.x + 3, from.y - 1],
        [bendX + (from.y <= to.y ? 1 : -1), from.y - 1],
        [bendX + (from.y <= to.y ? 1 : -1), to.y - 1],
        [to.x, to.y - 1],
        [to.x, to.y + 1],
        [bendX + (from.y <= to.y ? -1 : 1), to.y + 1],
        [bendX + (from.y <= to.y ? -1 : 1), from.y + 1],
        [from.x + 3, from.y + 1],
        [from.x + 3, from.y + 3],
        [from.x, from.y]
    ];
    
    draw.polyline(points).fill('#E3E3E3').stroke({
        color: '#505050',
        width: 0.5
    });

}

module.exports.drawSvgLines = drawSvgLines;