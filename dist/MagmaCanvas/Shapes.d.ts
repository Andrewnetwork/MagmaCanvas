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
export declare abstract class CanvasObject extends Drawable {
    abstract contains(point: Point): boolean;
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
    color: string;
    fill: boolean;
    constructor(points: Point[], fill?: boolean, color?: string);
    draw(ctx: CanvasRenderingContext2D): void;
    splitBy(line: Line): Polygon[];
    pointsWith(axis: Axis, val: number): Point[];
    reflectOver(line: Line): Polygon[];
    has(targ: Point): boolean;
    pointFunc(startVal: number, axis: Axis, fun: (a: number, b: number) => boolean): number;
    max(axis: Axis): number;
    min(axis: Axis): number;
    center(): Point;
}
export declare class Circle extends CanvasObject {
    fillColor: string;
    pos: Point;
    radius: number;
    constructor(pos: Point, radius: number, fillColor?: string);
    draw(ctx: CanvasRenderingContext2D): void;
    contains(point: Point): boolean;
}
export declare class Line extends Drawable {
    ctx: CanvasRenderingContext2D;
    start: Point;
    end: Point;
    extend: Boolean;
    lineWidth: number;
    strokeStyle: string;
    constructor(start: Point, end: Point, lineWidth?: number, extend?: Boolean, strokeStyle?: string);
    draw(ctx: CanvasRenderingContext2D): void;
    slope(): number;
    findX(yVal: number): number;
    findY(xVal: number): number;
    orthLine(point: Point, lineWidth?: number, extend?: boolean, strokeStyle?: string): Line;
    isOn(point: Point): boolean;
    pointOfIntersection(line: Line): {
        x: number;
        y: number;
    };
}
export declare function includes(points: Point[], target: Point): boolean;
export declare function euclideanWalk(pts: Point[]): Point[];
