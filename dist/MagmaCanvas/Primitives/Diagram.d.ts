import { Point, CanvasObject } from "../Global";
export declare class Diagram extends CanvasObject {
    img: HTMLImageElement;
    loc: Point;
    constructor(src: string, loc: Point);
    draw(ctx: CanvasRenderingContext2D): void;
    contains(point: Point): boolean;
}
