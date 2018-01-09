import * as assert from 'assert';
import * as QP from '../src/index';
import * as helper from './helper';
import plan_batchMode from 'raw!../test_plans/batch mode.sqlplan';
import plan_issue39 from 'raw!../test_plans/issue_39.sqlplan';
import plan_UpvotesForEachTag from 'raw!../test_plans/stack overflow/How many upvotes do I have for each tag.sqlplan';

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

    it('Shows parallel icon when @Parallel=1', () => {

        let container = helper.showPlan(plan_UpvotesForEachTag);
        let nestedLoops = helper.findNodeById(container, '12');
        assert.notEqual(null, nestedLoops.querySelector('.qp-iconpar'));

    });

    it('Shows parallel icon when @Parallel=true', () => {

        let container = helper.showPlan(plan_batchMode);
        let windowAggregate = helper.findNodeById(container, '2');
        assert.notEqual(null, windowAggregate.querySelector('.qp-iconpar'));

    });

    it('DoesShows parallel icon when @Parallel=0', () => {

        let container = helper.showPlan(plan_UpvotesForEachTag);
        let indexSeek = helper.findNodeById(container, '14');
        assert.equal(null, indexSeek.querySelector('.qp-iconpar'));

    });

});