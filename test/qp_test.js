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

        });

        it('Calculates estimated operator cost correctly', () => {

            var container = document.createElement("div");
            QP.showPlan(container, testPlan);
            
            // This fails on Chrome due to Issue #8
            //assert.equal("0.000001 (0%)", getProperty(findNodeById(container, "0"), "Estimated Operator Cost"));
            assert.equal("0 (0%)", getProperty(findNodeById(container, "1"), "Estimated Operator Cost"));
            assert.equal("0.000025 (0%)", getProperty(findNodeById(container, "3"), "Estimated Operator Cost"));
            assert.equal("0 (0%)", getProperty(findNodeById(container, "4"), "Estimated Operator Cost"));
            assert.equal("0 (0%)", getProperty(findNodeById(container, "5"), "Estimated Operator Cost"));
            assert.equal("0 (0%)", getProperty(findNodeById(container, "6"), "Estimated Operator Cost"));
            assert.equal("0.0032957 (2%)", getProperty(findNodeById(container, "7"), "Estimated Operator Cost"));
            assert.equal("0.03992 (27%)", getProperty(findNodeById(container, "8"), "Estimated Operator Cost"));
            assert.equal("0.0000681 (0%)", getProperty(findNodeById(container, "9"), "Estimated Operator Cost"));
            assert.equal("0.0394237 (27%)", getProperty(findNodeById(container, "10"), "Estimated Operator Cost"));
            assert.equal("0 (0%)", getProperty(findNodeById(container, "11"), "Estimated Operator Cost"));
            assert.equal("0.0000266 (0%)", getProperty(findNodeById(container, "12"), "Estimated Operator Cost"));
            assert.equal("0.0000136 (0%)", getProperty(findNodeById(container, "13"), "Estimated Operator Cost"));
            assert.equal("0.03992 (27%)", getProperty(findNodeById(container, "15"), "Estimated Operator Cost"));
            assert.equal("0.0409408 (28%)", getProperty(findNodeById(container, "16"), "Estimated Operator Cost"));
            assert.equal("0.0268975 (18%)", getProperty(findNodeById(container, "18"), "Estimated Operator Cost"));

        });

    });

});