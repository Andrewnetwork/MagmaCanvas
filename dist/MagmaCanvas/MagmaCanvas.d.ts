import { Diagram } from './Primitives';
import { Point, CanvasObject } from './Global';
export declare class MagmaCanvas {
    objects: CanvasObject[];
    ctx: CanvasRenderingContext2D;
    layers: HTMLCanvasElement[];
    layersObjects: CanvasObject[][];
    canvas: HTMLCanvasElement;
    cursorImage: Diagram;
    renderQueue: number[];
    constructor(containerID: string, width: number, height: number, history?: boolean, cursor?: boolean);
    add(obj: CanvasObject, layer?: number): number;
    invokeRender(objectID: number): void;
    addList(objs: CanvasObject[]): number[];
    paintList(objs: CanvasObject[]): void;
    paint(obj: CanvasObject): void;
    render(): void;
    remove(id: number): void;
    removeList(ids: number[]): void;
    clear(): void;
    move(objHandler: number, deltas: Point): void;
    get(objectHandler: number): CanvasObject;
    addEventListener(event: string, listener: (e: MouseEvent, pos: Point) => void, objID?: number): void;
}
