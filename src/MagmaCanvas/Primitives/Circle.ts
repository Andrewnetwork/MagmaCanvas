/**
 * Circle.ts
 * Andrew Ribeiro 
 * July 2019
 */
import { Point,CanvasObject,PointFn,BoundingBox } from "../Global";
import { MagmaCanvas } from "../MagmaCanvas";

export class Circle extends CanvasObject{
    color:string;
    radius:number;
    fill:boolean;

    constructor(center:Point|PointFn,radius:number,fill:boolean=true,color:string = "blue"){
        super(center);
        this.color  = color;
        this.radius = radius;
        this.fill   = fill;
        this.boundingBox = new BoundingBox({x:this.center().x-radius-10,y:this.center().y-radius-10},radius*2+15,radius*2+15);
    }
    get area(){
        return Math.PI*(this.radius**2);
    }
    draw(ctx:CanvasRenderingContext2D){
        ctx.beginPath();
        ctx.arc(this.center().x,this.center().y,this.radius,0,Math.PI * 2, true);
        if(this.fill){
            ctx.fillStyle = this.color;
            ctx.fill();
        }else{
            ctx.strokeStyle = this.color;
            ctx.stroke();
        }
    }
    attach(mCanvas:MagmaCanvas,invokeRender:Function){
        let refs : number[] = [];
        this.invokeRender = invokeRender;
        return {refs};
    }
    contains(point:Point){
        let center : Point = <Point>this._center;
        if(this.center instanceof Function){
            center = this.center();
        }
        return  Math.sqrt((point.y - center.y)**2 + (point.x - center.x)**2) <= this.radius;
    }
}