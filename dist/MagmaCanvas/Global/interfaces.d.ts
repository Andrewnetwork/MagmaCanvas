import { MagmaCanvas } from "../MagmaCanvas";
import { PointFn } from "../Global/Types";
import { Rectangle } from "../Primitives";
export declare abstract class Drawable {
    abstract draw(ctx: CanvasRenderingContext2D): void;
}
export declare abstract class CanvasObject extends Drawable {
    abstract contains(point: Point): boolean;
    abstract attach(mCanvas: MagmaCanvas, invokeRender: Function): CanvasReference;
    protected _center: Point | PointFn;
    center: PointFn;
    invokeRender: Function;
    boundingBox: Rectangle;
    constructor(center: Point | PointFn);
}
export interface CanvasReference {
    refs: number[];
}
export interface Point {
    x: number;
    y: number;
}
