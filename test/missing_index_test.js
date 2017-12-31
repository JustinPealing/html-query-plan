import * as assert from 'assert';
import * as QP from '../src/index';
import * as helper from './helper';

let plan_acceptedAnswerPercentage = require('raw!../test_plans/stack overflow/what is my accepted answer percentage rate.sqlplan');
let plan_commentScoreDistribution = require('raw!../test_plans/stack overflow/my comment score distribution.sqlplan');
let plan_UpvotesForEachTag = require('raw!../test_plans/stack overflow/How many upvotes do I have for each tag.sqlplan');
let plan_inequality_index = require('raw!../test_plans/stack overflow/inequality_index.sqlplan');

describe('Missing Indexes', () => {

    /*
     * Missing indexes should appear at the top of the plan, underneath the statement text, e.g.
     *     Missing Index (Impact 99.9677): CREATE NONCLUSTERED INDEX [<Name of Missing Index, sysname,>] ON ...
     */
    it('Shows the missing index text', () => {
        
        let container = helper.showPlan(plan_acceptedAnswerPercentage);
        let missingIndexes = container.querySelectorAll('.missing-index');

        assert.equal(1, missingIndexes.length);
        assert.equal('Missing Index (Impact 99.9609): CREATE NONCLUSTERED INDEX [<Name of Missing Index, sysname,>] ON [dbo].[Posts] ([AcceptedAnswerId])',
            missingIndexes[0].innerText.replace(/\r?\n|\r/g, '').trim());
        
    });

    /*
     * Some indexes have INCLUDE columns as well as EQUALITY columns. This test checks that only EQUALITY columns
     * are included in the included columns section.
     */
    it('Handles INCLUDE columns', () => {
        
        let container = helper.showPlan(plan_commentScoreDistribution);
        let missingIndexes = container.querySelectorAll('.missing-index');

        assert.equal(1, missingIndexes.length);
        assert.equal('Missing Index (Impact 99.9677): CREATE NONCLUSTERED INDEX [<Name of Missing Index, sysname,>] ON [dbo].[Comments] ([UserId]) INCLUDE ([Score])',
            missingIndexes[0].innerText.replace(/\r?\n|\r/g, '').trim());
        
    });

    /*
     * If multiple indexes are suggested, all should appear (SSMS only shows the first one).
     */
    it('Includes all indexes, not just the first one', () => {

        let container = helper.showPlan(plan_UpvotesForEachTag);
        let missingIndexes = container.querySelectorAll('.missing-index');

        assert.equal(2, missingIndexes.length);
        assert.equal('Missing Index (Impact 76.9098): CREATE NONCLUSTERED INDEX [<Name of Missing Index, sysname,>] ON [dbo].[Votes] ([VoteTypeId]) INCLUDE ([PostId])',
            missingIndexes[0].innerText.replace(/\r?\n|\r/g, '').trim());
        assert.equal('Missing Index (Impact 99.2377): CREATE NONCLUSTERED INDEX [<Name of Missing Index, sysname,>] ON [dbo].[Votes] ([PostId],[VoteTypeId])',
            missingIndexes[1].innerText.replace(/\r?\n|\r/g, '').trim());

    });

    /*
     * Columns with @Usage="INEQUALITY" should still be included in the main indexed columns list.
     */
    it('Includes INEQUALITY columns', () => {

        let container = helper.showPlan(plan_inequality_index);
        let missingIndexes = container.querySelectorAll('.missing-index');

        assert.equal(1, missingIndexes.length);
        assert.equal('Missing Index (Impact 96.3324): CREATE NONCLUSTERED INDEX [<Name of Missing Index, sysname,>] ON [dbo].[Posts] ([PostTypeId],[Score]) INCLUDE ([CommentCount],[OwnerUserId])',
            missingIndexes[0].innerText.replace(/\r?\n|\r/g, '').trim());
        
    });

});