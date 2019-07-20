import { Drawable,CanvasObject,Point,CanvasReference } from "../Global/Interfaces";
import { PointFn } from "../Global/Types";
import { MagmaCanvas } from "../MagmaCanvas";

export class Text extends CanvasObject{

    contains(point: import("../Global/Interfaces").Point): boolean {
        throw new Error("Method not implemented.");
    }
    attach(mCanvas: MagmaCanvas):CanvasReference{
        throw new Error("Method not implemented.");
        return null;
    }
    
    draw(ctx: CanvasRenderingContext2D){
        ctx.font = '40px Arial';
        ctx.fillStyle = '#000000';
        ctx.fillText("Hello",this.center().x,this.center().y);
    }
    
}