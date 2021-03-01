import { assert } from "chai";
import { Node, Line, RelOp } from "../src/node";
import * as QP from "../src/index";
import * as helper from "./helper";
import { plan } from "./plans";

describe("Node", () => {

    describe("Constructor", () => {

        it("Throws if element is null", () => {

            assert.throws(() => new Node(null));

        });

        it("Throws if element is not .qp-node", () => {

            assert.throws(() => new Node(document.createElement("div")));

        });

    });

    describe("children property", () => {

        it("Is an array with one element for each child node", () => {

            let container = helper.showPlan(plan.adaptive_join);
            assert.equal(3, helper.findNodeById(container, "0").children.length);
            assert.equal(0, helper.findNodeById(container, "2").children.length);
            assert.equal(1, helper.findNodeById(container, "3").children.length);
    
        });

        it("Contains elements of type QpNode", () => {

            let container = helper.showPlan(plan.adaptive_join);
            var child = helper.findNodeById(container, "0").children[0];
            assert.instanceOf(child, Node);
            
        });

    });

    describe("nodeId property", () => {

        it("gets the data-node-id attribute if present", () => {

            let container = helper.showPlan(plan.adaptive_join);
            assert.equal("3", helper.findNodeById(container, "3").nodeId);
            
        });
        
        it("Returns null if the data-node-id is not present", () => {

            let container = helper.showPlan(plan.adaptive_join);
            assert.equal(null, helper.findStatement(container).nodeId);

        });
        
    });

    describe("statementId property", () => {

        it("Returns the statement ID of the node", () => {

            let container = helper.showPlan(plan.issue7);
            assert.equal("6", helper.findNodeById(container, "4", "6").statementId);
            // This is a conditional node where one statement is nested inside another
            assert.equal("16", helper.findNodeById(container, "2", "15").statementId);

        });

    });
    
    describe("queryPlan property", () => {

        it("Returns the query plan XML", () => {

            let container = helper.showPlan(plan.adaptive_join);
            let planXml = helper.findNodeById(container, "2").queryPlanXml;
            assert.equal("1.6", planXml.getElementsByTagName("ShowPlanXML")[0].attributes["Version"].value);

        });

    });

    describe("nodeXml property", () => {

        it("Returns the XML for the node RelOp", () => {

            let container = helper.showPlan(plan.adaptive_join);
            let xml = helper.findNodeById(container, "2").nodeXml;
            assert.equal("0.0110168", xml.attributes["EstimateCPU"].value);

        });

        it("Returns the node XML for statement elements", () => {

            let container = helper.showPlan(plan.issue7);
            let xml = helper.findNodeById(container, null, "16").nodeXml;
            assert.equal("0x4B6B044581CE8A4E", xml.attributes["QueryPlanHash"].value);

        });

        it("Returns the XML for the corrct node by statement ID", () => {

            let container = helper.showPlan(plan.issue7);
            let xml = helper.findNodeById(container, "0", "16").nodeXml;
            assert.equal("0.0032833", xml.attributes["EstimatedTotalSubtreeCost"].value);

        });

        it("Returns null if the nodeXml is not set", () => {

            let element = document.createElement("div");
            element.className = "qp-node";
            let node = new Node(element);

            assert.isNull(node.nodeXml);

        });

    });
    
});

