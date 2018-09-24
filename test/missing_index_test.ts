import { assert } from "chai";
import * as QP from "../src/index";
import * as helper from "./helper";
import { plan } from "./plans";

describe("Missing Indexes", () => {

    /*
     * Missing indexes should appear at the top of the plan, underneath the statement text, e.g.
     *     Missing Index (Impact 99.9677): CREATE NONCLUSTERED INDEX [<Name of Missing Index, sysname,>] ON ...
     */
    it("Shows the missing index text", () => {
        
        let container = helper.showPlan(plan.acceptedAnswerPercentage);
        let missingIndexes = container.querySelectorAll(".missing-index");

        assert.equal(1, missingIndexes.length);
        assert.equal("Missing Index (Impact 99.9609): CREATE NONCLUSTERED INDEX [<Name of Missing Index, sysname,>] ON [dbo].[Posts] ([AcceptedAnswerId])",
            (<HTMLElement>missingIndexes[0]).textContent.replace(/\r?\n|\r/g, "").trim());
        
    });

    /*
     * Some indexes have INCLUDE columns as well as EQUALITY columns. This test checks that only EQUALITY columns
     * are included in the included columns section.
     */
    it("Handles INCLUDE columns", () => {
        
        let container = helper.showPlan(plan.commentScoreDistribution);
        let missingIndexes = container.querySelectorAll(".missing-index");

        assert.equal(1, missingIndexes.length);
        assert.equal("Missing Index (Impact 99.9677): CREATE NONCLUSTERED INDEX [<Name of Missing Index, sysname,>] ON [dbo].[Comments] ([UserId]) INCLUDE ([Score])",
            (<HTMLElement>missingIndexes[0]).textContent.replace(/\r?\n|\r/g, "").trim());
        
    });

    /*
     * If multiple indexes are suggested, all should appear (SSMS only shows the first one).
     */
    it("Includes all indexes, not just the first one", () => {

        let container = helper.showPlan(plan.UpvotesForEachTag);
        let missingIndexes = container.querySelectorAll(".missing-index");

        assert.equal(2, missingIndexes.length);
        assert.equal("Missing Index (Impact 76.9098): CREATE NONCLUSTERED INDEX [<Name of Missing Index, sysname,>] ON [dbo].[Votes] ([VoteTypeId]) INCLUDE ([PostId])",
            (<HTMLElement>missingIndexes[0]).textContent.replace(/\r?\n|\r/g, "").trim());
        assert.equal("Missing Index (Impact 99.2377): CREATE NONCLUSTERED INDEX [<Name of Missing Index, sysname,>] ON [dbo].[Votes] ([PostId],[VoteTypeId])",
            (<HTMLElement>missingIndexes[1]).textContent.replace(/\r?\n|\r/g, "").trim());

    });

    /*
     * Columns with @Usage="INEQUALITY" should still be included in the main indexed columns list.
     */
    it("Includes INEQUALITY columns", () => {

        let container = helper.showPlan(plan.inequality_index);
        let missingIndexes = container.querySelectorAll(".missing-index");

        assert.equal(1, missingIndexes.length);
        assert.equal("Missing Index (Impact 96.3324): CREATE NONCLUSTERED INDEX [<Name of Missing Index, sysname,>] ON [dbo].[Posts] ([PostTypeId],[Score]) INCLUDE ([CommentCount],[OwnerUserId])",
            (<HTMLElement>missingIndexes[0]).textContent.replace(/\r?\n|\r/g, "").trim());
        
    });

});