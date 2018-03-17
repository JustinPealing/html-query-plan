import * as QP from "../src/index";
import { Node, Line } from "../src/node";

function findNodeById(container: Element, nodeId: string, statementId?: string): Node {
    let statmentElement = findStatmentElementById(container, statementId);
    let nodes = statmentElement.querySelectorAll(".qp-node");
    for (let i = 0; i < nodes.length; i++) {
        let node = new Node(nodes[i]);
        if (getProperty(node, "Node ID") == nodeId) {
            return node;
        }
    }
}

function findLineById(container: Element, nodeId: string, statementId?: string): Line {
    let polyline = null;
    if (statementId && nodeId) {
        polyline = container.querySelector(`polyline[data-node-id="${nodeId}"][data-statement-id="${statementId}"]`);
    } else if (nodeId) {
        // just find the first node with that nodeId
        polyline = container.querySelector(`polyline[data-node-id="${nodeId}"]`);
    } else {
        polyline = container.querySelector(`polyline:not([data-node-id]), polyline[data-statement-id="${nodeId}"]`);
    }
    return polyline ? new Line(polyline) : null;
}

function findStatement(container: Element, statementId?: string): Node {
    let qptr = findStatmentElementById(container, statementId);
    return new Node(qptr.querySelector(".qp-node"));
}

function findStatmentElementById(container: Element, statementId: string) {
    if (statementId) {
        return container.querySelector('div[data-statement-id="' + statementId + '"]');
    }
    return container.querySelector(".qp-tr");
}

function getProperty(node: Node, key: string) {
    let nodes = node.element.querySelectorAll("th");
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        if (node.innerHTML === key) {
            return node.parentElement.querySelector("td").innerHTML;
        }
    }
    return null;
}

function getToolTipSection(node: Node, name: string) {
    let titleNodes = node.element.querySelectorAll(".qp-bold");
    for (let i = 0; i < titleNodes.length; i++) {
        if (titleNodes[i].innerHTML == name) {
            let next = <HTMLElement>titleNodes[i].nextElementSibling;
            return next.innerText || next.textContent;
        }
    }
    return null;
}

function getTooltipTitle(node: Node) {
    let tt = node.element.querySelector(".qp-tt");
    return (<HTMLElement>tt.children[0]).innerText;
}

function getDescription(node: Node) {
    let tt = node.element.querySelector(".qp-tt");
    return (<HTMLElement>tt.children[1]).innerText;
}

function getNodeLabel(node: Node) {
    return getLabel(node, 1);
}

function getNodeLabel2(node: Node) {
    return getLabel(node, 2);
}

function getNodeLabel3(node: Node) {
    return getLabel(node, 3);
}

function getLabel(node: Node, index: number) {
    return (<HTMLElement>node.element.children[index]).innerText;
}

function showPlan(planXml: string) {
    let container = document.createElement("div");
    QP.showPlan(container, planXml);
    return container;
}

export {
    getProperty,
    findNodeById,
    findLineById,
    getToolTipSection,
    getTooltipTitle,
    getDescription,
    getNodeLabel,
    getNodeLabel2,
    getNodeLabel3,
    showPlan,
    findStatement
}