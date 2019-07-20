import { Drawable } from "./Shapes";
import { MagmaCanvas } from "./MagmaCanvas";
export declare class Grid extends Drawable {
    private _gridSpaceIndex;
    private _gridSpace;
    width: number;
    height: number;
    mCanvas: MagmaCanvas;
    shapeHandlers: number[];
    gridSpaces: number[];
    graphObjects: Drawable[];
    graphCanvas: HTMLCanvasElement;
    graphFns: Function[];
    constructor(width: number, height: number);
    gridSpace: number;
    draw(ctx: CanvasRenderingContext2D): void;
    attach(mCanvas: MagmaCanvas): void;
    make(): void;
    graph(fn: Function): void;
    drawGraphs(): void;
}
