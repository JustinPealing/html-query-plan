import { assert } from "chai";
import * as QP from "../src/index";
import * as helper from "./helper";
import { plan } from "./plans";

describe("Query Plan Icon", () => {

    it("is based on @LogicalOp when @PhysicalOp=Parallelism", () => {
        
        let container = helper.showPlan(plan.batchMode);
        let parallelism = helper.findNodeById(container, "0");
        assert.notEqual(null, parallelism.element.querySelector(".qp-icon-GatherStreams"));
        
    });
    
    it("equals qp-icon-Statement for statements", () => {

        let container = helper.showPlan(plan.batchMode);
        let statement = helper.findStatement(container, "1");
        assert.notEqual(null, statement.element.querySelector(".qp-icon-Statement"));

    });

    it("Shows warning icons on any node with a s:Warning element", () => {

        let container = helper.showPlan(plan.issue39);
        let nestedLoops = helper.findNodeById(container, "1");
        assert.notEqual(null, nestedLoops.element.querySelector(".qp-iconwarn"));

    });

    it("Does not show warnings on nodes without a Warning element", () => {

        let container = helper.showPlan(plan.issue39);
        let nestedLoops = helper.findNodeById(container, "2");
        assert.equal(null, nestedLoops.element.querySelector(".qp-iconwarn"));

    });

    it("Shows warnings on s:QueryPlan elements with a Warning element", () => {

        let container = helper.showPlan(plan.unmatched_index);
        let select = helper.findStatement(container, "1");
        assert.notEqual(null, select.element.querySelector(".qp-iconwarn"));

    });

    it("Does not show warnings on s:QueryPlan elements without a Warning element", () => {

        let container = helper.showPlan(plan.issue39);
        let select = helper.findStatement(container, "1");
        assert.equal(null, select.element.querySelector(".qp-iconwarn"));

    });

    it("Shows parallel icon when @Parallel=1", () => {

        let container = helper.showPlan(plan.UpvotesForEachTag);
        let nestedLoops = helper.findNodeById(container, "12");
        assert.notEqual(null, nestedLoops.element.querySelector(".qp-iconpar"));

    });

    it("Shows parallel icon when @Parallel=true", () => {

        let container = helper.showPlan(plan.batchMode);
        let windowAggregate = helper.findNodeById(container, "2");
        assert.notEqual(null, windowAggregate.element.querySelector(".qp-iconpar"));

    });

    it("DoesShows parallel icon when @Parallel=0", () => {

        let container = helper.showPlan(plan.UpvotesForEachTag);
        let indexSeek = helper.findNodeById(container, "14");
        assert.equal(null, indexSeek.element.querySelector(".qp-iconpar"));

    });

    it("Shows Cond icon for COND nodes", () => {

        let container = helper.showPlan(plan.StmtCond);
        let cond = helper.findStatement(container);
        assert.notEqual(null, cond.element.querySelector(".qp-icon-StmtCond"));

    });

    it("Shows ColumnStoreIndexScan icon for Columnstore Index Scan nodes", () => {

        let container = helper.showPlan(plan.adaptive_join);
        let cond = helper.findNodeById(container, "2");
        assert.notEqual(null, cond.element.querySelector(".qp-icon-ColumnStoreIndexScan"));

    });

    it("Shows ColumnStoreIndexInsert icon for Columnstore Index Insert nodes", () => {

        let container = helper.showPlan(plan.columnstore_index_insert);
        let insert = helper.findNodeById(container, "0");
        assert.notEqual(null, insert.element.querySelector(".qp-icon-ColumnStoreIndexInsert"));
        assert.equal('Columnstore Index Insert', helper.getNodeLabel(insert));

    });

    it("Shows ColumnStoreIndexDelete icon for Columnstore Index Delete nodes", () => {

        let container = helper.showPlan(plan.columnstore_index_delete);
        let del = helper.findNodeById(container, "0");
        assert.notEqual(null, del.element.querySelector(".qp-icon-ColumnStoreIndexDelete"));
        assert.equal('Columnstore Index Delete', helper.getNodeLabel(del));

    });

    it("Shows ColumnStoreIndexUpdate icon for Columnstore Index Update nodes", () => {

        let container = helper.showPlan(plan.columnstore_index_update);
        let update = helper.findNodeById(container, "1");
        assert.notEqual(null, update.element.querySelector(".qp-icon-ColumnStoreIndexUpdate"));
        assert.equal('Columnstore Index Update', helper.getNodeLabel(update));

    });

    it("Shows ColumnStoreIndexMerge icon for Columnstore Index Merge nodes", () => {

        let container = helper.showPlan(plan.columnstore_index_merge);
        let merge = helper.findNodeById(container, "1");
        assert.notEqual(null, merge.element.querySelector(".qp-icon-ColumnStoreIndexMerge"));
        assert.equal('Columnstore Index Merge', helper.getNodeLabel(merge));
        
    });

    it("Shows ClustredIndexMerge icon for Clustered Index Merge nodes", () => {

        let container = helper.showPlan(plan.clustered_index_merge);
        let cond = helper.findNodeById(container, "1");
        assert.notEqual(null, cond.element.querySelector(".qp-icon-ClusteredIndexMerge"));

    });

    it("Shows DeletedScan icon for Deleted Scan nodes", () => {

        let container = helper.showPlan(plan.deleted_scan);
        let cond = helper.findNodeById(container, "3", "2");
        assert.notEqual(null, cond.element.querySelector(".qp-icon-DeletedScan"));

    });

    it("Shows TableMerge icon for Table Merge nodes", () => {

        let container = helper.showPlan(plan.table_merge);
        let cond = helper.findNodeById(container, "1");
        assert.notEqual(null, cond.element.querySelector(".qp-icon-TableMerge"));

    });

    it("Shows UDX icon for UDX nodes", () => {

        let container = helper.showPlan(plan.udx);
        let cond = helper.findNodeById(container, "5");
        assert.notEqual(null, cond.element.querySelector(".qp-icon-UDX"));

    });

    it("Shows WindowAggregate icon for UDX nodes", () => {

        let container = helper.showPlan(plan.batchMode);
        let cond = helper.findNodeById(container, "2");
        assert.notEqual(null, cond.element.querySelector(".qp-icon-WindowAggregate"));

    });

    describe("Batch Icon", () => {

        it("shows if @EstimatedExecutionMode is Batch", () => {

            let container = helper.showPlan(plan.adaptive_join_estimated);
            let scan = helper.findNodeById(container, "2");
            assert.notEqual(null, scan.element.querySelector(".qp-iconbatch"));

        });

        it("dDoes not show if @EstimatedExecutionMode is not Batch", () => {

            let container = helper.showPlan(plan.adaptive_join_estimated);
            let scan = helper.findNodeById(container, "0");
            assert.equal(null, scan.element.querySelector(".qp-iconbatch"));

        });

        it("does not show if actual execution mode is not batch", () => {

            // The actual execution should "override" if estimated exectuon mode, if present
            let container = helper.showPlan(plan.adaptive_join);
            let scan = helper.findNodeById(container, "7");
            assert.equal(null, scan.element.querySelector(".qp-iconbatch"));

        });

        it("shows if actual execution mode is batch", () => {

            let container = helper.showPlan(plan.columnstore_index_update);
            let scan = helper.findNodeById(container, "4");
            assert.notEqual(null, scan.element.querySelector(".qp-iconbatch"));

        });

    });

});