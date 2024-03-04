import { drawLines } from "./lines";
import { Node } from "./node";
interface Options {
    jsTooltips?: boolean;
}
declare function showPlan(container: Element, planXml: string, options?: Options): void;
export { drawLines as drawLines, showPlan, Node };
