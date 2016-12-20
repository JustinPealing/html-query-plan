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
        currentTooltip = container.querySelector(".qp-tt").cloneNode(true);
        document.body.appendChild(currentTooltip);
        currentTooltip.style.left = cursorX + 'px';
        currentTooltip.style.top = cursorY + 'px';
        currentTooltip.addEventListener("mouseout", function (event) {
            onMouseout(node, event);
        });
    }, TOOLTIP_TIMEOUT);
}

function onMouseout(node, event) {
    // http://stackoverflow.com/questions/4697758/prevent-onmouseout-when-hovering-child-element-of-the-parent-absolute-div-withou
    var e = event.toElement || event.relatedTarget;
    if (e == node || findAncestor(e, 'qp-node') == node ||
        e == currentTooltip || findAncestor(e, 'qp-tt') == currentTooltip) {
        return;
    }
    window.clearTimeout(timeoutId);
    timeoutId = null;
    if (currentTooltip != null) {
        document.body.removeChild(currentTooltip);
        currentTooltip = null;
    }
}

module.exports.initTooltip = initTooltip;