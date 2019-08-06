import { Point, CanvasObject, PointFn } from "../Global";
import { MagmaCanvas } from "../MagmaCanvas";
export declare class Circle extends CanvasObject {
    color: string;
    radius: number;
    fill: boolean;
    constructor(center: Point | PointFn, radius: number, fill?: boolean, color?: string);
    readonly area: number;
    draw(ctx: CanvasRenderingContext2D): void;
    attach(mCanvas: MagmaCanvas, invokeRender: Function): {
        refs: number[];
    };
    contains(point: Point): boolean;
}
