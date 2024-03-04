import { Node } from "./node";
interface Point {
    x: number;
    y: number;
}
declare function drawLines(container: Element): void;
/**
 * Works out the position that each arrow should be drawn based on the offsets, for example
 * if there are 3 lines with thicknesses 2, 4 and 4 (and a gap of 2 pixels between lines) then
 * the lines need to be drawn at offsets -6, -1 and 5 relative to the center of the node.
 * @param thicknesses Array of line thicknesses.
 * @param gap Gap between each line.
 * @returns Array of offsets.
 */
declare function thicknessesToOffsets(thicknesses: Array<number>, gap: number): Array<number>;
/**
 * Works out how thick a line should be for a node.
 * @param node Node to work out the line thickness for.
 */
declare function nodeToThickness(node: Node): number;
/**
 * Creates the path for an arrow between two points.
 * @param to Coordinates of the the arrowhead (pointy) end.
 * @param from mid-point of the tail (flat) end.
 * @param bendX Offset from toPoint at which the "bend" should happen. (X axis).
 * @param thickness Width of the line / arrow, in pixels
 */
declare function arrowPath(to: Point, from: Point, bendX: number, thickness: number): number[][];
export { drawLines, arrowPath, thicknessesToOffsets, nodeToThickness };
