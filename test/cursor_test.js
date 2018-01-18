import * as assert from 'assert';
import * as QP from '../src/index';
import * as helper from './helper';
let plan_cursorPlan = require('raw!../test_plans/Cursors/cursorPlan.sqlplan');
let plan_cursor2 = require('raw!../test_plans/Cursors/cursor2.sqlplan');
let plan_keysetCursor = require('raw!../test_plans/Cursors/Keyset Cursor.sqlplan');
let plan_snapshotCursor = require('raw!../test_plans/Cursors/SnapshotCursor.sqlplan');

describe('Cursor support', () => {
        
    it('Shows StmpCursor', () => {

        let container = document.createElement('div');
        QP.showPlan(container, plan_cursorPlan);

        let fastForward = container.querySelector('div[data-statement-id="1"] > div > .qp-node');
        assert.equal('Fast Forward', fastForward.children[1].innerText);
        assert.equal('Cost: 0%', fastForward.children[2].innerText);
        assert.equal('Fast Forward.', helper.getDescription(fastForward))
        assert.equal(null, helper.getProperty(fastForward, 'Physical Operation'));
        assert.equal(null, helper.getProperty(fastForward, 'Logical Operation'));

    });

    it('Shows "Fetch Query" node as a child of "Fast Forward"', () => {

        let container = document.createElement('div');
        QP.showPlan(container, plan_cursorPlan);

        let fetchQuery = container.querySelector('div[data-statement-id="1"] > div > .qp-tr > div > .qp-node');
        assert.equal('Fetch Query', fetchQuery.children[1].innerText);
        assert.equal('Cost: 0%', fetchQuery.children[2].innerText);
        assert.equal('The query used to retrieve rows when a fetch is issued against a cursor.', helper.getDescription(fetchQuery))
        assert.equal(null, helper.getProperty(fetchQuery, 'Physical Operation'));
        assert.equal(null, helper.getProperty(fetchQuery, 'Logical Operation'));
        assert.notEqual(null, fetchQuery.querySelector('.qp-icon-FetchQuery'));

    });

    // Bug meant that percentages were shown as NaN in cursor plans
    it('Shows the correct Estimated Operator cost', () => {

        let container = document.createElement('div');
        QP.showPlan(container, plan_cursorPlan);

        let clusteredIndexSeek = helper.findNodeById(container, '1');
        assert.equal('Clustered Index Seek', clusteredIndexSeek.children[1].innerText);
        assert.equal('[WHSWORKLINE].[I_102773WORKIDLINENU…', clusteredIndexSeek.children[2].innerText);
        assert.equal('Cost: 100%', clusteredIndexSeek.children[3].innerText);
        assert.equal('Scanning a particular range of rows from a clustered index.', helper.getDescription(clusteredIndexSeek))
        assert.equal('0.0032836 (100%)', helper.getProperty(clusteredIndexSeek, 'Estimated Operator Cost'));
        assert.equal('Clustered Index Seek', helper.getProperty(clusteredIndexSeek, 'Physical Operation'));
        assert.equal('Clustered Index Seek', helper.getProperty(clusteredIndexSeek, 'Logical Operation'));

    });

    // Tests tooltip for @CursorType = Dynamic, also there was a bug where the cost percentage was shown incorrectly 
    it('Shows Dynamic', () => {

        let container = document.createElement('div');
        QP.showPlan(container, plan_cursor2);

        let dynamic = container.querySelector('div[data-statement-id="4"] > div > .qp-node');
        assert.equal('Dynamic', dynamic.children[1].innerText);
        assert.equal('Cost: 0%', dynamic.children[2].innerText);
        assert.equal('Cursor that can see all changes made by others.', helper.getDescription(dynamic));
        assert.equal(null, helper.getProperty(dynamic, 'Physical Operation'));
        assert.equal(null, helper.getProperty(dynamic, 'Logical Operation'));

        let fetchQuery = container.querySelector('div[data-statement-id="4"] > div > .qp-tr > div > .qp-node');
        assert.equal('Fetch Query', fetchQuery.children[1].innerText);
        assert.equal('Cost: 0%', fetchQuery.children[2].innerText);
    
    });

    it('Shows OPEN CURSOR', () => {

        let container = document.createElement('div');
        QP.showPlan(container, plan_cursor2);
        
        let openCursor = container.querySelector('div[data-statement-id="5"] > div > .qp-node');
        assert.equal('OPEN CURSOR', openCursor.children[1].innerText);
        assert.equal('Cost: 0%', openCursor.children[2].innerText);
        assert.notEqual(null, openCursor.querySelector('.qp-icon-StmtCursor'));

    });

    it('Shows FETCH CURSOR', () => {

        let container = document.createElement('div');
        QP.showPlan(container, plan_keysetCursor);
        
        let fetchCursor = container.querySelector('div[data-statement-id="5"] > div > .qp-node');
        assert.equal('FETCH CURSOR', fetchCursor.children[1].innerText);
        assert.equal('Cost: 0%', fetchCursor.children[2].innerText);
        assert.notEqual(null, fetchCursor.querySelector('.qp-icon-StmtCursor'));

    });

    it('Shows CLOSE CURSOR', () => {

        let container = document.createElement('div');
        QP.showPlan(container, plan_keysetCursor);
        
        let closeCursor = container.querySelector('div[data-statement-id="10"] > div > .qp-node');
        assert.equal('CLOSE CURSOR', closeCursor.children[1].innerText);
        assert.equal('Cost: 0%', closeCursor.children[2].innerText);
        assert.notEqual(null, closeCursor.querySelector('.qp-icon-StmtCursor'));

    });

    it('Shows DEALLOCATE CURSOR', () => {

        let container = document.createElement('div');
        QP.showPlan(container, plan_keysetCursor);
        
        let deallocateCursor = container.querySelector('div[data-statement-id="11"] > div > .qp-node');
        assert.equal('DEALLOCATE CURSOR', deallocateCursor.children[1].innerText);
        assert.equal('Cost: 0%', deallocateCursor.children[2].innerText);
        assert.notEqual(null, deallocateCursor.querySelector('.qp-icon-StmtCursor'));

    });

    it('Shows Keyset', () => {

        let container = document.createElement('div');
        QP.showPlan(container, plan_keysetCursor);
        
        let keyset = container.querySelector('div[data-statement-id="2"] > div > .qp-node');
        assert.equal('Keyset', keyset.children[1].innerText);
        assert.equal('Cursor that can see updates made by others, but not inserts.', helper.getDescription(keyset));
        assert.notEqual(null, keyset.querySelector('.qp-icon-Keyset'));

    });

    it('Shows Snapshot', () => {

        let container = document.createElement('div');
        QP.showPlan(container, plan_snapshotCursor);
        
        let snapshot = container.querySelector('div[data-statement-id="2"] > div > .qp-node');
        assert.equal('Snapshot', snapshot.children[1].innerText);
        assert.equal('A cursor that does not see changes made by others.', helper.getDescription(snapshot));

    });

    it('Shows Population Query', () => {

        let container = document.createElement('div');
        QP.showPlan(container, plan_keysetCursor);
        
        let populationQuery = container.querySelector('div[data-statement-id="2"] > div > .qp-tr > div > .qp-node');
        assert.equal('Population Query', populationQuery.children[1].innerText);
        assert.equal('The query used to populate a cursor\'s work table when the cursor is opened.', helper.getDescription(populationQuery));
        assert.notEqual(null, populationQuery.querySelector('.qp-icon-PopulateQuery'));

    });

    it('Shows the cost only once (Issue #30)', () => {

        let container = document.createElement('div');
        QP.showPlan(container, plan_snapshotCursor);

        let condNode = container.querySelector('div[data-statement-id="4"] > div > .qp-node');
        assert.equal("Cost: 0%", condNode.children[2].innerText);
        assert.equal("qp-tt", condNode.children[3].className);

    });

});