describe("RelOp", () => {

    describe("Constructor", () => {

        it("Throws if element is null", () => {

            assert.throws(() => new RelOp(null));

        });

        it("Throws if element is not a RelOp element", () => {

            let xml = `<ShowPlanXML xmlns="http://schemas.microsoft.com/sqlserver/2004/07/showplan" />`
            let element = new DOMParser().parseFromString(xml, "text/xml").documentElement;
            assert.throws(() => new RelOp(element));

        });

    });
    
    describe("runtimeCountersPerThread property", () => {

        it("Returns empty array if RunTimeInformation is missing", () => {

            let container = helper.showPlan(plan.adaptive_join_estimated);
            assert.equal(0, helper.findNodeById(container, "3").relOp.runtimeCountersPerThread.length);

        });

        it("Returns an element for each RunTimeInformation", () => {

            let container = helper.showPlan(plan.acceptedAnswerPercentage);
            let streamAggregate = helper.findNodeById(container, "6");
            assert.equal(9, streamAggregate.relOp.runtimeCountersPerThread.length);
            assert.equal("1", streamAggregate.relOp.runtimeCountersPerThread[0].attributes["Thread"].value)
            assert.equal("3", streamAggregate.relOp.runtimeCountersPerThread[1].attributes["Thread"].value)
            assert.equal("4", streamAggregate.relOp.runtimeCountersPerThread[2].attributes["Thread"].value)
            assert.equal("5", streamAggregate.relOp.runtimeCountersPerThread[3].attributes["Thread"].value)
            assert.equal("7", streamAggregate.relOp.runtimeCountersPerThread[4].attributes["Thread"].value)

        });

    });

    describe("actualRows property", () => {

        it("Returns a sum of @ActualRows from runtime information", () => {

            let adaptiveJoin = helper.showPlan(plan.adaptive_join);
            assert.equal(0, helper.findNodeById(adaptiveJoin, "3").relOp.actualRows);
            assert.equal(10, helper.findNodeById(adaptiveJoin, "2").relOp.actualRows);

            let batchMode = helper.showPlan(plan.batchMode);
            assert.equal(10000000, helper.findNodeById(batchMode, "1").relOp.actualRows);

        });

        it("Returns null if there is no runtime information", () => {

            let container = helper.showPlan(plan.adaptive_join_estimated);
            assert.equal(null, helper.findNodeById(container, "3").relOp.actualRows);

        });

    });
    
    describe("actualRowsRead property", () => {

        it("Returns a sum of @ActualRowsRead from runtime information", () => {

            let adaptiveJoin = helper.showPlan(plan.adaptive_join);
            assert.equal(10, helper.findNodeById(adaptiveJoin, "7").relOp.actualRowsRead);

        });

        it("Returns null if there is no runtime information", () => {

            let container = helper.showPlan(plan.adaptive_join_estimated);
            assert.equal(null, helper.findNodeById(container, "3").relOp.actualRowsRead);

        });

        it("Returns null if @ActualRowsRead is missing", () => {

            let container = helper.showPlan(plan.adaptive_join);
            assert.equal(null, helper.findNodeById(container, "2").relOp.actualRowsRead);

        });

    });

    describe("estimateRows property", () => {

        it("Returns the estimated number of rows", () => {

            let container = helper.showPlan(plan.adaptive_join_estimated);
            assert.equal(1.0001, helper.findNodeById(container, "7").relOp.estimatedRows);

        });

    });

    describe("estimatedRowSize property", () => {

        it("Returns the estimated row size in bytes", () => {

            let container = helper.showPlan(plan.adaptive_join_estimated);
            assert.equal(11, helper.findNodeById(container, "0").relOp.estimatedRowSize);
            assert.equal(15, helper.findNodeById(container, "2").relOp.estimatedRowSize);
            assert.equal(11, helper.findNodeById(container, "3").relOp.estimatedRowSize);
            assert.equal(11, helper.findNodeById(container, "4").relOp.estimatedRowSize);
            assert.equal(9, helper.findNodeById(container, "7").relOp.estimatedRowSize);

        });

    });

    describe("estimatedDataSize property", () => {

        it("Returns estimated row size * estimated number of rows", () => {

            let container = helper.showPlan(plan.adaptive_join_estimated);
            assert.equal(110, helper.findNodeById(container, "0").relOp.estimatedDataSize);
            assert.equal(150, helper.findNodeById(container, "2").relOp.estimatedDataSize);
            assert.equal(110, helper.findNodeById(container, "3").relOp.estimatedDataSize);
            assert.equal(1100000, helper.findNodeById(container, "4").relOp.estimatedDataSize);
            assert.equal(9, helper.findNodeById(container, "7").relOp.estimatedDataSize);

        });

    });

});

describe("Line", () => {

    describe("Constructor", () => {

        it("Throws if element is null", () => {

            assert.throws(() => new Line(null));

        });

        it("Throws if element is not polyline", () => {

            assert.throws(() => new Line(document.createElement("div")));

        });

    });

    describe("nodeId property", () => {

        it("Returns the data-node-id attribute value", () => {

            let container = helper.showPlan(plan.adaptive_join);
            assert.equal("4", helper.findLineById(container, "4").nodeId);
            
        });

        it("Returns null for lines without a node ID", () => {

            let container = helper.showPlan(plan.issue7);
            assert.equal(null, helper.findLineById(container, null, "16").nodeId);

        });

    });

    describe("statementId proerty", () => {

        it("Returns the data-statement-id attribute value", () => {

            let container = helper.showPlan(plan.issue7);
            assert.equal("16", helper.findLineById(container, "2", "16").statementId);
            
        });

    });

    describe("relOpXml property", () => {

        it("Returns the XML for the node RelOp", () => {

            let container = helper.showPlan(plan.adaptive_join);
            let xml = helper.findLineById(container, "2").nodeXml;
            assert.equal("0.0110168", xml.attributes["EstimateCPU"].value);

        });

        it("Returns the node XML for statement elements", () => {

            let container = helper.showPlan(plan.issue7);
            let xml = helper.findLineById(container, null, "16").nodeXml;
            assert.equal("0x4B6B044581CE8A4E", xml.attributes["QueryPlanHash"].value);

        });

        it("Returns the XML for the corrct node by statement ID", () => {

            let container = helper.showPlan(plan.issue7);
            let xml = helper.findLineById(container, "0", "16").nodeXml;
            assert.equal("0.0032833", xml.attributes["EstimatedTotalSubtreeCost"].value);

        });

    });

    describe("relOp property", () => {

        it("Returns null if node type is not relOp", () => {

            let container = helper.showPlan(plan.manyLines);
            let line = helper.findLineById(container, null, "2");
            assert.equal(null, line.relOp);

        });

    });

});
