import { CanvasObject, CanvasReference } from "../Global/Interfaces";
import { MagmaCanvas } from "../MagmaCanvas";
export declare class Text extends CanvasObject {
    contains(point: import("../Global/Interfaces").Point): boolean;
    attach(mCanvas: MagmaCanvas): CanvasReference;
    draw(ctx: CanvasRenderingContext2D): void;
}
