import { setContentsUsingXslt } from './transform';
import { drawSvgLines } from './svgLines';
import { initTooltip } from './tooltip';
import qpXslt = require('raw!./qp.xslt');
import { IQpOptions } from './interfaces';

export { drawSvgLines } from './svgLines';
export * from './interfaces';

const defaultOptions: IQpOptions = {
    jsTooltips: true
}

/**
 * 
 * @param container 
 * @param planXml 
 * @param options 
 */
export function showPlan(container: HTMLElement, planXml: string, options: IQpOptions) {
    let _options = setDefaults<IQpOptions>(options, defaultOptions);

    setContentsUsingXslt(container, planXml, qpXslt);
    drawSvgLines(container);

    if (_options.jsTooltips) {
        initTooltip(container);
    }
}

/**
 * 
 * @param options 
 * @param defaults 
 */
export function setDefaults<T>(options, defaults): T {
    var ret: any = {};
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
