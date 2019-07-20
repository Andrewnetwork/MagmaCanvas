import { MagmaCanvas } from "../MagmaCanvas";
import { PointFn } from "../Global/Types";
import { Polygon, Rectangle } from "../Primitives";

export abstract class Drawable{
    abstract draw(ctx:CanvasRenderingContext2D) : void;
}
export abstract class CanvasObject extends Drawable{
    abstract contains(point:Point):boolean;
    abstract attach(mCanvas:MagmaCanvas,invokeRender:Function):CanvasReference;
    protected  _center:Point|PointFn;
    center:PointFn;
    invokeRender:Function;
    boundingBox:Rectangle;

    constructor(center:Point|PointFn){
        super();
        if((center as Point).x != null){
            //loc is a point. 
            this.center = (center:Point) => {
                if(this.invokeRender != null){
                    this.invokeRender();
                }
                return  center!=null ? this._center = center : <Point>this._center;
            }
        }else{
            //loc is a function.
            this.center = (point:Point) => {
                if(this.invokeRender != null){
                    this.invokeRender();
                }
                return (<PointFn>this._center)(point);
            }
        }
        this._center = center;
    }
}
export interface CanvasReference{
    refs:number[];
}
export interface Point{
    x : number
    y : number
}
