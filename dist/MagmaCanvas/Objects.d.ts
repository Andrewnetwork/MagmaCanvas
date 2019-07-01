import { MagmaCanvas } from "./MagmaCanvas";
export declare class Grid {
    private _gridSpaceIndex;
    private _gridSpace;
    width: number;
    height: number;
    mCanvas: MagmaCanvas;
    shapeHandlers: number[];
    gridSpaces: number[];
    constructor(width: number, height: number);
    gridSpace: number;
    attach(mCanvas: MagmaCanvas): void;
    make(): void;
}
