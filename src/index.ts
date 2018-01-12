import * as transform from './transform';
import { drawSvgLines } from './svgLines';
import { initTooltip } from './tooltip';

declare function require(path: string) : any;
let qpXslt = require('raw-loader!./qp.xslt');

function showPlan(container, planXml, options?) {
    options = setDefaults(options, {
        jsTooltips: true
    });

    transform.setContentsUsingXslt(container, planXml, qpXslt);
    drawSvgLines(container);

    if (options.jsTooltips) {
        initTooltip(container);
    }
}

function setDefaults(options, defaults) {
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

export { drawSvgLines as drawLines, showPlan }