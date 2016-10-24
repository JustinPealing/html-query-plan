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
            drawLine(draw, clientRect, previousNode, node);
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

function drawLine(draw, offset, from, to) {
    let fromOffset = from.getBoundingClientRect();
    let toOffset = to.getBoundingClientRect();

    let fromX = fromOffset.right;
    let fromY = (fromOffset.top + fromOffset.bottom) / 2;

    let toX = toOffset.left;
    let toY = (toOffset.top + toOffset.bottom) / 2;

    let midOffsetLeft = fromX / 2 + toX / 2;

    draw.line(fromX - offset.left, fromY - offset.top, midOffsetLeft - offset.left, fromY - offset.top).stroke({ width: 1});
    draw.line(midOffsetLeft - offset.left, fromY - offset.top, midOffsetLeft - offset.left, toY - offset.top).stroke({ width: 1});
    draw.line(midOffsetLeft - offset.left, toY - offset.top, toOffset.left - offset.left, toY - offset.top).stroke({ width: 1});
}

module.exports.drawSvgLines = drawSvgLines;