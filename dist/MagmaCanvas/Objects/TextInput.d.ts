import { Point, CanvasObject } from "../Global";
import { MagmaCanvas } from "../MagmaCanvas";
export declare class TextInput extends CanvasObject {
    active: boolean;
    width: number;
    height: number;
    counter: number;
    showCursor: boolean;
    value: string;
    constructor(active?: boolean, center?: Point);
    contains(point: Point): boolean;
    draw(ctx: CanvasRenderingContext2D): void;
    attach(mCanvas: MagmaCanvas): {
        refs: number[];
    };
}
