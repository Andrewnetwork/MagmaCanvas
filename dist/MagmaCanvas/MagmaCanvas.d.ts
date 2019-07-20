import { Diagram } from './Primitives/Shapes';
import { Drawable, Point, CanvasObject } from './Global';
export declare class MagmaCanvas {
    objects: Drawable[];
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    cursorImage: Diagram;
    renderQueue: number[];
    constructor(containerID: string, width: number, height: number, history?: boolean, cursor?: boolean);
    add(obj: Drawable | CanvasObject, event?: string, eventListener?: (e: MouseEvent, pos: Point) => void): number;
    invokeRender(objectID: number): void;
    addList(objs: Drawable[]): number[];
    paintList(objs: Drawable[]): void;
    paint(obj: Drawable): void;
    render(): void;
    remove(id: number): void;
    removeList(ids: number[]): void;
    clear(): void;
    move(objHandler: number, deltas: Point): void;
    get(objectHandler: number): Drawable;
    addEventListener(event: string, listener: (e: MouseEvent, pos: Point) => void): void;
}
