import * as QP from "../src/index";
import { QpNode } from "../src/node";

function findNodeById(container: Element, nodeId: string, statementId?: string): QpNode {
    let statmentElement = findStatmentElementById(container, statementId);
    let nodes = statmentElement.querySelectorAll(".qp-node");
    for (let i = 0; i < nodes.length; i++) {
        let node = new QpNode(nodes[i]);
        if (getProperty(node, "Node ID") == nodeId) {
            return node;
        }
    }
}

function findStatement(container: Element, statementId?: string): QpNode {
    let qptr = findStatmentElementById(container, statementId);
    return new QpNode(qptr.querySelector(".qp-node"));
}

function findStatmentElementById(container: Element, statementId: string) {
    if (statementId) {
        return container.querySelector('div[data-statement-id="' + statementId + '"]');
    }
    return container.querySelector(".qp-tr");
}

function getProperty(node: QpNode, key: string) {
    let nodes = node.element.querySelectorAll("th");
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        if (node.innerHTML === key) {
            return node.parentElement.querySelector("td").innerHTML;
        }
    }
    return null;
}

function getToolTipSection(node: QpNode, name: string) {
    let titleNodes = node.element.querySelectorAll(".qp-bold");
    for (let i = 0; i < titleNodes.length; i++) {
        if (titleNodes[i].innerHTML == name) {
            let next = <HTMLElement>titleNodes[i].nextElementSibling;
            return next.innerText || next.textContent;
        }
    }
    return null;
}

function getTooltipTitle(node: QpNode) {
    let tt = node.element.querySelector(".qp-tt");
    return (<HTMLElement>tt.children[0]).innerText;
}

function getDescription(node: QpNode) {
    let tt = node.element.querySelector(".qp-tt");
    return (<HTMLElement>tt.children[1]).innerText;
}

function getNodeLabel(node: QpNode) {
    return getLabel(node, 1);
}

function getNodeLabel2(node: QpNode) {
    return getLabel(node, 2);
}

function getNodeLabel3(node: QpNode) {
    return getLabel(node, 3);
}

function getLabel(node: QpNode, index: number) {
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
    getToolTipSection,
    getTooltipTitle,
    getDescription,
    getNodeLabel,
    getNodeLabel2,
    getNodeLabel3,
    showPlan,
    findStatement
}