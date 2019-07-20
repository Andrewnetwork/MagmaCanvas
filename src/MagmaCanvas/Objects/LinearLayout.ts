import { CanvasObject,CanvasReference,Point } from "../Global";
import { MagmaCanvas } from "../MagmaCanvas";

export class LinearLayout extends CanvasObject{
    canvasObjects:CanvasObject[];
    mCanvas:MagmaCanvas;
    counter:number;
    constructor(){
        super(null);
        this.canvasObjects = [];
        this.mCanvas = null;
        this.counter = 300;
    }
    contains(point:Point): boolean {
        throw new Error("Method not implemented.");
    }    
    attach(mCanvas:MagmaCanvas):CanvasReference{
        this.mCanvas = mCanvas;
        return null;
    }
    draw(ctx:CanvasRenderingContext2D){
    }
    add(obj:CanvasObject){
        this.canvasObjects.push(obj);
        obj.center({x:this.counter,y:200});
        this.mCanvas.add(obj);
        this.counter += 300;
        return this;
    }


}