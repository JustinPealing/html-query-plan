import { findAncestor, findAncestorP } from "./utils";
import { Line } from "./node";

const TOOLTIP_TIMEOUT = 500;

// ID of the timeout used to delay showing the tooltip on mouseover.
let timeoutId: number = null;
// The currently visible tooltip, if one is shown; Otherwise, null.
let currentTooltip: HTMLElement = null;
// X & Y coordinates of the mouse cursor
let cursorX: number = 0;
let cursorY: number = 0;

function initTooltip(container: Element) {
    disableCssTooltips(container);
    trackMousePosition();

    let nodes = container.querySelectorAll(".qp-node");
    for (let i = 0; i < nodes.length; i++) {
        addTooltip(nodes[i], e => <HTMLElement>e.querySelector(".qp-tt").cloneNode(true));
    }

    let lines = container.getElementsByTagName("polyline");
    for (let i = 0; i < lines.length; i++) {
        let line = new Line(lines[i]);
        addTooltip(line.element, e => {
            return buildLineTooltip(line);
        });
    }
}

function addTooltip(node: Element, createTooltip: (e: Element) => HTMLElement) {
    node.addEventListener("mouseover", () => onMouseover(node, createTooltip));
    node.addEventListener("mouseout", (event: MouseEvent) => onMouseout(node, event));
}

function disableCssTooltips(container: Element) {
    let root = container.querySelector(".qp-root");
    root.className += " qp-noCssTooltip";
}

function trackMousePosition() {
    document.onmousemove = e => {
        cursorX = e.pageX;
        cursorY = e.pageY;
    }
}

function onMouseover(node: Element, createTooltip: (e: Element) => HTMLElement) {
    if (timeoutId != null) return;
    timeoutId = window.setTimeout(() => showTooltip(node, createTooltip(node)), TOOLTIP_TIMEOUT);
}

function onMouseout(node: Element, event: MouseEvent) {
    // http://stackoverflow.com/questions/4697758/prevent-onmouseout-when-hovering-child-element-of-the-parent-absolute-div-withou
    let e = event.toElement || event.relatedTarget as Element;
    // If the element currently under the mouse is still the node, don't hide the tooltip
    if (e == node || e == currentTooltip) return;
    // If the mouse hovers over child elements (e.g. the text in the tooltip or the text / icons in the node) then a mouseoout
    // event is raised even though the mouse is still contained inside the node / tooltip. Search ancestors and don't hide the
    // tooltip if this is the case
    if (findAncestorP(e, x => x == node)) return;
    if (findAncestorP(e, x => x == currentTooltip)) return;
    window.clearTimeout(timeoutId);
    timeoutId = null;
    hideTooltip();
}

function showTooltip(node: Element, tooltip: HTMLElement) {
    hideTooltip();
    
    let positionY = cursorY;

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

    currentTooltip = tooltip;
    document.body.appendChild(currentTooltip);
    currentTooltip.style.left = cursorX + "px";
    currentTooltip.style.top = positionY + "px";
    currentTooltip.addEventListener("mouseout", function (event) {
        onMouseout(node, event);
    });
}

function getDocumentHeight() {
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

/**
 * Builds the tooltip HTML for a Line.
 * @param line Line to build the tooltip for.
 */
function buildLineTooltip(line: Line) : HTMLElement {
    let parser = new DOMParser();
    let actualNumberOfRows = line.relOp.actualRows != null ? 
        `<tr>
            <th>Actual Number of Rows</th>
            <td>${line.relOp.actualRows}</td>
        </tr>` : '';

    let numberOfRowsRead = line.relOp.actualRowsRead != null ?
        `<tr>
            <th>Number of Rows Read</th>
            <td>${line.relOp.actualRowsRead}</td>
        </tr>` : '';

    let document = parser.parseFromString(`
        <div class="qp-tt"><table><tbody>
        ${actualNumberOfRows}
        ${numberOfRowsRead}
        <tr>
            <th>Estimated Number of Rows</th>
            <td>${line.relOp.estimatedRows}</td>
        </tr>
        <tr>
            <th>Estimated Row Size</th>
            <td>${convertSize(line.relOp.estimatedRowSize)}</td>
        </tr>
        <tr>
            <th>Estimated Data Size</th>
            <td>${convertSize(line.relOp.estimatedDataSize)}</td>
        </tr>
        </tbody></tabke></div>
    `, "text/html");
    return <HTMLElement>document.getElementsByClassName("qp-tt")[0];
}

/**
 * Convets sizes to human readable strings.
 * @param size Size in bytes.
 */
function convertSize(size: number) : string {
    if (size > 1000) {
        return `${Math.floor(size / 1024)} KB`;
    }
    return `${size} B`;
}

export { initTooltip, buildLineTooltip }