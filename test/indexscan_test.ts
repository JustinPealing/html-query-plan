import * as assert from 'assert';
import * as QP from '../src/index';
import * as helper from './helper';
import { plan } from './plans';

describe('IndexScan Nodes', () => {

    /*
     * If the s:IndexScan/s:Object/@IndexKind attribute is present then we should
     * append it to the node title in brackets, e..g. "Clustered Index Seek (Clustered)"
     * in both the node and the tooltip header.
     */
    it('Has index kind appended when present', () => {
        
        let container = helper.showPlan(plan.adaptive_join);
        let indexSeek = helper.findNodeById(container, "7");
        assert.equal("Index Seek (NonClustered)", helper.getNodeLabel(indexSeek));
        assert.equal("Index Seek (NonClustered)", helper.getTooltipTitle(indexSeek));
        
    });

    /*
     * If the s:IndexScan/s:Object/@IndexKind attribute is missing, the index kind
     * should not be shown (e.g. "Clustered Index Seek").
     */
    it('Does not have index kind appended when not present', () => {

        let container = helper.showPlan(plan.issue1);
        let clusteredIndexSeek = helper.findNodeById(container, "16");
        assert.equal("Clustered Index Seek", helper.getNodeLabel(clusteredIndexSeek));
        assert.equal("Clustered Index Seek", helper.getTooltipTitle(clusteredIndexSeek));

    });

    /*
     * If the s:IndexScan/@Storage = "ColumnStore", then SSMS shows the node 
     * with the title "Columnstore Index Scan", ignoring the @PhysicalOp attribute
     */
    it('Shows "Columnstore Index Scan" when @Storage = "ColumnStore"', () => {

        let container = helper.showPlan(plan.adaptive_join);
        let columnstoreIndexScan = helper.findNodeById(container, "2");
        assert.equal("Columnstore Index Scan (Clustered)", helper.getNodeLabel(columnstoreIndexScan));
        assert.equal("Columnstore Index Scan (Clustered)", helper.getTooltipTitle(columnstoreIndexScan));

    });

    /*
     * SSMS special cases plans where s:IndexScan/@Lookup is "1" or "true" depending on the index
     * kind - a clustered index means a "Key Lookup", otherwise its a "RID Lookup".
     */
    it('Shows "Key Lookup" if the @Lookup attribute is present and @IndexKind="Clustered"', () => {

        let container = helper.showPlan(plan.KeyLookup);
        let keyLookup = helper.findNodeById(container, "5");
        assert.equal("Key Lookup (Clustered)", helper.getNodeLabel(keyLookup));
        assert.equal("Key Lookup (Clustered)", helper.getTooltipTitle(keyLookup));

    });
    
    /*
    * As above, but for non-clustered indexes.
    */
    it('Shows "RID Lookup" if the @Lookup attribute is present and @IndexKind is not equal to "Clustered"', () => {

        let container = helper.showPlan(plan.rid_lookup);
        let ridLookup = helper.findNodeById(container, "3");
        assert.equal("RID Lookup (Heap)", helper.getNodeLabel(ridLookup));
        assert.equal("RID Lookup (Heap)", helper.getTooltipTitle(ridLookup));

    });

});