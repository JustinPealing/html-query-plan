import * as assert from 'assert';
import * as QP from '../src/index';
import * as helper from './helper';
import { plan } from './plans';

describe('qp.js', () => {

    describe('showPlan()', () => {

        it('Adds canvas to .qp-root', () => {
            
            let container = helper.showPlan(plan.issue1);
            assert.notEqual(null, container.querySelector('svg'));
            
        });
        
        it('Calculates estimated subtree cost correctly', () => {

            let container = helper.showPlan(plan.issue1);
            assert.equal("0.14839", helper.getProperty(helper.findNodeById(container, "1"), "Estimated Subtree Cost"));
            assert.equal("0.0268975", helper.getProperty(helper.findNodeById(container, "18"), "Estimated Subtree Cost"));

        });

        it('Calculates estimated operator cost correctly', () => {

            let container = helper.showPlan(plan.issue1);
            assert.equal("0.000001 (0%)", helper.getProperty(helper.findNodeById(container, "0"), "Estimated Operator Cost"));
            assert.equal("0 (0%)", helper.getProperty(helper.findNodeById(container, "1"), "Estimated Operator Cost"));
            assert.equal("0.000025 (0%)", helper.getProperty(helper.findNodeById(container, "3"), "Estimated Operator Cost"));
            assert.equal("0 (0%)", helper.getProperty(helper.findNodeById(container, "4"), "Estimated Operator Cost"));
            assert.equal("0 (0%)", helper.getProperty(helper.findNodeById(container, "5"), "Estimated Operator Cost"));
            assert.equal("0 (0%)", helper.getProperty(helper.findNodeById(container, "6"), "Estimated Operator Cost"));
            assert.equal("0.0032957 (2%)", helper.getProperty(helper.findNodeById(container, "7"), "Estimated Operator Cost"));
            assert.equal("0.03992 (27%)", helper.getProperty(helper.findNodeById(container, "8"), "Estimated Operator Cost"));
            assert.equal("0.0000681 (0%)", helper.getProperty(helper.findNodeById(container, "9"), "Estimated Operator Cost"));
            assert.equal("0.0394237 (27%)", helper.getProperty(helper.findNodeById(container, "10"), "Estimated Operator Cost"));
            assert.equal("0 (0%)", helper.getProperty(helper.findNodeById(container, "11"), "Estimated Operator Cost"));
            assert.equal("0.0000266 (0%)", helper.getProperty(helper.findNodeById(container, "12"), "Estimated Operator Cost"));
            assert.equal("0.0000136 (0%)", helper.getProperty(helper.findNodeById(container, "13"), "Estimated Operator Cost"));
            assert.equal("0.03992 (27%)", helper.getProperty(helper.findNodeById(container, "15"), "Estimated Operator Cost"));
            assert.equal("0.0409408 (28%)", helper.getProperty(helper.findNodeById(container, "16"), "Estimated Operator Cost"));
            assert.equal("0.0268975 (18%)", helper.getProperty(helper.findNodeById(container, "18"), "Estimated Operator Cost"));

        });

        it ('Formats scientific numbers correctly', () => {

            let container = helper.showPlan(plan.issue1);
            assert.equal("0.000001", helper.getProperty(helper.findNodeById(container, "0"), "Estimated CPU Cost"));
            
        });

        it('Works out cost percentages based on the current statement',  () => {

            let container = helper.showPlan(plan.issue7);
            assert.equal("248.183 (99%)", helper.getProperty(helper.findNodeById(container, "4", "6"), "Estimated Operator Cost"));
            assert.equal("0.0032831 (100%)", helper.getProperty(helper.findNodeById(container, "3", "11"), "Estimated Operator Cost"));

        });

        it('Shows SetPredicate string in tooltip', () => {

            let container = helper.showPlan(plan.issue7);
            let clusteredIndexUpdate = helper.findNodeById(container, "0", "6");
            assert.equal('[mcLive].[Cadastre].[OwnerPersonParsed].[Multiword] = [Expr1002]',
                helper.getToolTipSection(clusteredIndexUpdate, 'Predicate'));

        });

        it('Shows predicates in tooltips where necessary', () => {

            let container = helper.showPlan(plan.NotShowingSeekPredicates);
            
            let indexSeekNode = helper.findNodeById(container, "26", "1");
            assert.equal("NOT [SMS].[dbo].[SMSresults].[Note] like 'PENDING%' AND NOT [SMS].[dbo].[SMSresults].[Note] like 'ALLOCATED%'",
                helper.getToolTipSection(indexSeekNode, 'Predicate'));

            let topNode = helper.findNodeById(container, "25", "1");
            assert.equal(null, helper.getToolTipSection(topNode, 'Predicate'));

        });

        it('Shows top expression in tooltips', () => {

            let container = helper.showPlan(plan.NotShowingSeekPredicates);
            let topNode = helper.findNodeById(container, "25", "1");
            assert.equal("(1)", helper.getToolTipSection(topNode, 'Top Expression'));

        });

        it('Shows seek predicates in tooltips', () => {

            let container = helper.showPlan(plan.NotShowingSeekPredicates);

            let topNode = helper.findNodeById(container, "26", "1");
            assert.equal("Seek Keys[1]: Prefix: [SMS].[dbo].[SMSresults].SMSID, [SMS].[dbo].[SMSresults].Status = Scalar Operator([SMS].[dbo].[SMSnew].[SMSID] as [N].[SMSID]), Scalar Operator('S')",
                helper.getToolTipSection(topNode, 'Seek Predicates'));

            let indexSeekNode = helper.findNodeById(container, "4", "1");
            assert.equal("Seek Keys[1]: Start: [SMS].[dbo].[SMSnew].DateStamp < Scalar Operator([@p1]), End: [SMS].[dbo].[SMSnew].DateStamp > Scalar Operator([@p0])",
               helper.getToolTipSection(indexSeekNode, 'Seek Predicates'));

        });

        it('Handles >= and <= seek predicates', () => {

            let container = helper.showPlan(plan.issue7);

            let clusteredIndexSeekNode = helper.findNodeById(container, "8", "12");
            assert.equal("Seek Keys[1]: Start: [mcLive].[Cadastre].[OwnerPersonParsed].RowId >= Scalar Operator([@MapMIN]), End: [mcLive].[Cadastre].[OwnerPersonParsed].RowId <= Scalar Operator([@ParsedMAX])",
                helper.getToolTipSection(clusteredIndexSeekNode, 'Seek Predicates'));

        });

        it('Shows Key Lookup when Lookup="true"', () => {

            let container = helper.showPlan(plan.KeyLookup);
            
            let keyLookup = helper.findNodeById(container, '5', '1');
            assert.equal('Key Lookup (Clustered)', helper.getNodeLabel(keyLookup));
            assert.equal('Key Lookup', helper.getProperty(keyLookup, 'Physical Operation'));
            assert.equal('Key Lookup', helper.getProperty(keyLookup, 'Logical Operation'));
            assert.equal('Uses a supplied clustering key to lookup on a table that has a clustered index.',
                helper.getDescription(keyLookup));
            assert.notEqual(null, keyLookup.querySelector('.qp-icon-KeyLookup'));

        });

        it('Shows Key Lookup when Lookup="1"', () => {

            let container = helper.showPlan(plan.NotShowingSeekPredicates);

            let keyLookup = helper.findNodeById(container, '6', '1');
            assert.equal('Key Lookup (Clustered)', helper.getNodeLabel(keyLookup));
            assert.equal('Key Lookup', helper.getProperty(keyLookup, 'Physical Operation'));
            assert.equal('Key Lookup', helper.getProperty(keyLookup, 'Logical Operation'));
            assert.equal('Uses a supplied clustering key to lookup on a table that has a clustered index.',
                helper.getDescription(keyLookup));
            assert.notEqual(null, keyLookup.querySelector('.qp-icon-KeyLookup'));

        });

        it('Shows Clustered Index Scan', () => {

            let container = helper.showPlan(plan.ClusteredIndexScan);

            let clusteredIndexScan = helper.findNodeById(container, '0', '1');
            assert.equal('Clustered Index Scan (Clustered)', helper.getNodeLabel(clusteredIndexScan));
            assert.equal('Clustered Index Scan', helper.getProperty(clusteredIndexScan, 'Physical Operation'));
            assert.equal('Clustered Index Scan', helper.getProperty(clusteredIndexScan, 'Logical Operation'));
            assert.equal('Scanning a clustered index, entirely or only a range.',
                helper.getDescription(clusteredIndexScan))
            assert.notEqual(null, clusteredIndexScan.querySelector('.qp-icon-ClusteredIndexScan'));

        });

        it('Shows Clustered Index Seek', () => {

            let container = helper.showPlan(plan.ClusteredIndexSeek);

            let clusteredIndexSeek = helper.findNodeById(container, '0', '1');
            assert.equal('Clustered Index Seek (Clustered)', helper.getNodeLabel(clusteredIndexSeek));
            assert.equal('Clustered Index Seek', helper.getProperty(clusteredIndexSeek, 'Physical Operation'));
            assert.equal('Clustered Index Seek', helper.getProperty(clusteredIndexSeek, 'Logical Operation'));
            assert.equal('Scanning a particular range of rows from a clustered index.',
                helper.getDescription(clusteredIndexSeek))
            assert.notEqual(null, clusteredIndexSeek.querySelector('.qp-icon-ClusteredIndexSeek'));

        });

        it('Has correct icon for Table Valued Functions', () => {

            let container = helper.showPlan(plan.QueryPlan293288248);
            let tableValuedFunction = helper.findNodeById(container, '7', '1');
            assert.notEqual(null, tableValuedFunction.querySelector('.qp-icon-TableValuedFunction'))

        });

        it('Shows StmtUseDb', () => {

            let container = helper.showPlan(plan.StmtUseDb);
            let statementNode = container.querySelector('div[data-statement-id="1"] > div > .qp-node');
            assert.equal('USE DATABASE', helper.getNodeLabel(statementNode));
            assert.equal(null, helper.getProperty(statementNode, 'Physical Operation'));
            assert.equal(null, helper.getProperty(statementNode, 'Logical Operation'));

        });
        
        it('Shows StmtCond', () => {

            let container = helper.showPlan(plan.StmtCond);

            let condNode = container.querySelector('div[data-statement-id="1"] > div > .qp-node');
            assert.equal('COND', helper.getNodeLabel(condNode));
            assert.equal(null, helper.getProperty(condNode, 'Physical Operation'));
            assert.equal(null, helper.getProperty(condNode, 'Logical Operation'));

            let printNode = container.querySelector('div[data-statement-id="2"] > div > .qp-node');
            assert.equal('PRINT', helper.getNodeLabel(printNode));

        });

        describe('Stored Procedure Node', () => {

            it('Has Stored Procedure as node text', () => {

                let container = helper.showPlan(plan.manyLines);
                let sp = container.querySelectorAll('.qp-node')[1];
                assert.equal('Stored Procedure', helper.getNodeLabel(sp));

            })

            it('Has Procedure Name in tooltip', () => {

                let container = helper.showPlan(plan.manyLines);
                let sp = container.querySelectorAll('.qp-node')[1];
                assert.equal('TEST', helper.getToolTipSection(sp, 'Procedure Name'));

            });

        });
        
        describe('Tooltip Ordered Property', () => {

            it('Shows True when @Ordered = true', () => {

                let container = helper.showPlan(plan.KeyLookup);
                let indexSeek = helper.findNodeById(container, '3', '1');
                assert.equal('True', helper.getProperty(indexSeek, 'Ordered'));

            });

            it('Shows False when @Ordered = false', () => {

                let container = helper.showPlan(plan.NestedLoops);
                let indexSeek = helper.findNodeById(container, '3', '1');
                assert.equal('False', helper.getProperty(indexSeek, 'Ordered'));

            });

            it('Shows True when @Ordered = 1', () => {

                let container = helper.showPlan(plan.issue1);
                let indexSeek = helper.findNodeById(container, '7', '1');
                assert.equal('True', helper.getProperty(indexSeek, 'Ordered'));

            });

            it('Shows False when @Ordered = 0', () => {

                let container = helper.showPlan(plan.issue7);
                let indexSeek = helper.findNodeById(container, '2', '10');
                assert.equal('False', helper.getProperty(indexSeek, 'Ordered'));

            });

        });
        
        describe('Tooltip Number of Executions Property', () => {

            it('Sums @ActualExecutions over each RunTimeCountersPerThread elements', () => {

                let container = helper.showPlan(plan.MyCommentScoreDistribution);
                let indexSeek = helper.findNodeById(container, '4', '1');
                assert.equal('8', helper.getProperty(indexSeek, 'Number of Executions'));

            });

        });
        
        describe('Tooltip Action Numer of Rows Property', () => {

            it('Sums @ActualRows over each RunTimeCountersPerThread elements', () => {

                let container = helper.showPlan(plan.MyCommentScoreDistribution);
                let indexSeek = helper.findNodeById(container, '4', '1');
                assert.equal('413', helper.getProperty(indexSeek, 'Actual Number of Rows'));

            });

        });
        
        describe('Tooltip Order By', () => {

            it('Shows Ascending with @Ascending = true', () => {

                let container = helper.showPlan(plan.keysetCursor);
                let sort = helper.findNodeById(container, '4', '2');
                assert.equal('[Northwind].[dbo].[Employee].EmpName Ascending', helper.getToolTipSection(sort, 'Order By'));

            });

            it('Shows Descending with @Ascending = false', () => {

                let container = helper.showPlan(plan.NestedLoops);
                let sort = helper.findNodeById(container, '1', '1');
                assert.equal('[DataExplorer].[dbo].[Queries].FirstRun Descending', helper.getToolTipSection(sort, 'Order By'));

            });

            it('Shows Ascending with @Ascending = 1', () => {

                let container = helper.showPlan(plan.UpvotesForEachTag);
                let sort = helper.findNodeById(container, '4', '1');
                assert.equal('[StackOverflow.Exported].[dbo].[Tags].TagName Ascending', helper.getToolTipSection(sort, 'Order By'));

            });

            it('Shows Descending with @Ascending = 0', () => {

                let container = helper.showPlan(plan.UpvotesForEachTag);
                let sort = helper.findNodeById(container, '0', '1');
                assert.equal('Expr1012 Descending', helper.getToolTipSection(sort, 'Order By'));

            });

        });
        
        describe('Tooltip Estimated Number of Executions Property', () => {

            it('Equals @EstimateRebinds + 1', () => {

                let container = helper.showPlan(plan.UpvotesForEachTag);
                let clusteredIndexSeek = helper.findNodeById(container, '16', '1');
                assert.equal('25.898', helper.getProperty(clusteredIndexSeek, 'Estimated Number of Executions'));

            });

        });
        
        describe('Tooltip Actual Rebinds Property', () => {

            it('Sums @ActualRebinds over each RunTimeCountersPerThread elements', () => {

                let container = helper.showPlan(plan.UpvotesForEachTag);
                let sort = helper.findNodeById(container, '4', '1');
                assert.equal('8', helper.getProperty(sort, 'Actual Rebinds'));

            });

            it('Is zero when @ActualRebinds is present but sums to 0', () => {

                let container = helper.showPlan(plan.UpvotesForEachTag);
                let sort = helper.findNodeById(container, '5', '1');
                assert.equal('0', helper.getProperty(sort, 'Actual Rebinds'));

            });

            it('Is not present if RunTimeInformation is missing', () => {

                let container = helper.showPlan(plan.UpvotesForEachTag);
                let sort = helper.findNodeById(container, '2', '1');
                assert.equal(null, helper.getProperty(sort, 'Actual Rebinds'));

            });

        });
        
        describe('Tooltip Actual Rewinds Property', () => {

            it('Sums @ActualRewinds over each RunTimeCountersPerThread elements', () => {

                let container = helper.showPlan(plan.UpvotesForEachTag);
                let sort = helper.findNodeById(container, '4', '1');
                assert.equal('0', helper.getProperty(sort, 'Actual Rewinds'));

            });

            it('Is not present if RunTimeInformation is missing', () => {

                let container = helper.showPlan(plan.UpvotesForEachTag);
                let sort = helper.findNodeById(container, '2', '1');
                assert.equal(null, helper.getProperty(sort, 'Actual Rewinds'));

            });

        });
        
        describe('Tooltip Storage Property', () => {

            it('Is not present if */@Storage is not present', () => {

                let container = helper.showPlan(plan.ClusteredIndexScan);
                let clusteredIndexScan = helper.findNodeById(container, '0', '1');
                assert.equal(null, helper.getProperty(clusteredIndexScan, 'Storage'));

            });

            it('Matches IndexScan/@Storage', () => {

                let container = helper.showPlan(plan.KeyLookup);
                let indexSeek = helper.findNodeById(container, '3', '1');
                assert.equal('RowStore', helper.getProperty(indexSeek, 'Storage'));

            });

            it('Matches TableScan/@Storage', () => {

                let container = helper.showPlan(plan.cursor2);
                let tableScan = helper.findNodeById(container, '2', '4');
                assert.equal('RowStore', helper.getProperty(tableScan, 'Storage'));

            });

        });

        describe('Actual Execution Mode Property', () => {

            it ('Is "Batch" when @ActualExecutionMode = "Batch"', () => {

                let container = helper.showPlan(plan.batchMode);
                let indexScan = helper.findNodeById(container, '4', '1');
                assert.equal('Batch', helper.getProperty(indexScan, 'Actual Execution Mode'));

            });

            it ('Is "Row" when @ActualExecutionMode = "Row"', () => {

                let container = helper.showPlan(plan.batchMode);
                let parallelism = helper.findNodeById(container, '0', '1');
                assert.equal('Row', helper.getProperty(parallelism, 'Actual Execution Mode'));

            });

            it ('Is "Row" when @ActualExecutionMode is missing', () => {

                let container = helper.showPlan(plan.issue1);
                let nestedLoops = helper.findNodeById(container, '1', '1');
                assert.equal('Row', helper.getProperty(nestedLoops, 'Actual Execution Mode'));

            });

            it ('Is missing for estimated plans', () => {

                let container = helper.showPlan(plan.batchModeEstimated);
                let indexScan = helper.findNodeById(container, '4', '1');
                assert.equal(null, helper.getProperty(indexScan, 'Actual Execution Mode'));

            });

        });

        describe('Actual Number of Batches Mode Property', () => {

            it ('Sums @Batches over each RunTimeCountersPerThread elements', () => {

                let container = helper.showPlan(plan.batchMode);
                let indexScan = helper.findNodeById(container, '4', '1');
                assert.equal('14505', helper.getProperty(indexScan, 'Actual Number of Batches'));

            });

            it ('Is 0 if @Batches is missing', () => {

                let container = helper.showPlan(plan.issue1);
                let nestedLoops = helper.findNodeById(container, '1', '1');
                assert.equal('0', helper.getProperty(nestedLoops, 'Actual Number of Batches'));

            });

            it ('Is missing for estimated plans', () => {

                let container = helper.showPlan(plan.batchModeEstimated);
                let indexScan = helper.findNodeById(container, '1', '1');
                assert.equal(null, helper.getProperty(indexScan, 'Actual Number of Batches'));

            });

        });
        
        describe('Estimated Number of Rows to be Read Property', () => {
            
            it ('Is missing if @EstimatedRowsRead is not present', () => {

                let container = helper.showPlan(plan.issue39);
                let nestedLoops = helper.findNodeById(container, '1', '1');
                assert.equal(null, helper.getProperty(nestedLoops, 'Estimated Number of Rows to be Read'));

            });

            it ('Matches @EstimatedRowsRead when present', () => {

                let container = helper.showPlan(plan.issue39);
                let node2 = helper.findNodeById(container, '2', '1');
                assert.equal('4', helper.getProperty(node2, 'Estimated Number of Rows to be Read'));

            });

        });
        
        describe('Number of Rows Read Property', () => {
            
            it ('Is missing if @ActualRowsRead is not present', () => {

                let container = helper.showPlan(plan.issue39);
                let nestedLoops = helper.findNodeById(container, '1', '1');
                assert.equal(null, helper.getProperty(nestedLoops, 'Number of Rows Read'));

            });

            it ('Sums @ActualRowsRead over each RunTimeCountersPerThread elements', () => {

                let container = helper.showPlan(plan.KeyLookup);
                let node2 = helper.findNodeById(container, '3', '1');
                assert.equal('944', helper.getProperty(node2, 'Number of Rows Read'));

            });

        });

        describe('Partitioning Type Property', () => {

            it ('Is missing if Parallelism/@PartitioningType is not present', () => {

                let container = helper.showPlan(plan.UpvotesForEachTag);
                let gatherStreams = helper.findNodeById(container, '1', '1');
                assert.equal(null, helper.getProperty(gatherStreams, 'Partitioning Type'));

            });

            it ('Matches Parallelism/@PartitioningType if present', () => {

                let container = helper.showPlan(plan.UpvotesForEachTag);
                let repartitionStreams = helper.findNodeById(container, '5', '1');
                assert.equal('Hash', helper.getProperty(repartitionStreams, 'Partitioning Type'));

            });

        });

        describe('Estimated Execution Mode Property', () => {

            it('Matches @EstimatedExecutionMode when present', () => {

                let container = helper.showPlan(plan.batchMode);
                let colunstoreIndexScan = helper.findNodeById(container, '4', '1');
                assert.equal('Batch', helper.getProperty(colunstoreIndexScan, 'Estimated Execution Mode'));

            });

        });

        describe('Adaptive Join Node', () => {

            it('Has correct tooltip description and icon', () => {

                let container = helper.showPlan(plan.adaptive_join);
                let adaptiveJoin = helper.findNodeById(container, '0');
                assert.equal('Adaptive Join', helper.getNodeLabel(adaptiveJoin));
                assert.equal('Chooses dynamically between hash join and nested loops.', helper.getDescription(adaptiveJoin));
                assert.notEqual(null, adaptiveJoin.querySelector('.qp-icon-AdaptiveJoin'));
                assert.equal('Nested Loops', helper.getProperty(adaptiveJoin, 'Actual Join Type'));
                assert.equal('Nested Loops', helper.getProperty(adaptiveJoin, 'Estimated Join Type'));
                assert.equal('True', helper.getProperty(adaptiveJoin, 'Is Adaptive'));
                assert.equal('80.8673', helper.getProperty(adaptiveJoin, 'Adaptive Threshold Rows'));

            });

            it('Does not show Join Type etc... on nodes other than Adaptive Join', () => {

                let container = helper.showPlan(plan.adaptive_join);
                let indexSeek = helper.findNodeById(container, '2');
                assert.equal(null, helper.getProperty(indexSeek, 'Actual Join Type'));
                assert.equal(null, helper.getProperty(indexSeek, 'Estimated Join Type'));
                assert.equal(null, helper.getProperty(indexSeek, 'Is Adaptive'));
                assert.equal(null, helper.getProperty(indexSeek, 'Adaptive Threshold Rows'));

            });

            it('Does not show Actual info on estimated plans', () => {

                let container = helper.showPlan(plan.adaptive_join_estimated);
                let adaptiveJoin = helper.findNodeById(container, '0');
                assert.equal('Adaptive Join', helper.getNodeLabel(adaptiveJoin));
                assert.equal(null, helper.getProperty(adaptiveJoin, 'Actual Join Type'));
                assert.equal('Nested Loops', helper.getProperty(adaptiveJoin, 'Estimated Join Type'));
                assert.equal('True', helper.getProperty(adaptiveJoin, 'Is Adaptive'));
                assert.equal('80.8673', helper.getProperty(adaptiveJoin, 'Adaptive Threshold Rows'));

            });

            it('Shows Hash Keys Probe in tooltip',  () => {

                let container = helper.showPlan(plan.adaptive_join_estimated);
                let adaptiveJoin = helper.findNodeById(container, '0');
                assert.equal('[Test].[dbo].[Numbers2].NumberID2',
                    helper.getToolTipSection(adaptiveJoin, 'Hash Keys Probe'));

            });

            it('Shows Outer References to tooltip', () => {

                let container = helper.showPlan(plan.adaptive_join_estimated);
                let adaptiveJoin = helper.findNodeById(container, '0');
                assert.equal('[Test].[dbo].[Numbers1].NumberID1',
                    helper.getToolTipSection(adaptiveJoin, 'Outer References'));

            });

        });

        describe('RID Lookup Node', () => {

            it('Has the correct node name and description', () => {

                let container = helper.showPlan(plan.rid_lookup);
                let ridLookup = helper.findNodeById(container, '3');
                assert.equal('RID Lookup (Heap)', helper.getNodeLabel(ridLookup));

            });

        });

        describe('Index Spool Node', () => {

            it('Has Correct Title & Description', () => {

                let container = helper.showPlan(plan.index_spool);
                let indexSpool = helper.findNodeById(container, '3');
                assert.equal('Index Spool', helper.getNodeLabel(indexSpool));
                assert.equal('Reformats the data from the input into a temporary index, which is then used for seeking with the supplied seek predicate.',
                    helper.getDescription(indexSpool));

            });

        });

    });

    describe('Cached plan size', () => {

        it('Is @CachedPlanSize (in KB)', () => {

            let container = helper.showPlan(plan.adaptive_join);
            let select = container.querySelector('div[data-statement-id="1"] > div > .qp-node');
            assert.equal('48 KB', helper.getProperty(select, 'Cached plan size'));

        });

    });

});