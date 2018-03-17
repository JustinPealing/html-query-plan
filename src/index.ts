import * as xml from "./xml";
import { drawLines } from "./lines";
import { initTooltip } from "./tooltip";
import { Node } from "./node";

declare function require(path: string) : any;
let qpXslt = require("raw-loader!./qp.xslt");

interface Options {
    jsTooltips?: boolean
}

function showPlan(container: Element, planXml: string, options?: Options) {
    options = setDefaults(options, {
        jsTooltips: true
    });

    xml.setContentsUsingXslt(container, planXml, qpXslt);
    container["xml"] = new DOMParser().parseFromString(planXml, "text/xml");
    drawLines(container);

    if (options.jsTooltips) {
        initTooltip(container);
    }
}

function setDefaults(options: Options, defaults: Options) {
    let ret = {};
    for (let attr in defaults) {
        if (defaults.hasOwnProperty(attr)) {
            ret[attr] = defaults[attr];
        }
    }
    for (let attr in options) {
        if (options.hasOwnProperty(attr)) {
            ret[attr] = options[attr];
        }
    }
    return ret;
}

export { drawLines as drawLines, showPlan, Node }