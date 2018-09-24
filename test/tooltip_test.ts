import { assert } from "chai";
import * as QP from "../src/index";
import * as helper from "./helper";
import { plan } from "./plans";
import * as tooltip from "../src/tooltip";

describe("tooltip moduele", () => {

    describe("buildLineTooltip", () => {

        it("Includes Actual Number of Rows", () => {

            let container = helper.showPlan(plan.adaptive_join);
            let line = helper.findLineById(container, "4");
            let tt = tooltip.buildLineTooltip(line);
            let row = tt.querySelector("tbody").children[0];
            assert.equal("Actual Number of Rows", row.querySelector("th").textContent);
            assert.equal("0", row.querySelector("td").textContent);

        });

        it("Doesn't include Actual Number of Rows for estimated plans", () => {

            let container = helper.showPlan(plan.adaptive_join_estimated);
            let line = helper.findLineById(container, "4");
            let tt = tooltip.buildLineTooltip(line);
            let row = tt.querySelector("tbody").children[0];
            assert.equal("Estimated Number of Rows", row.querySelector("th").textContent);

        });

        it("Shows number of rows read", () => {

            let container = helper.showPlan(plan.adaptive_join);
            let line = helper.findLineById(container, "7");
            let tt = tooltip.buildLineTooltip(line);
            let row = tt.querySelector("tbody").children[1];
            assert.equal("Number of Rows Read", row.querySelector("th").textContent);
            assert.equal("10", row.querySelector("td").textContent);

        });

        it("Includes Estimated Number of Rows", () => {

            let container = helper.showPlan(plan.adaptive_join);
            let line = helper.findLineById(container, "4");
            let tt = tooltip.buildLineTooltip(line);
            let row = tt.querySelector("tbody").children[1];
            assert.equal("Estimated Number of Rows", row.querySelector("th").textContent);
            assert.equal("100000", row.querySelector("td").textContent);

        });

        it("Includes Estimated Row Size", () => {

            let container = helper.showPlan(plan.adaptive_join);
            let line = helper.findLineById(container, "4");
            let tt = tooltip.buildLineTooltip(line);
            let row = tt.querySelector("tbody").children[2];
            assert.equal("Estimated Row Size", row.querySelector("th").textContent);
            assert.equal("11 B", row.querySelector("td").textContent);

        });

        it("Includes Estimated Data Size", () => {

            let container = helper.showPlan(plan.adaptive_join);
            let line = helper.findLineById(container, "4");
            let tt = tooltip.buildLineTooltip(line);
            let row = tt.querySelector("tbody").children[3];
            assert.equal("Estimated Data Size", row.querySelector("th").textContent);
            assert.equal("1074 KB", row.querySelector("td").textContent);

        });

        it("Returns null when relOp is null", () => {

            let container = helper.showPlan(plan.manyLines);
            let line = helper.findLineById(container, null, "2");
            var tt = tooltip.buildLineTooltip(line);
            assert.equal(null, tt);

        });

    });

    describe("convertSize", () => {

        it("Sizes >= 10 KB in KB", () => {

             assert.equal(tooltip.convertSize(5000), '5000 B');
             assert.equal(tooltip.convertSize(10240), '10 KB');

        });

        it("Converts sizes 10 MB & > into MB", () => {

            assert.equal(tooltip.convertSize(10230000), '9990 KB');
            assert.equal(tooltip.convertSize(10240000), '10 MB');

        });

    });

    describe("Estimated Operator Cost", () => {

        it("Is @EstimatedTotalSubtreeCost for the node, minus the sum @EstimatedTotalSubtreeCost for child nodes", () => {

            let container = helper.showPlan(plan.batchModeEstimated);
            let windowAggregate = helper.findNodeById(container, "2");
            assert.equal(helper.getProperty(windowAggregate, "Estimated Operator Cost"), "1.57 (1%)");

        });

        it("Is shown for root nodes", () => {

            let container = helper.showPlan(plan.adaptive_join);
            let windowAggregate = helper.findStatement(container);
            assert.equal(helper.getProperty(windowAggregate, "Estimated Operator Cost"), "0 (0%)");

        });

    });

});
