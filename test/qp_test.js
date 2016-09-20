import assert from 'assert';
import QP from '../src/qp';
var testPlan = require('raw!../test_plans/issue1.sqlplan');

function findNodeById(container, nodeId) {
    var nodes = container.querySelectorAll('.qp-node');
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (getProperty(node, 'Node ID') == nodeId) {
            return node;
        }
    }
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

describe('qp.js', () => {

    describe('showPlan()', () => {

        it('Adds canvas to container', () => {
            var container = document.createElement("div");
            QP.showPlan(container, testPlan);

            var canvas = container.firstChild;
            assert.equal("canvas", canvas.tagName.toLowerCase());
            assert.equal("absolute", canvas.style.position);
            assert.equal("0px", canvas.style.top);
            assert.equal("0px", canvas.style.left);
        });

        it('Calculates estimated subtree cost correctly', () => {

            var container = document.createElement("div");
            QP.showPlan(container, testPlan);
            
            assert.equal("0.14839", getProperty(findNodeById(container, "1"), "Estimated Subtree Cost"));
            assert.equal("0.0268975", getProperty(findNodeById(container, "18"), "Estimated Subtree Cost"));

        })

    });

});