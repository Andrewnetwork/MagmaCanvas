import { MagmaCanvas } from "../MagmaCanvas";
import { CanvasObject, CanvasReference, Point } from "../Global";
export declare class Grid extends CanvasObject {
    private _gridSpaceIndex;
    private _gridSpace;
    width: number;
    height: number;
    mCanvas: MagmaCanvas;
    shapeHandlers: number[];
    gridSpaces: number[];
    graphObjects: CanvasObject[];
    graphCanvas: HTMLCanvasElement;
    graphFns: Function[];
    plottedPoints: Point[];
    constructor(width: number, height: number);
    gridSpace: number;
    draw(ctx: CanvasRenderingContext2D): void;
    zoomIn(): boolean;
    zoomOut(): boolean;
    attach(mCanvas: MagmaCanvas, invokeRender: Function): CanvasReference;
    make(): void;
    graph(fn: Function): void;
    plot(point: Point): void;
    plot_points(points: Point[]): void;
    clearGraphs(): void;
    translatePoint(point: Point): {
        x: number;
        y: number;
    };
    drawGraphs(): void;
    contains(point: Point): boolean;
}
