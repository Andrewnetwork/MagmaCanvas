export interface Point {
    x: number;
    y: number;
}
export declare enum Axis {
    X = 0,
    Y = 1
}
export declare abstract class Drawable {
    abstract draw(ctx: CanvasRenderingContext2D): void;
}
export declare class Shapes {
    static makeRect(x: number, y: number, w: number, h: number): Polygon;
}
export declare class Diagram extends Drawable {
    img: HTMLImageElement;
    loc: Point;
    constructor(src: string, loc: Point);
    draw(ctx: CanvasRenderingContext2D): void;
}
export declare class Polygon extends Drawable {
    points: Point[];
    ctx: CanvasRenderingContext2D;
    fillColor: string;
    constructor(points: Point[], fillColor?: string);
    draw(ctx: CanvasRenderingContext2D): void;
    splitBy(line: Line): Polygon[];
    static validPolygon(points: Point[]): void;
    pointsWith(axis: Axis, val: number): Point[];
    lineIntersects(line: Line): Boolean;
    has(targ: Point): boolean;
    pointFunc(startVal: number, axis: Axis, fun: (a: number, b: number) => boolean): number;
    max(axis: Axis): number;
    min(axis: Axis): number;
    center(): Point;
}
export declare class Circle extends Drawable {
    fillColor: string;
    pos: Point;
    radius: number;
    constructor(pos: Point, radius: number, fillColor?: string);
    draw(ctx: CanvasRenderingContext2D): void;
}
export declare class Line extends Drawable {
    ctx: CanvasRenderingContext2D;
    start: Point;
    end: Point;
    extend: Boolean;
    lineWidth: number;
    constructor(start: Point, end: Point, lineWidth?: number, extend?: Boolean);
    draw(ctx: CanvasRenderingContext2D): void;
    slope(): number;
    findX(yVal: number): number;
    findY(xVal: number): number;
}
export declare function includes(points: Point[], target: Point): boolean;
