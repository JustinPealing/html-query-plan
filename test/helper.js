import QP from '../src/index';

function findNodeById(container, nodeId, statementId) {
    var statmentElement = findStatmentElementById(container, statementId);
    var nodes = statmentElement.querySelectorAll('.qp-node');
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
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
    var nodes = node.querySelectorAll('th');
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
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

function getDescription(node) {
    var tt = node.querySelector('.qp-tt');
    return tt.children[1].innerText;
}

function showPlan(planXml) {
    var container = document.createElement("div");
    QP.showPlan(container, planXml);
    return container;
}

module.exports.getProperty = getProperty;
module.exports.findNodeById = findNodeById;
module.exports.getToolTipSection = getToolTipSection;
module.exports.getDescription = getDescription;
module.exports.showPlan = showPlan;