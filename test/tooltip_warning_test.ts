import * as assert from "assert";
import * as QP from "../src/index";
import * as helper from "./helper";
import { plan } from "./plans";

describe("Tooltip Warnings Section", () => {

    it("Is missing for nodes without s:Warnings", () => {

        let container = helper.showPlan(plan.issue39);
        let tableScan = helper.findNodeById(container, "0");
        assert.equal(null, helper.getToolTipSection(tableScan, "Warnings"));

    })

    // TODO: Test when @NoJoinPredicate=true, and @NoJoinPredicate is missing
    it("Shows No Join Predicate when s:Warnings/@NoJoinPredicate=1", () => {
        
        let container = helper.showPlan(plan.issue39);
        let nestedLoops = helper.findNodeById(container, "1");
        assert.equal("No Join Predicate",
            helper.getToolTipSection(nestedLoops, "Warnings"));
        
    })
    
    it("Shows unmatched indexes", () => {

        let container = helper.showPlan(plan.unmatched_index);
        let select = helper.findStatmentElementById(container, "1");
        assert.equal("Unmatched index: [Test].[dbo].[SAMPLE_TABLE].[IX_SAMPLE_TABLE__ID_2]",
            helper.getToolTipSection(select, "Warnings"));

    })

    it("Shows ColumnsWithNoStatistics warning", () => {

        let container = helper.showPlan(plan.columns_with_no_statistics);
        let indexScan = helper.findNodeById(container, "2");
        assert.equal("Columns With No Statistics: [mydb].[myschema].[TestTableA].TestTableB_Id",
            helper.getToolTipSection(indexScan, "Warnings"));

    })

    it("Shows SpillToTempDb warning", () => {

        const expected = "Operator used tempdb to spill data during execution with spill level 2 and 4 spilled thread(s)";
        let container = helper.showPlan(plan.spilltotempdb);
        let sort = helper.findNodeById(container, "2");
        assert.equal(true, helper.getToolTipSection(sort, "Warnings").indexOf(expected) >= 0);

    })

    it("Shows Wait warning", () => {

        const expected = "The query had to wait 58 seconds for Memory Grant during execution.";
        let container = helper.showPlan(plan.inequality_index);
        let select = helper.findStatmentElementById(container, "1");
        assert.equal(true, helper.getToolTipSection(select, "Warnings").indexOf(expected) >= 0);

    })

    it("Shows PlanAffectingConvert warning", () => {

        const expected = "Type conversion in expression (CONVERT(varchar(150),[mcLive].[Cadastre].[OwnerPersonParsed].[Surname],0)) may affect \"Cardinality Estimate\" in query plan choice.";
        let container = helper.showPlan(plan.issue7);
        let update = helper.findStatmentElementById(container, "12");
        assert.equal(true, helper.getToolTipSection(update, "Warnings").indexOf(expected) >= 0);

    })

    it("Shows SortSpillDetails warning", () => {

        const expected = "Sort wrote 12 pages to and read 175292 pages from tempdb with granted memory 413696KB and used memory 410624KB.";
        let container = helper.showPlan(plan.spilltotempdb);
        let sort = helper.findNodeById(container, "2");
        assert.equal(true, helper.getToolTipSection(sort, "Warnings").indexOf(expected) >= 0);

    })

    it("Shows MemoryGrantWarning warning", () => {

        const expected = "The query memory grant detected \"Excessive Grant\", which may impact the reliability. Grant size: Initial 1395216 KB, Final 1395210 KB, Used 19736 KB.";
        let container = helper.showPlan(plan.inequality_index);
        let select = helper.findStatmentElementById(container, "1");
        assert.equal(true, helper.getToolTipSection(select, "Warnings").indexOf(expected) >= 0);

    })

    it("Shows HashSpillDetails warning", () => {

        const expected = "Hash wrote 10040 pages to and read 19040 pages from tempdb with granted memory 997376KB and used memory 996656KB.";
        let container = helper.showPlan(plan.HashSpillDetails);
        let hashMatch = helper.findNodeById(container, "2");
        assert.equal(true, helper.getToolTipSection(hashMatch, "Warnings").indexOf(expected) >= 0);

    })

})