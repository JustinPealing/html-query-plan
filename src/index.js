import transform from './transform.js';
import { drawSvgLines } from './svgLines.js';
import { initTooltip } from './tooltip.js';
var qpXslt = require('raw!./qp.xslt');

function showPlan(container, planXml, options) {
    var options = setDefaults(options, {
        jsTooltips: true
    });

    transform.setContentsUsingXslt(container, planXml, qpXslt);
    drawSvgLines(container);

    if (options.jsTooltips) {
        initTooltip(container);
    }
}

function setDefaults(options, defaults) {
    var ret = {};
    for (var attr in defaults) {
        if (defaults.hasOwnProperty(attr)) {
            ret[attr] = defaults[attr];
        }
    }
    for (var attr in options) {
        if (options.hasOwnProperty(attr)) {
            ret[attr] = options[attr];
        }
    }
    return ret;
}

module.exports.drawLines = drawSvgLines;
module.exports.showPlan = showPlan;