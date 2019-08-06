import { Point, CanvasObject, Axis } from "../Global";
import { Line } from "./Line";
export declare class Polygon extends CanvasObject {
    points: Point[];
    ctx: CanvasRenderingContext2D;
    color: string;
    fill: boolean;
    constructor(points: Point[], fill?: boolean, color?: string);
    draw(ctx: CanvasRenderingContext2D): void;
    splitBy(line: Line): Polygon[];
    pointsWith(axis: Axis, val: number): Point[];
    reflectOver(line: Line): Polygon[];
    has(targ: Point): boolean;
    pointFunc(startVal: number, axis: Axis, fun: (a: number, b: number) => boolean): number;
    max(axis: Axis): number;
    min(axis: Axis): number;
    contains(point: Point): boolean;
}
export declare function includes(points: Point[], target: Point): boolean;
export declare function euclideanWalk(pts: Point[]): Point[];
