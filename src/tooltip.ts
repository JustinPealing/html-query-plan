import { findAncestor } from './utils'

const TOOLTIP_TIMEOUT = 500;

let timeoutId: number = null;
let currentTooltip: HTMLElement = null;
let cursorX: number = 0;
let cursorY: number = 0;

function initTooltip(container: Element) {
    disableCssTooltips(container);
    trackMousePosition();

    let nodes = container.querySelectorAll('.qp-node') as NodeListOf<HTMLElement>;

    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        node.addEventListener("mouseover", () => {
            onMouseover(node);
        });
        node.addEventListener("mouseout", (event: MouseEvent) => {
            onMouseout(node, event);
        });
    }
}

function disableCssTooltips(container: Element) {
    let root = container.querySelector(".qp-root");
    root.className += " qp-noCssTooltip";
}

function trackMousePosition() {
    document.onmousemove = function(e){
        cursorX = e.pageX;
        cursorY = e.pageY;
    }
}

function onMouseover(node: Element) {
    if (timeoutId != null) {
        return;
    }
    timeoutId = window.setTimeout( () => {
        showTooltip(node);
    }, TOOLTIP_TIMEOUT);
}

function onMouseout(node: Element, event: MouseEvent) {
    // http://stackoverflow.com/questions/4697758/prevent-onmouseout-when-hovering-child-element-of-the-parent-absolute-div-withou
    let e = event.toElement || event.relatedTarget as Element;
    if (e == node ||
        findAncestor(e, 'qp-node') == node ||
        (currentTooltip != null && (e == currentTooltip || findAncestor(e, 'qp-tt') == currentTooltip))) {
        return;
    }
    window.clearTimeout(timeoutId);
    timeoutId = null;
    hideTooltip();
}

function showTooltip(node: Element) {
    hideTooltip();
    
    let positionY = cursorY;
    let tooltip = <HTMLElement>node.querySelector(".qp-tt");

    // Nudge the tooptip up if its going to appear below the bottom of the page
    let documentHeight = getDocumentHeight();
    let gapAtBottom = documentHeight - (positionY + tooltip.offsetHeight);
    if (gapAtBottom < 10) {
        positionY = documentHeight - (tooltip.offsetHeight + 10);
    }

    // Stop the tooltip appearing above the top of the page
    if (positionY < 10) {
        positionY = 10;
    }

    currentTooltip = <HTMLElement>tooltip.cloneNode(true);
    document.body.appendChild(currentTooltip);
    currentTooltip.style.left = cursorX + 'px';
    currentTooltip.style.top = positionY + 'px';
    currentTooltip.addEventListener("mouseout", function (event) {
        onMouseout(node, event);
    });
}

function getDocumentHeight(): number {
    // http://stackoverflow.com/a/1147768/113141
    let body = document.body,
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

export { initTooltip }