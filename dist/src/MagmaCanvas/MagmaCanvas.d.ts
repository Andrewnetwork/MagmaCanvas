import { Drawable, Point, Diagram } from './Shapes';
export declare class MagmaCanvas {
    objects: Drawable[];
    ctx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    cursorImage: Diagram;
    constructor(containerID: string, width: number, height: number, history?: boolean, cursor?: boolean);
    add(obj: Drawable): number;
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
