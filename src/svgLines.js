import SVG from 'svgjs';

function drawSvgLines(container) {
    let root = container.querySelector(".qp-root");
    let draw = SVG(root);

    let clientRect = root.getBoundingClientRect();

    let nodes = root.querySelectorAll('.qp-node'); 
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i]; 
        var previousNode = findParent(node);
        if (previousNode != null) {
            drawArrowBetweenNodes(draw, clientRect, previousNode, node);
        }
    }
}

function findParent(node) {
    var row = findAncestor(node, 'qp-tr');
    var parentRow = findAncestor(row, 'qp-tr');
    if (!parentRow) {
        return null;
    }
    return parentRow.firstChild.firstChild;
}

function findAncestor(element, className) {
    while ((element = element.parentElement) && element && !hasClass(element, className));
    return element;
}

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
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
        x: fromX - offset.left,
        y: fromY - offset.top
    };
    let toPoint = {
        x: toOffset.left - offset.left,
        y: toY - offset.top
    };
    let bendOffsetX = midOffsetLeft - offset.left;
    drawArrow(draw, fromPoint, toPoint, bendOffsetX);
}

/**
 * Draws a line between two points.
 * @draw SVG drawing context to use.
 * @from {x,y} coordinates of tail end.
 * @to {x,y} coordinates of the pointy end.
 * @bendX Offset from toPoint at which the "bend" should happen. (X axis) 
 */
function drawArrow(draw, from, to, bendX) {

    draw.line(from.x, from.y, bendX, from.y).stroke({ width: 1});
    draw.line(bendX, from.y, bendX, to.y).stroke({ width: 1});
    draw.line(bendX, to.y, to.x, to.y).stroke({ width: 1});

}

module.exports.drawSvgLines = drawSvgLines;