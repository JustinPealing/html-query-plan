import assert from 'assert';
import QP from '../src/index';
import helper from './helper';
var plan_cursorPlan = require('raw!../test_plans/Cursors/cursorPlan.sqlplan');

describe('Cursor support', () => {
        
    it('Shows StmpCursor', () => {

        var container = document.createElement('div');
        QP.showPlan(container, plan_cursorPlan);

        var fastForward = container.querySelector('div[data-statement-id="1"] > div > .qp-node');
        assert.equal('Fast Forward', fastForward.children[1].innerText);
        assert.equal('Cost: 0%', fastForward.children[2].innerText);
        assert.equal(null, helper.getProperty(fastForward, 'Physical Operation'));
        assert.equal(null, helper.getProperty(fastForward, 'Logical Operation'));

    });

    it('Shows "Fetch Query" node as a child of "Fast Forward"', () => {

        var container = document.createElement('div');
        QP.showPlan(container, plan_cursorPlan);

        var fetchQuery = container.querySelector('div[data-statement-id="1"] > div > .qp-tr > div > .qp-node');
        assert.equal('Fetch Query', fetchQuery.children[1].innerText);
        assert.equal('Cost: 0%', fastForward.children[2].innerText);
        assert.equal('The query used to retrieve rows when a fetch is issued against a cursor.', helper.getDescription(fetchQuery))
        assert.equal(null, helper.getProperty(fetchQuery, 'Physical Operation'));
        assert.equal(null, helper.getProperty(fetchQuery, 'Logical Operation'));

    });

});