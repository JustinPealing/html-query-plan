import assert from 'assert';
import QP from '../src/index';
var plan_Issue1 = require('raw!../test_plans/issue1.sqlplan');
var plan_Issue7 = require('raw!../test_plans/issue7.sqlplan');
var plan_NotShowingSeekPredicates = require('raw!../test_plans/Not showing Seek Predicates.sqlplan');
var plan_KeyLookup = require('raw!../test_plans/KeyLookup.sqlplan');
var plan_ClusteredIndexScan = require('raw!../test_plans/clustered index scan.sqlplan');
var plan_ClusteredIndexSeek = require('raw!../test_plans/clustered index seek.sqlplan');
var plan_QueryPlan293288248 = require('raw!../test_plans/QueryPlan-293288248.sqlplan');
var plan_StmtUseDb = require('raw!../test_plans/StmtUseDb.sqlplan');
var plan_StmtCond = require('raw!../test_plans/StmtCond.sqlplan');

function findNodeById(container, nodeId, statementId) {
    var statmentElement = findStatmentElementById(container, statementId);
    var nodes = statmentElement.querySelectorAll('.qp-node');
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (getProperty(node, 'Node ID') == nodeId) {
            return node;
        }
    }
}

function findStatmentElementById(container, statementId) {
    if (statementId) {
        return container.querySelector('div[data-statement-id="' + statementId + '"]');
    }
    return container.querySelector('.qp-tr');
}

function getProperty(node, key) {
    var nodes = node.querySelectorAll('th');
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (node.innerHTML === key) {
            return node.parentNode.querySelector('td').innerHTML;
        }
    }
    return null;
}

function getToolTipSection(node, name) {
    let titleNodes = node.querySelectorAll('.qp-bold');
    for (let i = 0; i < titleNodes.length; i++) {
        if (titleNodes[i].innerHTML == name) {
            let next = titleNodes[i].nextSibling;
            return next.innerText || next.textContent;
        }
    }
    return null;
}

function getDescription(node) {
    var tt = node.querySelector('.qp-tt');
    return tt.children[1].innerText;
}

