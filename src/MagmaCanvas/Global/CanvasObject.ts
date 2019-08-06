import { MagmaCanvas } from "../MagmaCanvas";
import { PointFn } from "../Global/Types";
import { Point, CanvasReference } from "./Interfaces";

export class BoundingBox{
    upperLeft:Point;
    width:number;
    height:number;
    center:Point;

    constructor(upperLeft:Point,width:number,height:number){
        this.center    = {x:upperLeft.x+(width/2),y:upperLeft.y+(height/2)};
        this.upperLeft = upperLeft;
        this.width     = width;
        this.height    = height;
    }
    contains(point: Point): boolean {
        let xCont = point.x <= this.center.x + this.width/2 && point.x >= this.center.x - this.width/2;
        let yCont = point.y <= this.center.y + this.height/2 && point.y >= this.center.y - this.height/2;
        return xCont && yCont
    }
    overlaps(box:BoundingBox):boolean{
        let xCont = Math.abs(this.upperLeft.x-box.upperLeft.x)<=this.width+box.width;
        let yCont = Math.abs(this.upperLeft.y-box.upperLeft.y)<=this.height+box.height;
        return xCont && yCont;
    }
}
export abstract class CanvasObject{
    abstract contains(point:Point):boolean;
    abstract draw(ctx:CanvasRenderingContext2D) : void;
    protected _centerPoint:Point;
    protected _center:Point|PointFn;
    invokeRender:Function;
    boundingBox:BoundingBox;

    constructor(center:Point|PointFn={x:0,y:0},boundingBox:BoundingBox=null){
        this.boundingBox = boundingBox;
        this.center(center);
    }
    get area():number{
        return 0;
    }
    attach(mCanvas:MagmaCanvas,invokeRender:Function):CanvasReference{
        this.invokeRender = invokeRender;
        return null;
    }
    /**
     * Getter and setter for the center object. 
     * @param center 
     * @param callFunction 
     */
    center(center?:Point|PointFn,callFunction:boolean=false):Point{
        if(center == null){
            // Get center. 
            if((this._center as Point).x == null){
                // Can the center function to get an updated center point. 
                this._centerPoint = (<PointFn>this._center)();
            }
            return this._centerPoint;
        }else{
            // Set center.
            let prevCenter = this._centerPoint;
            if((center as Point).x != null){
                this._center = center;
                this._centerPoint = <Point>this._center;
            }else{
                if(callFunction){
                    this._centerPoint = (<PointFn>this._center)(<Point>center);
                }else{
                    this._center = center;
                    return null;
                }
            }
            // Update the bounding box. 
            if(prevCenter != null &&  this.boundingBox != null){
                let bbc = this.boundingBox.upperLeft;
                let x = bbc.x - (prevCenter.x - this._centerPoint.x);
                let y = bbc.y - (prevCenter.y - this._centerPoint.y);
                this.boundingBox.upperLeft = {x,y};
                //this.invokeRender();
            }
            return this._centerPoint;
        }
    }
}