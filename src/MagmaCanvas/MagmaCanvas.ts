/**
 * MagmaCanvas.ts
 * Andrew Ribeiro 
 * June 2019
 */
import { Polygon,Diagram } from './Primitives/Shapes';
import { Drawable,Point,CanvasObject } from './Global';

export class MagmaCanvas{
    objects:Drawable[];
    ctx:CanvasRenderingContext2D;
    canvas:HTMLCanvasElement;
    cursorImage:Diagram;
    renderQueue:number[];
    /**
     * A managed canvas. 
     * @param containerID The ID of the HTML container the canvas is appended to. 
     * @param width Width of canvas.
     * @param height Height of canvas.
     * @param history Flag enabling canvas history. 
     */
    constructor(containerID:string,width:number,height:number,history:boolean = false,cursor:boolean = true){
        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("width",String(window.devicePixelRatio*width));
        this.canvas.setAttribute("height",String(window.devicePixelRatio*height));
        this.canvas.style.width = width+"px";
        this.canvas.style.height = height+"px";
        this.canvas.setAttribute("id","canvas");
        document.getElementById(containerID).appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        this.objects = [];
        this.renderQueue = [];

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
        window.requestAnimationFrame(()=>this.render());
    }
    add(obj:Drawable|CanvasObject,event:string=null,eventListener:(e:MouseEvent,pos:Point)=>void=null):number{
        this.objects.push(obj);
        let objectID = this.objects.length-1;
        this.renderQueue.push(objectID);
        if(obj instanceof CanvasObject){
            obj.attach(this,()=>this.invokeRender(objectID));
        }
        if(eventListener != null){
            this.addEventListener(event,(e,pos)=>{
                // Only pass the event forward if the pos lies within the target 
                // of the event. 
                if("contains" in obj){
                    if(obj.contains(pos)){
                        eventListener(e,pos);
                    }
                }
            });
        }
        return objectID;
    }
    invokeRender(objectID:number){
        //this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.renderQueue.push(objectID);
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
        this.renderQueue.forEach((idx)=>this.objects[idx].draw(this.ctx));
        this.renderQueue = [];
        if(this.cursorImage != null){
            this.cursorImage.draw(this.ctx);
        }
        window.requestAnimationFrame(()=>this.render());
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