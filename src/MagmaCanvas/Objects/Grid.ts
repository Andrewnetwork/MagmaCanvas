import { Shapes,Line,Polygon } from "../Primitives/Shapes";
import { Drawable } from "../Global";
import { MagmaCanvas } from "../MagmaCanvas";

export class Grid extends Drawable{
    private _gridSpaceIndex:number;
    private _gridSpace:number;
    width:number;
    height:number;
    mCanvas:MagmaCanvas;
    shapeHandlers:number[];
    gridSpaces:number[];
    graphObjects:Drawable[];
    graphCanvas:HTMLCanvasElement;
    graphFns:Function[];

    constructor(width:number,height:number){
        super();
        this.width = width;
        this.height = height;
        this._gridSpaceIndex = 6;
        this.gridSpaces = divisors(this.width).slice(4, -4);
        this._gridSpace = this.gridSpaces[this._gridSpaceIndex];
        this.graphObjects = [];
        this.graphFns = [];
    }
    set gridSpace(newVal:number){
        if(newVal != this._gridSpace){
            this._gridSpace = newVal;
            this.make();
        }
    }
    get gridSpace(){
        return this._gridSpace;
    }
    draw(ctx:CanvasRenderingContext2D){
        this.graphObjects.forEach((obj:Drawable)=>{
            obj.draw(ctx);
        });
        ctx.drawImage(this.graphCanvas, 0, 0);
    }
    attach(mCanvas:MagmaCanvas){
        this.mCanvas = mCanvas;
        this.mCanvas.canvas.addEventListener("wheel",(ev)=>{
            if(ev.deltaY > 0){
                if(this.gridSpace != this.gridSpaces[this.gridSpaces.length-1]){
                    this._gridSpaceIndex += 1;            
                    this.gridSpace = this.gridSpaces[this._gridSpaceIndex];
                }
            }else{
                if(this.gridSpace != this.gridSpaces[0]){
                    this._gridSpaceIndex -= 1;  
                    this.gridSpace = this.gridSpaces[this._gridSpaceIndex];
                }
            }
            this.drawGraphs();
        }); 
        this.make();
        this.mCanvas.add(this);
    }
    make(){
        let container : Drawable[] = [];
        
        let a = Shapes.makeRect(400,0,400,400);
        a.color = "#E1D2DF";
        container.push(a);
        let b = Shapes.makeRect(0,0,400,400);
        b.color = "#F7E7EA";
        container.push(b);
        let c = Shapes.makeRect(0,400,400,400);
        c.color = "#E8F2E2";
        container.push(c);
        let d = Shapes.makeRect(400,400,400,400);
        d.color = "#F7FBEA";
        container.push(d);
    
        for(let i = this._gridSpace; i < this.width; i+=this._gridSpace){
            container.push(new Line({x:i,y:0},{x:i,y:this.height}));
        }
        for(let i = this._gridSpace; i < this.height; i+=this._gridSpace){
            container.push(new Line({x:0,y:i},{x:this.width,y:i}));
        }
        container.push(new Line({x:400,y:0},{x:400,y:800},3));
        container.push(new Line({x:0,y:400},{x:800,y:400},3));

        this.graphObjects = container;
    }
    graph(fn:Function){
        this.graphFns.push(fn);
        this.drawGraphs();
    }
    drawGraphs(){
        this.graphCanvas = document.createElement('canvas');
        this.graphCanvas.width = this.mCanvas.canvas.width;
        this.graphCanvas.height = this.mCanvas.canvas.height;
        this.graphFns.forEach((fn:Function)=>{
            let dx = this.mCanvas.canvas.width/2;
            let dy = this.mCanvas.canvas.height/2;
            let xInc = 0.01;
            let nSamples = 100;
            let points = [];
            for(var x = -nSamples; x <= nSamples; x+=xInc){
                points.push({x:x*this._gridSpace+dx,y:(-1*fn(x))*this._gridSpace+dy});
            }
            let poly = new Polygon(points,false,"blue");
            poly.draw(this.graphCanvas.getContext("2d"));
        });
    }
}
function divisors(n:number):number[]{
    let div : number[] = [];
    for(let i = 1; i <= n/2;i++){
        if(n%i == 0 && (n/i)%2 == 0){
            div.push(i);
        }
    }
    return div;
}