import { CanvasObject, Point, BoundingBox, PointFn } from "../Global";
import { Circle } from "../Primitives";
export declare class Target extends CanvasObject {
    targetRings: Circle[];
    radius: number;
    objs: CanvasObject[];
    constructor(center?: Point | PointFn, boundingBox?: BoundingBox, nRings?: number, ringSize?: number);
    readonly area: number;
    contains(point: Point): boolean;
    score(point: Point): number;
    draw(ctx: CanvasRenderingContext2D): void;
    center(center?: Point | PointFn, callFunction?: boolean): Point;
    add(obj: CanvasObject): void;
}