describe('qp.js', () => {

    describe('showPlan()', () => {

        it('Adds canvas to .qp-root', () => {
            
            var container = document.createElement("div");
            QP.showPlan(container, plan_Issue1);
            assert.notEqual(null, container.querySelector('svg'));
            
        });
        
        it('Calculates estimated subtree cost correctly', () => {

            var container = document.createElement("div");
            QP.showPlan(container, plan_Issue1);
            
            assert.equal("0.14839", getProperty(findNodeById(container, "1"), "Estimated Subtree Cost"));
            assert.equal("0.0268975", getProperty(findNodeById(container, "18"), "Estimated Subtree Cost"));

        });

        it('Calculates estimated operator cost correctly', () => {

            var container = document.createElement("div");
            QP.showPlan(container, plan_Issue1);
            
            assert.equal("0.000001 (0%)", getProperty(findNodeById(container, "0"), "Estimated Operator Cost"));
            assert.equal("0 (0%)", getProperty(findNodeById(container, "1"), "Estimated Operator Cost"));
            assert.equal("0.000025 (0%)", getProperty(findNodeById(container, "3"), "Estimated Operator Cost"));
            assert.equal("0 (0%)", getProperty(findNodeById(container, "4"), "Estimated Operator Cost"));
            assert.equal("0 (0%)", getProperty(findNodeById(container, "5"), "Estimated Operator Cost"));
            assert.equal("0 (0%)", getProperty(findNodeById(container, "6"), "Estimated Operator Cost"));
            assert.equal("0.0032957 (2%)", getProperty(findNodeById(container, "7"), "Estimated Operator Cost"));
            assert.equal("0.03992 (27%)", getProperty(findNodeById(container, "8"), "Estimated Operator Cost"));
            assert.equal("0.0000681 (0%)", getProperty(findNodeById(container, "9"), "Estimated Operator Cost"));
            assert.equal("0.0394237 (27%)", getProperty(findNodeById(container, "10"), "Estimated Operator Cost"));
            assert.equal("0 (0%)", getProperty(findNodeById(container, "11"), "Estimated Operator Cost"));
            assert.equal("0.0000266 (0%)", getProperty(findNodeById(container, "12"), "Estimated Operator Cost"));
            assert.equal("0.0000136 (0%)", getProperty(findNodeById(container, "13"), "Estimated Operator Cost"));
            assert.equal("0.03992 (27%)", getProperty(findNodeById(container, "15"), "Estimated Operator Cost"));
            assert.equal("0.0409408 (28%)", getProperty(findNodeById(container, "16"), "Estimated Operator Cost"));
            assert.equal("0.0268975 (18%)", getProperty(findNodeById(container, "18"), "Estimated Operator Cost"));

        });

        it ('Formats scientific numbers correctly', () => {

            var container = document.createElement("div");
            QP.showPlan(container, plan_Issue1);

            assert.equal("0.000001", getProperty(findNodeById(container, "0"), "Estimated CPU Cost"));
            
        });

        it('Works out cost percentages based on the current statement',  () => {

            var container = document.createElement("div");
            QP.showPlan(container, plan_Issue7);
            
            assert.equal("248.183 (99%)", getProperty(findNodeById(container, "4", "6"), "Estimated Operator Cost"));
            assert.equal("0.0032831 (100%)", getProperty(findNodeById(container, "3", "11"), "Estimated Operator Cost"));

        });

        it('Shows SetPredicate string in tooltip', () => {

            var container = document.createElement('div');
            QP.showPlan(container, plan_Issue7);

            var clusteredIndexUpdate = findNodeById(container, "0", "6");
            assert.equal('[mcLive].[Cadastre].[OwnerPersonParsed].[Multiword] = [Expr1002]',
                getToolTipSection(clusteredIndexUpdate, 'Predicate'));

        });

        it('Shows predicates in tooltips where necessary', () => {

            var container = document.createElement('div');
            QP.showPlan(container, plan_NotShowingSeekPredicates);

            var indexSeekNode = findNodeById(container, "26", "1");
            assert.equal("NOT [SMS].[dbo].[SMSresults].[Note] like 'PENDING%' AND NOT [SMS].[dbo].[SMSresults].[Note] like 'ALLOCATED%'",
                getToolTipSection(indexSeekNode, 'Predicate'));

            var topNode = findNodeById(container, "25", "1");
            assert.equal(null, getToolTipSection(topNode, 'Predicate'));

        });

        it('Shows top expression in tooltips', () => {

            var container = document.createElement('div');
            QP.showPlan(container, plan_NotShowingSeekPredicates);

            var topNode = findNodeById(container, "25", "1");
            assert.equal("(1)", getToolTipSection(topNode, 'Top Expression'));

        });

        it('Shows seek predicates in tooltips', () => {

            var container = document.createElement('div');
            QP.showPlan(container, plan_NotShowingSeekPredicates);

            var topNode = findNodeById(container, "26", "1");
            assert.equal("Seek Keys[1]: Prefix: [SMS].[dbo].[SMSresults].SMSID, [SMS].[dbo].[SMSresults].Status = Scalar Operator([SMS].[dbo].[SMSnew].[SMSID] as [N].[SMSID]), Scalar Operator('S')",
                getToolTipSection(topNode, 'Seek Predicates'));

            var indexSeekNode = findNodeById(container, "4", "1");
            assert.equal("Seek Keys[1]: Start: [SMS].[dbo].[SMSnew].DateStamp < Scalar Operator([@p1]), End: [SMS].[dbo].[SMSnew].DateStamp > Scalar Operator([@p0])",
               getToolTipSection(indexSeekNode, 'Seek Predicates'));

        });

        it('Handles >= and <= seek predicates', () => {

            var container = document.createElement('div');
            QP.showPlan(container, plan_Issue7);

            var clusteredIndexSeekNode = findNodeById(container, "8", "12");
            assert.equal("Seek Keys[1]: Start: [mcLive].[Cadastre].[OwnerPersonParsed].RowId >= Scalar Operator([@MapMIN]), End: [mcLive].[Cadastre].[OwnerPersonParsed].RowId <= Scalar Operator([@ParsedMAX])",
                getToolTipSection(clusteredIndexSeekNode, 'Seek Predicates'));

        });

        it('Shows Key Lookup when Lookup="true"', () => {

            var container = document.createElement('div');
            QP.showPlan(container, plan_KeyLookup);

            var keyLookup = findNodeById(container, '5', '1');
            assert.equal('Key Lookup (Clustered)', keyLookup.children[1].innerText);
            assert.equal('Key Lookup', getProperty(keyLookup, 'Physical Operation'));
            assert.equal('Key Lookup', getProperty(keyLookup, 'Logical Operation'));
            assert.equal('Uses a supplied clustering key to lookup on a table that has a clustered index.',
                getDescription(keyLookup));
            assert.notEqual(null, keyLookup.querySelector('.qp-icon-KeyLookup'));

        });

        it('Shows Key Lookup when Lookup="1"', () => {

            var container = document.createElement('div');
            QP.showPlan(container, plan_NotShowingSeekPredicates);

            var keyLookup = findNodeById(container, '6', '1');
            assert.equal('Key Lookup (Clustered)', keyLookup.children[1].innerText);
            assert.equal('Key Lookup', getProperty(keyLookup, 'Physical Operation'));
            assert.equal('Key Lookup', getProperty(keyLookup, 'Logical Operation'));
            assert.equal('Uses a supplied clustering key to lookup on a table that has a clustered index.',
                getDescription(keyLookup));
            assert.notEqual(null, keyLookup.querySelector('.qp-icon-KeyLookup'));

        });

        it('Shows Clustered Index Scan', () => {

            var container = document.createElement('div');
            QP.showPlan(container, plan_ClusteredIndexScan);

            var clusteredIndexScan = findNodeById(container, '0', '1');
            assert.equal('Clustered Index Scan', clusteredIndexScan.children[1].innerText);
            assert.equal('Clustered Index Scan', getProperty(clusteredIndexScan, 'Physical Operation'));
            assert.equal('Clustered Index Scan', getProperty(clusteredIndexScan, 'Logical Operation'));
            assert.equal('Scanning a clustered index, entirely or only a range.',
                getDescription(clusteredIndexScan))
            assert.notEqual(null, clusteredIndexScan.querySelector('.qp-icon-ClusteredIndexScan'));

        });

        it('Shows Clustered Index Seek', () => {

            var container = document.createElement('div');
            QP.showPlan(container, plan_ClusteredIndexSeek);

            var clusteredIndexSeek = findNodeById(container, '0', '1');
            assert.equal('Clustered Index Seek', clusteredIndexSeek.children[1].innerText);
            assert.equal('Clustered Index Seek', getProperty(clusteredIndexSeek, 'Physical Operation'));
            assert.equal('Clustered Index Seek', getProperty(clusteredIndexSeek, 'Logical Operation'));
            assert.equal('Scanning a particular range of rows from a clustered index.',
                getDescription(clusteredIndexSeek))
            assert.notEqual(null, clusteredIndexSeek.querySelector('.qp-icon-ClusteredIndexSeek'));

        });

        it('Has correct icon for Table Valued Functions', () => {

            var container = document.createElement('div');
            QP.showPlan(container, plan_QueryPlan293288248);

            var tableValuedFunction = findNodeById(container, '7', '1');
            assert.notEqual(null, tableValuedFunction.querySelector('.qp-icon-TableValuedFunction'))

        });

        it('Shows StmtUseDb', () => {

            var container = document.createElement('div');
            QP.showPlan(container, plan_StmtUseDb);

            var statementNode = container.querySelector('div[data-statement-id="1"] > div > .qp-node');
            assert.equal('USE DATABASE', statementNode.children[1].innerText);
            assert.equal(null, getProperty(statementNode, 'Physical Operation'));
            assert.equal(null, getProperty(statementNode, 'Logical Operation'));

        });
        
        it('Shows StmtCond', () => {

            var container = document.createElement('div');
            QP.showPlan(container, plan_StmtCond);

            var condNode = container.querySelector('div[data-statement-id="1"] > div > .qp-node');
            assert.equal('COND', condNode.children[1].innerText);
            assert.equal(null, getProperty(condNode, 'Physical Operation'));
            assert.equal(null, getProperty(condNode, 'Logical Operation'));

            var printNode = container.querySelector('div[data-statement-id="2"] > div > .qp-node');
            assert.equal('PRINT', printNode.children[1].innerText);

        });

    });

});