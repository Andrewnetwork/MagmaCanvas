/**
 * MagmaCanvas.ts
 * Andrew Ribeiro 
 * June 2019
 */
import { Drawable,Point,Polygon,Diagram } from './Shapes';

export class MagmaCanvas{
    objects:Drawable[];
    ctx:CanvasRenderingContext2D;
    canvas:HTMLCanvasElement;
    cursorImage:Diagram;
    /**
     * A managed canvas. 
     * @param containerID The ID of the HTML container the canvas is appended to. 
     * @param width Width of canvas.
     * @param height Height of canvas.
     * @param history Flag enabling canvas history. 
     */
    constructor(containerID:string,width:number,height:number,history:boolean = false,cursor:boolean = true){
        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("width",String(width));
        this.canvas.setAttribute("height",String(height));
        this.canvas.setAttribute("id","canvas");
        document.getElementById(containerID).appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.objects = [];

        if(cursor){
            this.cursorImage = new Diagram("cursor.png",{x:0,y:0});
            // Attach a cursor for the canvas. 
            this.addEventListener("mousemove",(_,pos)=>{
                if(this.cursorImage != null){
                    this.cursorImage.loc = {x:pos.x-5,y:pos.y-4};
                }
            });
            this.canvas.addEventListener("mouseleave",()=>{
                this.cursorImage = null;
            });
            this.canvas.addEventListener("mouseenter",()=>{
                this.cursorImage = new Diagram("cursor.png",{x:0,y:0});
            });
            
        }else{
            this.cursorImage = null;
        }
        // Setup render tick.
        setInterval(()=>this.render(),0);
    }
    add(obj:Drawable):number{
        this.objects.push(obj);
        let objectID = this.objects.length-1;
        return objectID;
    }
    addList(objs:Drawable[]):number[]{
        let ids : number[] = []
        objs.forEach((obj)=>{
            ids.push(this.add(obj));
        });
        return ids;
    }
    paintList(objs:Drawable[]){
        objs.forEach((obj)=>{
            obj.draw(this.ctx);
        });
    }
    paint(obj:Drawable){
        obj.draw(this.ctx);
    }
    render(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.objects.forEach((obj)=>obj.draw(this.ctx));
        if(this.cursorImage != null){
            this.cursorImage.draw(this.ctx);
        }
    }
    remove(id:number){
        delete this.objects[id];
    }
    removeList(ids:number[]){
        ids.forEach((id)=>{
            this.remove(id);
        });
    }
    clear(){
        this.objects = [];
    }
    move(objHandler:number,deltas:Point){
        if(this.objects[objHandler] instanceof Polygon){
            (<Polygon>this.objects[objHandler]).points.forEach((point)=>{
                point.x += deltas.x;
                point.y += deltas.y;
            });
        }
    }
    get(objectHandler:number){
        return this.objects[objectHandler];
    }
    addEventListener(event:string,listener:(e:MouseEvent,pos:Point)=>void){
        this.canvas.addEventListener(event,(e:MouseEvent)=>{
            let pos = getMousePos(this.canvas, e);
            listener(e,pos);
        });
    }
}
function getMousePos(canvas:HTMLCanvasElement, evt:MouseEvent):Point{
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}