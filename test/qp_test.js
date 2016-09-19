import assert from 'assert';
import QP from '../src/qp';
var testPlan = require('raw!../test_plans/clustered index delete.sqlplan');

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

    });

});