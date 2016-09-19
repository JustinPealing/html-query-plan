var assert = require('assert');
var QP = require('../src/qp');
var testPlan = require('raw!../test_plans/clustered index delete.sqlplan');

describe('qp.js', function () {

    describe('showPlan()', function () {

        it('Adds canvas to container', function () {
            var container = document.createElement("div");
            QP.showPlan(container, testPlan);

            var canvas = container.firstChild;
            assert.equal("canvas", canvas.tagName.toLowerCase());
            assert.equal("absolute", canvas.style.position);
            assert.equal("0px", canvas.style.top);
            assert.equal("0px", canvas.style.left);
        });

    });

});