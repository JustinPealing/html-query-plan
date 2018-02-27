import { assert } from 'chai';
import { QpNode } from '../src/node';
import * as QP from '../src/index';
import * as helper from './helper';
import { plan } from './plans';

describe('QpNode', () => {

    describe('Constructor', () => {

        it('Throws if element is null', () => {

            assert.throws(() => new QpNode(null));

        });

        it('Throws if element is not .qp-node', () => {

            assert.throws(() => new QpNode(document.createElement('div')));

        });

    });

    describe('children property', () => {

        it('Is an array with one element for each child node', () => {

            let container = helper.showPlan(plan.adaptive_join);
            assert.equal(3, helper.findNodeById(container, "0").children.length);
            assert.equal(0, helper.findNodeById(container, "2").children.length);
            assert.equal(1, helper.findNodeById(container, "3").children.length);
    
        });

        it('Contains elements of type QpNode', () => {

            let container = helper.showPlan(plan.adaptive_join);
            var child = helper.findNodeById(container, "0").children[0];
            assert.instanceOf(child, QpNode);
            
        });

    });

    describe('nodeId property', () => {

        it('gets the data-node-id attribute if present', () => {

            let container = helper.showPlan(plan.adaptive_join);
            assert.equal('3', helper.findNodeById(container, '3').nodeId);
            
        });
        
        it('Returns null if the data-node-id is not present', () => {

            let container = helper.showPlan(plan.adaptive_join);
            assert.equal(null, helper.findStatement(container).nodeId);

        });
        
    });
    
});
