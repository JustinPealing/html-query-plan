import { assert } from 'chai';
import { arrowPath } from '../src/lines';

describe('lines.arrowPath', () => {

    it('Returns an arrow path 12 segments long with a bend that starts and ends at `to`', () => {

        let points:any = arrowPath({x:10,y:15}, {x:90,y:95}, 30, 2);
        assert.equal(12, points.length);

        assert.equal(10, points[0][0]);
        assert.equal(15, points[0][1]);
        
        assert.equal(13, points[1][0]);
        assert.equal(12, points[1][1]);

        assert.equal(13, points[2][0]);
        assert.equal(14, points[2][1]);

        assert.equal(31, points[3][0]);
        assert.equal(14, points[3][1]);

        assert.equal(31, points[4][0]);
        assert.equal(94, points[4][1]);

        assert.equal(90, points[5][0]);
        assert.equal(94, points[5][1]);

        assert.equal(90, points[6][0]);
        assert.equal(96, points[6][1]);

        assert.equal(29, points[7][0]);
        assert.equal(96, points[7][1]);

        assert.equal(29, points[7][0]);
        assert.equal(96, points[7][1]);

        assert.equal(13, points[9][0]);
        assert.equal(16, points[9][1]);

        assert.equal(13, points[10][0]);
        assert.equal(18, points[10][1]);
        
        assert.equal(10, points[11][0]);
        assert.equal(15, points[11][1]);

    });
    
    it('Returns a thicker arrow if width is larger', () => {

        let points:any = arrowPath({x:10,y:15}, {x:90,y:95}, 30, 8);
        assert.equal(12, points.length);

        assert.equal(10, points[0][0]);
        assert.equal(15, points[0][1]);
        
        assert.equal(16, points[1][0]);
        assert.equal(9, points[1][1]);

        assert.equal(16, points[2][0]);
        assert.equal(11, points[2][1]);

        assert.equal(34, points[3][0]);
        assert.equal(11, points[3][1]);

        assert.equal(34, points[4][0]);
        assert.equal(91, points[4][1]);

        assert.equal(90, points[5][0]);
        assert.equal(91, points[5][1]);

        assert.equal(90, points[6][0]);
        assert.equal(99, points[6][1]);

        assert.equal(26, points[7][0]);
        assert.equal(99, points[7][1]);

        assert.equal(26, points[7][0]);
        assert.equal(99, points[7][1]);

        assert.equal(16, points[9][0]);
        assert.equal(19, points[9][1]);

        assert.equal(16, points[10][0]);
        assert.equal(21, points[10][1]);
        
        assert.equal(10, points[11][0]);
        assert.equal(15, points[11][1]);

    });

});