import * as assert from 'assert';
import * as QP from '../src/index';
import * as helper from './helper';

let plan_Issue1 = require('raw!../test_plans/issue1.sqlplan');
let plan_adaptive_join = require('raw!../test_plans/adaptive_join.sqlplan');

describe('IndexScan Nodes', () => {

    /*
     * If the s:IndexScan/s:Object/@IndexKind attribute is present then we should
     * append it to the node title in brackets, e..g. "Clustered Index Seek (Clustered)"
     * in both the node and the tooltip header.
     */
    it('Has index kind appended when present', () => {
        
        let container = helper.showPlan(plan_adaptive_join);
        let indexSeek = helper.findNodeById(container, "7");
        assert.equal("Index Seek (NonClustered)", helper.getNodeLabel(indexSeek));
        assert.equal("Index Seek (NonClustered)", helper.getTooltipTitle(indexSeek));
        
    });

    /*
     * If the s:IndexScan/s:Object/@IndexKind attribute is missing, the index kind
     * should not be shown (e.g. "Clustered Index Seek").
     */
    it('Does not have index kind appended when not present', () => {

        let container = helper.showPlan(plan_Issue1);
        let clusteredIndexSeek = helper.findNodeById(container, "16");
        assert.equal("Clustered Index Seek", helper.getNodeLabel(clusteredIndexSeek));
        assert.equal("Clustered Index Seek", helper.getTooltipTitle(clusteredIndexSeek));

    });

    /*
     * If the s:IndexScan/@Storage = "ColumnStore", then SSMS shows the node 
     * with the title "Columnstore Index Scan", ignoring the @PhysicalOp attribute
     */
    it('Shows "Columnstore Index Scan" when @Storage = "ColumnStore"', () => {

        let container = helper.showPlan(plan_adaptive_join);
        let indexSeek = helper.findNodeById(container, "2");
        assert.equal("Columnstore Index Scan (Clustered)", helper.getNodeLabel(indexSeek));
        assert.equal("Columnstore Index Scan (Clustered)", helper.getTooltipTitle(indexSeek));

    });

});