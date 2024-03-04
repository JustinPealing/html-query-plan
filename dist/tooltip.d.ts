import { Line } from "./node";
declare function initTooltip(container: Element): void;
/**
 * Builds the tooltip HTML for a Line.
 * @param line Line to build the tooltip for.
 */
declare function buildLineTooltip(line: Line): HTMLElement;
/**
 * Convets sizes to human readable strings.
 * @param b Size in bytes.
 */
declare function convertSize(b: number): string;
export { initTooltip, buildLineTooltip, convertSize };
