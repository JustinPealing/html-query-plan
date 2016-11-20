import transform from './transform.js';
import { drawSvgLines } from './svgLines.js';
import { initTooltip } from './tooltip.js';
var qpXslt = require('raw!./qp.xslt');

function showPlan(container, planXml) {
    transform.setContentsUsingXslt(container, planXml, qpXslt);
    drawSvgLines(container);
    initTooltip(container);
}

module.exports.drawLines = drawSvgLines;
module.exports.showPlan = showPlan;