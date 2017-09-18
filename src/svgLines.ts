import * as SVG from 'svgjs';
import { findAncestor } from './utils';
import { ICoordinate } from './interfaces';

/**
 * 
 * @param container 
 */
export function drawSvgLines(container: HTMLElement) {
    let root = container.querySelector(".qp-root") as HTMLElement;
    let draw = SVG(root);

    let clientRect = root.getBoundingClientRect();

    let nodes = root.querySelectorAll('.qp-node') as NodeListOf<HTMLElement>; 
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i]; 
        var previousNode = findParent(node);
        if (previousNode != null) {
            drawArrowBetweenNodes(draw, clientRect, previousNode, node);
        }
    }
}

/**
 * 
 * @param node 
 */
function findParent(node: HTMLElement): HTMLElement {
    var row = findAncestor(node, 'qp-tr');
    var parentRow = findAncestor(row, 'qp-tr');
    if (!parentRow) {
        return null;
    }
    return parentRow.children[0].children[0] as HTMLElement;
}

/**
 * Draws the arrow between two nodes.
 * @param draw SVG drawing context to use.
 * @param offset Bounding client rect of the root SVG context.
 * @param fromElement Node element from which to draw the arrow (leftmost node).
 * @param toElement Node element to which to draw the arrow (rightmost node).
 */
function drawArrowBetweenNodes(draw, offset, fromElement: HTMLElement, toElement: HTMLElement) {
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
 * @param draw SVG drawing context to use.
 * @param from {x,y} coordinates of tail end.
 * @param to {x,y} coordinates of the pointy end.
 * @param bendX Offset from toPoint at which the "bend" should happen. (X axis) 
 */
function drawArrow(draw, from: ICoordinate, to: ICoordinate, bendX: number) {

    var points = [
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
