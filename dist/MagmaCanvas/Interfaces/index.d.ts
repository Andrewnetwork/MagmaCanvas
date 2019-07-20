export declare abstract class Drawable {
    abstract draw(ctx: CanvasRenderingContext2D): void;
}
export declare abstract class CanvasObject extends Drawable {
    abstract contains(point: Point): boolean;
}
export interface Point {
    x: number;
    y: number;
}
export declare enum Axis {
    X = 0,
    Y = 1
}
