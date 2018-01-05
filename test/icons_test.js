import * as assert from 'assert';
import * as QP from '../src/index';
import * as helper from './helper';

let plan_batchMode = require('raw!../test_plans/batch mode.sqlplan');
let plan_issue39 = require('raw!../test_plans/issue_39.sqlplan');

describe('Query Plan Icon', () => {

    it('is based on @LogicalOp when @PhysicalOp=Parallelism', () => {
        
        let container = helper.showPlan(plan_batchMode);
        let parallelism = helper.findNodeById(container, '0');
        assert.notEqual(null, parallelism.querySelector('.qp-icon-GatherStreams'));
        
    });
    
    it('equals qp-icon-Statement for statements', () => {

        let container = helper.showPlan(plan_batchMode);
        let statement = helper.findStatmentElementById(container, '1');
        assert.notEqual(null, statement.querySelector('.qp-icon-Statement'));

    });

    it('Shows warning icons on any node with a s:Warning element', () => {

        let container = helper.showPlan(plan_issue39);
        let nestedLoops = helper.findNodeById(container, '1');
        assert.notEqual(null, nestedLoops.querySelector('.qp-iconwarn'));

    });

    it('Does not show warnings on nodes without a Warning element', () => {

        let container = helper.showPlan(plan_issue39);
        let nestedLoops = helper.findNodeById(container, '2');
        assert.equal(null, nestedLoops.querySelector('.qp-iconwarn'));

    });

});