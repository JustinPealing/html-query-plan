import assert from 'assert';
import QP from '../src/index';
import helper from './helper';
var plan_cursorPlan = require('raw!../test_plans/Cursors/cursorPlan.sqlplan');
var plan_cursor2 = require('raw!../test_plans/Cursors/cursor2.sqlplan');
var plan_keysetCursor = require('raw!../test_plans/Cursors/Keyset Cursor.sqlplan');
var plan_snapshotCursor = require('raw!../test_plans/Cursors/SnapshotCursor.sqlplan');

describe('Cursor support', () => {
        
    it('Shows StmpCursor', () => {

        var container = document.createElement('div');
        QP.showPlan(container, plan_cursorPlan);

        var fastForward = container.querySelector('div[data-statement-id="1"] > div > .qp-node');
        assert.equal('Fast Forward', fastForward.children[1].innerText);
        assert.equal('Cost: 0%', fastForward.children[2].innerText);
        assert.equal('Fast Forward.', helper.getDescription(fastForward))
        assert.equal(null, helper.getProperty(fastForward, 'Physical Operation'));
        assert.equal(null, helper.getProperty(fastForward, 'Logical Operation'));

    });

    it('Shows "Fetch Query" node as a child of "Fast Forward"', () => {

        var container = document.createElement('div');
        QP.showPlan(container, plan_cursorPlan);

        var fetchQuery = container.querySelector('div[data-statement-id="1"] > div > .qp-tr > div > .qp-node');
        assert.equal('Fetch Query', fetchQuery.children[1].innerText);
        assert.equal('Cost: 0%', fetchQuery.children[2].innerText);
        assert.equal('The query used to retrieve rows when a fetch is issued against a cursor.', helper.getDescription(fetchQuery))
        assert.equal(null, helper.getProperty(fetchQuery, 'Physical Operation'));
        assert.equal(null, helper.getProperty(fetchQuery, 'Logical Operation'));
        assert.notEqual(null, fetchQuery.querySelector('.qp-icon-FetchQuery'));

    });

    // Bug meant that percentages were shown as NaN in cursor plans
    it('Shows the correct Estimated Operator cost', () => {

        var container = document.createElement('div');
        QP.showPlan(container, plan_cursorPlan);

        var clusteredIndexSeek = helper.findNodeById(container, '1');
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

        var container = document.createElement('div');
        QP.showPlan(container, plan_cursor2);

        var dynamic = container.querySelector('div[data-statement-id="4"] > div > .qp-node');
        assert.equal('Dynamic', dynamic.children[1].innerText);
        assert.equal('Cost: 0%', dynamic.children[2].innerText);
        assert.equal('Cursor that can see all changes made by others.', helper.getDescription(dynamic));
        assert.equal(null, helper.getProperty(dynamic, 'Physical Operation'));
        assert.equal(null, helper.getProperty(dynamic, 'Logical Operation'));

        var fetchQuery = container.querySelector('div[data-statement-id="4"] > div > .qp-tr > div > .qp-node');
        assert.equal('Fetch Query', fetchQuery.children[1].innerText);
        assert.equal('Cost: 0%', fetchQuery.children[2].innerText);
    
    });

    it('Shows OPEN CURSOR', () => {

        var container = document.createElement('div');
        QP.showPlan(container, plan_cursor2);
        
        var openCursor = container.querySelector('div[data-statement-id="5"] > div > .qp-node');
        assert.equal('OPEN CURSOR', openCursor.children[1].innerText);
        assert.equal('Cost: 0%', openCursor.children[2].innerText);
        assert.notEqual(null, openCursor.querySelector('.qp-icon-StmtCursor'));

    });

    it('Shows FETCH CURSOR', () => {

        var container = document.createElement('div');
        QP.showPlan(container, plan_keysetCursor);
        
        var fetchCursor = container.querySelector('div[data-statement-id="5"] > div > .qp-node');
        assert.equal('FETCH CURSOR', fetchCursor.children[1].innerText);
        assert.equal('Cost: 0%', fetchCursor.children[2].innerText);
        assert.notEqual(null, fetchCursor.querySelector('.qp-icon-StmtCursor'));

    });

    it('Shows CLOSE CURSOR', () => {

        var container = document.createElement('div');
        QP.showPlan(container, plan_keysetCursor);
        
        var closeCursor = container.querySelector('div[data-statement-id="10"] > div > .qp-node');
        assert.equal('CLOSE CURSOR', closeCursor.children[1].innerText);
        assert.equal('Cost: 0%', closeCursor.children[2].innerText);
        assert.notEqual(null, closeCursor.querySelector('.qp-icon-StmtCursor'));

    });

    it('Shows DEALLOCATE CURSOR', () => {

        var container = document.createElement('div');
        QP.showPlan(container, plan_keysetCursor);
        
        var deallocateCursor = container.querySelector('div[data-statement-id="11"] > div > .qp-node');
        assert.equal('DEALLOCATE CURSOR', deallocateCursor.children[1].innerText);
        assert.equal('Cost: 0%', deallocateCursor.children[2].innerText);
        assert.notEqual(null, deallocateCursor.querySelector('.qp-icon-StmtCursor'));

    });

    it('Shows Keyset', () => {

        var container = document.createElement('div');
        QP.showPlan(container, plan_keysetCursor);
        
        var keyset = container.querySelector('div[data-statement-id="2"] > div > .qp-node');
        assert.equal('Keyset', keyset.children[1].innerText);
        assert.equal('Cursor that can see updates made by others, but not inserts.', helper.getDescription(keyset));
        assert.notEqual(null, keyset.querySelector('.qp-icon-Keyset'));

    });

    it('Shows Snapshot', () => {

        var container = document.createElement('div');
        QP.showPlan(container, plan_snapshotCursor);
        
        var snapshot = container.querySelector('div[data-statement-id="2"] > div > .qp-node');
        assert.equal('Snapshot', snapshot.children[1].innerText);
        assert.equal('A cursor that does not see changes made by others.', helper.getDescription(snapshot));

    });

    it('Shows Population Query', () => {

        var container = document.createElement('div');
        QP.showPlan(container, plan_keysetCursor);
        
        var populationQuery = container.querySelector('div[data-statement-id="2"] > div > .qp-tr > div > .qp-node');
        assert.equal('Population Query', populationQuery.children[1].innerText);
        assert.equal('The query used to populate a cursor\'s work table when the cursor is opened.', helper.getDescription(populationQuery));
        assert.notEqual(null, populationQuery.querySelector('.qp-icon-PopulateQuery'));

    });

});