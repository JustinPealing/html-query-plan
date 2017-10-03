import { IQpOptions } from './interfaces';
export { drawSvgLines } from './svgLines';
export * from './interfaces';
/**
 *
 * @param container
 * @param planXml
 * @param options
 */
export declare function showPlan(container: HTMLElement, planXml: string, options: IQpOptions): void;
/**
 *
 * @param options
 * @param defaults
 */
export declare function setDefaults<T>(options: any, defaults: any): T;
