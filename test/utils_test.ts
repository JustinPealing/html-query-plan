import { assert } from "chai";
import * as utils from "../src/utils";

let html = new DOMParser().parseFromString(`
<div class="a">
    <div class="b">
        <div class="c" />
    </div>
</div>
`, "application/xml").documentElement;

describe("Utils module", () => {

    describe("findAncestorP function", () => {

        it("Finds an ancestor given a predictae", () => {

            let c = html.getElementsByClassName("c")[0];
            assert.equal("b", utils.findAncestorP(c, e => e.className == "b").className);
            assert.equal("a", utils.findAncestorP(c, e => e.className == "a").className);

        });

        it("Returns null if there is no match", () =>  {
    
            let c = html.getElementsByClassName("c")[0];
            assert.equal(null, utils.findAncestorP(c, e => e.className == "z"));

        });

    });

});
