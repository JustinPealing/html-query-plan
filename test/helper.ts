import * as QP from '../src/index';

function findNodeById(container: Element, nodeId: string, statementId?: string) {
    let statmentElement = findStatmentElementById(container, statementId);
    let nodes = statmentElement.querySelectorAll('.qp-node');
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        if (getProperty(node, 'Node ID') == nodeId) {
            return node;
        }
    }
}

function findStatmentElementById(container: Element, statementId: string) {
    if (statementId) {
        return container.querySelector('div[data-statement-id="' + statementId + '"]');
    }
    return container.querySelector('.qp-tr');
}

function getProperty(node: Element, key: string) {
    let nodes = node.querySelectorAll('th');
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        if (node.innerHTML === key) {
            return node.parentElement.querySelector('td').innerHTML;
        }
    }
    return null;
}

function getToolTipSection(node: Element, name: string) {
    let titleNodes = node.querySelectorAll('.qp-bold');
    for (let i = 0; i < titleNodes.length; i++) {
        if (titleNodes[i].innerHTML == name) {
            let next = <HTMLElement>titleNodes[i].nextElementSibling;
            return next.innerText || next.textContent;
        }
    }
    return null;
}

function getTooltipTitle(node: Element) {
    let tt = node.querySelector('.qp-tt');
    return (<HTMLElement>tt.children[0]).innerText;
}

function getDescription(node: Element) {
    let tt = node.querySelector('.qp-tt');
    return (<HTMLElement>tt.children[1]).innerText;
}

function getNodeLabel(node: Element) {
    return getLabel(node, 1);
}

function getNodeLabel2(node: Element) {
    return getLabel(node, 2);
}

function getNodeLabel3(node: Element) {
    return getLabel(node, 3);
}

function getLabel(node: Element, index: number) {
    return (<HTMLElement>node.children[index]).innerText;
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
    findStatmentElementById
}