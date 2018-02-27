import * as xml from "./xml";
import { drawLines } from "./lines";
import { initTooltip } from "./tooltip";
import { QpNode } from "./node";

declare function require(path: string) : any;
let qpXslt = require("raw-loader!./qp.xslt");

interface Options {
    jsTooltips?: boolean
}

function showPlan(container: Element, planXml: string, options?: Options) {
    options = setDefaults(options, {
        jsTooltips: true
    });

    let xmlDoc = xml.parse(planXml);
    xml.setContentsUsingXslt(container, xmlDoc, qpXslt);
    drawLines(container);
    container["xml"] = xmlDoc;

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

export { drawLines as drawLines, showPlan, QpNode }