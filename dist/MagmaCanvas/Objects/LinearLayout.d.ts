import { CanvasObject, CanvasReference, Point } from "../Global";
import { MagmaCanvas } from "../MagmaCanvas";
export declare class LinearLayout extends CanvasObject {
    canvasObjects: CanvasObject[];
    mCanvas: MagmaCanvas;
    counter: number;
    constructor();
    contains(point: Point): boolean;
    attach(mCanvas: MagmaCanvas): CanvasReference;
    draw(ctx: CanvasRenderingContext2D): void;
    add(obj: CanvasObject): this;
}
