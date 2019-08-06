import { MagmaCanvas } from "../MagmaCanvas";
import { PointFn } from "../Global/Types";
import { Point, CanvasReference } from "./Interfaces";
export declare class BoundingBox {
    upperLeft: Point;
    width: number;
    height: number;
    center: Point;
    constructor(upperLeft: Point, width: number, height: number);
    contains(point: Point): boolean;
    overlaps(box: BoundingBox): boolean;
}
export declare abstract class CanvasObject {
    abstract contains(point: Point): boolean;
    abstract draw(ctx: CanvasRenderingContext2D): void;
    protected _centerPoint: Point;
    protected _center: Point | PointFn;
    invokeRender: Function;
    boundingBox: BoundingBox;
    constructor(center?: Point | PointFn, boundingBox?: BoundingBox);
    readonly area: number;
    attach(mCanvas: MagmaCanvas, invokeRender: Function): CanvasReference;
    center(center?: Point | PointFn, callFunction?: boolean): Point;
}
