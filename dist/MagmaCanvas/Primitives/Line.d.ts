import { CanvasObject, Point } from "../Global";
export declare class Line extends CanvasObject {
    ctx: CanvasRenderingContext2D;
    start: Point;
    end: Point;
    extend: Boolean;
    lineWidth: number;
    strokeStyle: string;
    constructor(start: Point, end: Point, lineWidth?: number, extend?: Boolean, strokeStyle?: string);
    draw(ctx: CanvasRenderingContext2D): void;
    slope(): number;
    findX(yVal: number): number;
    findY(xVal: number): number;
    orthLine(point: Point, lineWidth?: number, extend?: boolean, strokeStyle?: string): Line;
    contains(point: Point): boolean;
    pointOfIntersection(line: Line): {
        x: number;
        y: number;
    };
}
