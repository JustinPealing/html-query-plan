import { findAncestor } from './utils.js'

const TOOLTIP_TIMEOUT = 500;

let timeoutId = null;
let currentTooltip = null;
let cursorX = 0;
let cursorY = 0;

function initTooltip(container) {
    disableCssTooltips(container);
    trackMousePosition();

    let nodes = container.querySelectorAll('.qp-node');

    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        node.addEventListener("mouseover", function() {
            onMouseover(node);
        });
        node.addEventListener("mouseout", function (event) {
            onMouseout(node, event);
        });
    }
}

function disableCssTooltips(container) {
    let root = container.querySelector(".qp-root");
    root.className += " qp-noCssTooltip";
}

function trackMousePosition() {
    document.onmousemove = function(e){
        cursorX = e.pageX;
        cursorY = e.pageY;
    }
}

function onMouseover(node) {
    if (timeoutId != null) {
        return;
    }
    timeoutId = window.setTimeout(function () {
        showTooltip(node);
    }, TOOLTIP_TIMEOUT);
}

function onMouseout(node, event) {
    // http://stackoverflow.com/questions/4697758/prevent-onmouseout-when-hovering-child-element-of-the-parent-absolute-div-withou
    var e = event.toElement || event.relatedTarget;
    if (e == node ||
        findAncestor(e, 'qp-node') == node ||
        (currentTooltip != null && (e == currentTooltip || findAncestor(e, 'qp-tt') == currentTooltip))) {
        return;
    }
    window.clearTimeout(timeoutId);
    timeoutId = null;
    hideTooltip();
}

function showTooltip(node) {
    hideTooltip();
    
    var positionY = cursorY;
    var tooltip = node.querySelector(".qp-tt");

    // Nudge the tooptip up if its going to appear below the bottom of the page
    var documentHeight = getDocumentHeight();
    var gapAtBottom = documentHeight - (positionY + tooltip.offsetHeight);
    if (gapAtBottom < 10) {
        positionY = documentHeight - (tooltip.offsetHeight + 10);
    }

    // Stop the tooltip appearing above the top of the page
    if (positionY < 10) {
        positionY = 10;
    }

    currentTooltip = tooltip.cloneNode(true);
    document.body.appendChild(currentTooltip);
    currentTooltip.style.left = cursorX + 'px';
    currentTooltip.style.top = positionY + 'px';
    currentTooltip.addEventListener("mouseout", function (event) {
        onMouseout(node, event);
    });
}

function getDocumentHeight() {
    // http://stackoverflow.com/a/1147768/113141
    var body = document.body,
        html = document.documentElement;
    return Math.max(
        body.scrollHeight, body.offsetHeight, 
        html.clientHeight, html.scrollHeight, html.offsetHeight);
}

function hideTooltip() {
    if (currentTooltip != null) {
        document.body.removeChild(currentTooltip);
        currentTooltip = null;
    }
}

module.exports.initTooltip = initTooltip;