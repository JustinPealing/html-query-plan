import { assert } from "chai";
import * as QP from "../src/index";
import * as helper from "./helper";
import { plan } from "./plans";

describe("Cursor support", () => {
        
    it("Shows StmpCursor", () => {

        let container = document.createElement("div");
        QP.showPlan(container, plan.cursorPlan);

        let fastForward = helper.findStatement(container, "1");
        assert.equal("Fast Forward", helper.getNodeLabel(fastForward));
        assert.equal("Cost: 0%", helper.getNodeLabel2(fastForward));
        assert.equal("Fast Forward.", helper.getDescription(fastForward))
        assert.equal(null, helper.getProperty(fastForward, "Physical Operation"));
        assert.equal(null, helper.getProperty(fastForward, "Logical Operation"));

    });

    it("Shows 'Fetch Query' node as a child of 'Fast Forward'", () => {

        let container = document.createElement("div");
        QP.showPlan(container, plan.cursorPlan);

        let fetchQuery = helper.findStatement(container, "1").children[0];
        assert.equal("Fetch Query", helper.getNodeLabel(fetchQuery));
        assert.equal("Cost: 0%", helper.getNodeLabel2(fetchQuery));
        assert.equal("The query used to retrieve rows when a fetch is issued against a cursor.", helper.getDescription(fetchQuery))
        assert.equal(null, helper.getProperty(fetchQuery, "Physical Operation"));
        assert.equal(null, helper.getProperty(fetchQuery, "Logical Operation"));
        assert.notEqual(null, fetchQuery.element.querySelector(".qp-icon-FetchQuery"));

    });

    // Bug meant that percentages were shown as NaN in cursor plans
    it("Shows the correct Estimated Operator cost", () => {

        let container = document.createElement("div");
        QP.showPlan(container, plan.cursorPlan);

        let clusteredIndexSeek = helper.findNodeById(container, "1");
        assert.equal("Clustered Index Seek (Clustered)", helper.getNodeLabel(clusteredIndexSeek));
        assert.equal("[WHSWORKLINE].[I_102773WORKIDLINENU…", helper.getNodeLabel2(clusteredIndexSeek));
        assert.equal("Cost: 100%", helper.getNodeLabel3(clusteredIndexSeek));
        assert.equal("Scanning a particular range of rows from a clustered index.", helper.getDescription(clusteredIndexSeek))
        assert.equal("0.0032836 (100%)", helper.getProperty(clusteredIndexSeek, "Estimated Operator Cost"));
        assert.equal("Clustered Index Seek", helper.getProperty(clusteredIndexSeek, "Physical Operation"));
        assert.equal("Clustered Index Seek", helper.getProperty(clusteredIndexSeek, "Logical Operation"));

    });

    // Tests tooltip for @CursorType = Dynamic, also there was a bug where the cost percentage was shown incorrectly 
    it("Shows Dynamic", () => {

        let container = document.createElement("div");
        QP.showPlan(container, plan.cursor2);

        let dynamic = helper.findStatement(container, "4");
        assert.equal("Dynamic", helper.getNodeLabel(dynamic));
        assert.equal("Cost: 0%", helper.getNodeLabel2(dynamic));
        assert.equal("Cursor that can see all changes made by others.", helper.getDescription(dynamic));
        assert.equal(null, helper.getProperty(dynamic, "Physical Operation"));
        assert.equal(null, helper.getProperty(dynamic, "Logical Operation"));

        let fetchQuery = dynamic.children[0];
        assert.equal("Fetch Query", helper.getNodeLabel(fetchQuery));
        assert.equal("Cost: 0%", helper.getNodeLabel2(fetchQuery));
    
    });

    it("Shows OPEN CURSOR", () => {

        let container = document.createElement("div");
        QP.showPlan(container, plan.cursor2);
        
        let openCursor = helper.findStatement(container, "5");
        assert.equal("OPEN CURSOR", helper.getNodeLabel(openCursor));
        assert.equal("Cost: 0%", helper.getNodeLabel2(openCursor));
        assert.notEqual(null, openCursor.element.querySelector(".qp-icon-StmtCursor"));

    });

    it("Shows FETCH CURSOR", () => {

        let container = document.createElement("div");
        QP.showPlan(container, plan.keysetCursor);
        
        let fetchCursor = helper.findStatement(container, "5");
        assert.equal("FETCH CURSOR", helper.getNodeLabel(fetchCursor));
        assert.equal("Cost: 0%", helper.getNodeLabel2(fetchCursor));
        assert.notEqual(null, fetchCursor.element.querySelector(".qp-icon-StmtCursor"));

    });

    it("Shows CLOSE CURSOR", () => {

        let container = document.createElement("div");
        QP.showPlan(container, plan.keysetCursor);
        
        let closeCursor = helper.findStatement(container, "10");
        assert.equal("CLOSE CURSOR", helper.getNodeLabel(closeCursor));
        assert.equal("Cost: 0%", helper.getNodeLabel2(closeCursor));
        assert.notEqual(null, closeCursor.element.querySelector(".qp-icon-StmtCursor"));

    });

    it("Shows DEALLOCATE CURSOR", () => {

        let container = document.createElement("div");
        QP.showPlan(container, plan.keysetCursor);
        
        let deallocateCursor = helper.findStatement(container, "11");
        assert.equal("DEALLOCATE CURSOR", helper.getNodeLabel(deallocateCursor));
        assert.equal("Cost: 0%", helper.getNodeLabel2(deallocateCursor));
        assert.notEqual(null, deallocateCursor.element.querySelector(".qp-icon-StmtCursor"));

    });

    it("Shows Keyset", () => {

        let container = document.createElement("div");
        QP.showPlan(container, plan.keysetCursor);
        
        let keyset = helper.findStatement(container, "2");
        assert.equal("Keyset", helper.getNodeLabel(keyset));
        assert.equal("Cursor that can see updates made by others, but not inserts.", helper.getDescription(keyset));
        assert.notEqual(null, keyset.element.querySelector(".qp-icon-Keyset"));

    });

    it("Shows Snapshot", () => {

        let container = document.createElement("div");
        QP.showPlan(container, plan.snapshotCursor);
        
        let snapshot = helper.findStatement(container, "2");
        assert.equal("Snapshot", helper.getNodeLabel(snapshot));
        assert.equal("A cursor that does not see changes made by others.", helper.getDescription(snapshot));

    });

    it("Shows Population Query", () => {

        let container = document.createElement("div");
        QP.showPlan(container, plan.keysetCursor);
        
        let populationQuery = helper.findStatement(container, "2").children[0];
        assert.equal("Population Query", helper.getNodeLabel(populationQuery));
        assert.equal("The query used to populate a cursor's work table when the cursor is opened.", helper.getDescription(populationQuery));
        assert.notEqual(null, populationQuery.element.querySelector(".qp-icon-PopulateQuery"));

    });

    it("Shows the cost only once (Issue #30)", () => {

        let container = document.createElement("div");
        QP.showPlan(container, plan.snapshotCursor);

        let condNode = helper.findStatement(container, "4");
        assert.equal("Cost: 0%", helper.getNodeLabel2(condNode));

    });

});