/**
 * MagmaCanvas.ts
 * Andrew Ribeiro 
 * June 2019
 */
import { Polygon,Diagram } from './Primitives';
import { Point,CanvasObject } from './Global';

export class MagmaCanvas{
    objects:CanvasObject[];
    ctx:CanvasRenderingContext2D;
    layers:HTMLCanvasElement[];
    layersObjects:CanvasObject[][];
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
    constructor(containerID:string,width:number,height:number,history:boolean=false,cursor:boolean=true){
        this.canvas = createCanvas(containerID,width,height);
        this.layers = [createCanvas(containerID,width,height)];
        this.layersObjects = [new Array<CanvasObject>()];

        this.canvas.style.boxShadow = "10px 10px 5px grey";
        this.canvas.style.cursor = "none";
        document.getElementById(containerID).appendChild(this.canvas);
        document.getElementById(containerID).appendChild(this.layers[0]);
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
    
    add(obj:CanvasObject,layer:number=null):number{
        if(layer == null){
            this.objects.push(obj);
            let objectID = this.objects.length-1;
            this.renderQueue.push(objectID);
            if(obj instanceof CanvasObject){
                obj.attach(this,()=>this.invokeRender(objectID));
            }
            return objectID;
        }else{
            this.layersObjects[layer].push(obj);
            let objectID = this.layersObjects[layer].length-1;
            obj.draw(this.layers[0].getContext("2d"));
            return objectID;
        }
    }
    invokeRender(objectID:number){
        //let boundingBox = this.objects[objectID].boundingBox;
        //this.ctx.clearRect(boundingBox.upperLeft.x,boundingBox.upperLeft.y,boundingBox.width,boundingBox.height);
        // this.objects.forEach((obj,i)=>{
        //     if(obj.boundingBox.overlaps(boundingBox) && i != objectID){
        //         this.renderQueue.push(i);
        //     }
        // });
        // this.renderQueue.push(objectID);
    }
    addList(objs:CanvasObject[]):number[]{
        let ids : number[] = []
        objs.forEach((obj)=>{
            ids.push(this.add(obj));
        });
        return ids;
    }
    paintList(objs:CanvasObject[]){
        objs.forEach((obj)=>{
            obj.draw(this.ctx);
        });
    }
    paint(obj:CanvasObject){
        obj.draw(this.ctx);
    }
    render(){
        this.ctx.clearRect(0,0,this.canvas.width*2,this.canvas.height*2);
        // this.renderQueue.forEach((idx)=>this.objects[idx].draw(this.ctx));
        // this.renderQueue = [];
        this.objects.forEach((obj)=>{
            obj.draw(this.ctx);
        });
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
            (<Polygon>this.objects[objHandler]).points.forEach((point:Point)=>{
                point.x += deltas.x;
                point.y += deltas.y;
            });
        }
    }
    get(objectHandler:number){
        return this.objects[objectHandler];
    }
    addEventListener(event:string,listener:(e:MouseEvent,pos:Point)=>void,objID:number=null){
        this.canvas.addEventListener(event,(e:MouseEvent)=>{    
            let pos = getMousePos(this.canvas, e);
            if(objID != null){
                if(this.objects[objID].contains(pos)){
                    listener(e,pos);
                }
            }else{
                listener(e,pos);
            }
        });
    }
}
let zIndexCounter = 10;
function createCanvas(containerID:string,width:number,height:number){
    let canvas = document.createElement("canvas");
    canvas.setAttribute("width",String(window.devicePixelRatio*width));
    canvas.setAttribute("height",String(window.devicePixelRatio*height));
    canvas.style.width = width+"px";
    canvas.style.height = height+"px";
    canvas.style.position = "absolute";
    canvas.style.border = "solid black";
    canvas.style.zIndex = zIndexCounter.toString();
    canvas.style.left = ((window.innerWidth-width)/2)+"px";
    zIndexCounter--;
    return canvas;
}
function getMousePos(canvas:HTMLCanvasElement, evt:MouseEvent):Point{
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}