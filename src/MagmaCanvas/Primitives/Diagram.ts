/**
 * Diagram.ts
 * Andrew Ribeiro 
 * July 2019
 */
import { Point,CanvasObject,BoundingBox } from "../Global";

export class Diagram extends CanvasObject{
    img:HTMLImageElement;
    loc:Point;
    constructor(src:string,loc:Point){
        super(loc,new BoundingBox(loc,0,0));
        this.img = new Image();
        this.img.src = src;
        this.loc = loc; 
    }
    draw(ctx:CanvasRenderingContext2D){
        ctx.drawImage(this.img,this.loc.x,this.loc.y);
    }
    contains(point: Point): boolean {
        throw new Error("Method not implemented.");
    }
}