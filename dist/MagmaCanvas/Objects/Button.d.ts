import { CanvasObject, Point } from "../Global";
import { MagmaCanvas } from "../MagmaCanvas";
export declare class Button extends CanvasObject {
    _onClick: Function;
    label: string;
    width: number;
    height: number;
    constructor(label: string, _onClick: Function, center?: Point);
    draw(ctx: CanvasRenderingContext2D): void;
    contains(point: Point): boolean;
    attach(mCanvas: MagmaCanvas): {
        refs: number[];
    };
}
