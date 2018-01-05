import * as QP from '../src/index';

function findNodeById(container, nodeId, statementId) {
    let statmentElement = findStatmentElementById(container, statementId);
    let nodes = statmentElement.querySelectorAll('.qp-node');
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        if (getProperty(node, 'Node ID') == nodeId) {
            return node;
        }
    }
}

function findStatmentElementById(container, statementId) {
    if (statementId) {
        return container.querySelector('div[data-statement-id="' + statementId + '"]');
    }
    return container.querySelector('.qp-tr');
}

function getProperty(node, key) {
    let nodes = node.querySelectorAll('th');
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        if (node.innerHTML === key) {
            return node.parentNode.querySelector('td').innerHTML;
        }
    }
    return null;
}

function getToolTipSection(node, name) {
    let titleNodes = node.querySelectorAll('.qp-bold');
    for (let i = 0; i < titleNodes.length; i++) {
        if (titleNodes[i].innerHTML == name) {
            let next = titleNodes[i].nextSibling;
            return next.innerText || next.textContent;
        }
    }
    return null;
}

function getTooltipTitle(node) {
    let tt = node.querySelector('.qp-tt');
    return tt.children[0].innerText;
}

function getDescription(node) {
    let tt = node.querySelector('.qp-tt');
    return tt.children[1].innerText;
}

function getNodeLabel(node) {
    return node.children[1].innerText;
}

function showPlan(planXml) {
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
    showPlan,
    findStatmentElementById
}