import { Shapes,Line,Polygon, Circle } from "../Primitives";
import { MagmaCanvas } from "../MagmaCanvas";
import { CanvasObject, CanvasReference,Point } from "../Global";

export class Grid extends CanvasObject{
    private _gridSpaceIndex:number;
    private _gridSpace:number;
    width:number;
    height:number;
    mCanvas:MagmaCanvas;
    shapeHandlers:number[];
    gridSpaces:number[];
    graphObjects:CanvasObject[];
    graphCanvas:HTMLCanvasElement;
    graphFns:Function[];
    plottedPoints:Point[];

    constructor(width:number,height:number){
        super();
        this.width = width;
        this.height = height;
        this._gridSpaceIndex = 6;
        this.gridSpaces = divisors(this.width).slice(4, -4);
        this._gridSpace = this.gridSpaces[this._gridSpaceIndex];
        this.graphObjects = [];
        this.graphFns = [];
        this.plottedPoints = [];
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
        this.graphObjects.forEach((obj:CanvasObject)=>obj.draw(ctx));
        this.plottedPoints.forEach((point:Point)=>(new Circle(this.translatePoint(point),this._gridSpace/4,true,"black")).draw(ctx));

        if(this.graphCanvas!=null){
            ctx.drawImage(this.graphCanvas, 0, 0);
        }
    }
    zoomIn(){
        let result = false;
        if(this.gridSpace != this.gridSpaces[this.gridSpaces.length-1]){
            this._gridSpaceIndex += 1;            
            this.gridSpace = this.gridSpaces[this._gridSpaceIndex];
            result = true;
        }
        this.drawGraphs();
        return result;
    }
    zoomOut(){
        let result = false;
        if(this.gridSpace != this.gridSpaces[0]){
            this._gridSpaceIndex -= 1;  
            this.gridSpace = this.gridSpaces[this._gridSpaceIndex];
            result = true;
        }
        this.drawGraphs();
        return result;
    }
    attach(mCanvas:MagmaCanvas,invokeRender:Function):CanvasReference{
        this.mCanvas = mCanvas;
        this.mCanvas.canvas.addEventListener("wheel",(ev:WheelEvent)=>{
            if(ev.deltaY > 0){
                this.zoomIn();
            }else{
                this.zoomOut();
            }
        }); 
        this.make();
        return null;
    }
    make(){
        let container : CanvasObject[] = [];
        // Quadrant Squares
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
        // Grid lines.
        for(let i = this._gridSpace; i < this.width; i+=this._gridSpace){
            container.push(new Line({x:i,y:0},{x:i,y:this.height},1,true,`rgba(0,0,0,${(this._gridSpaceIndex+1)/this.gridSpaces.length})`));
        }
        for(let i = this._gridSpace; i < this.height; i+=this._gridSpace){
            container.push(new Line({x:0,y:i},{x:this.width,y:i},1,true,`rgba(0,0,0,${(this._gridSpaceIndex+1)/this.gridSpaces.length})`));
        }
        // Axes.
        container.push(new Line({x:400,y:0},{x:400,y:800},3));
        container.push(new Line({x:0,y:400},{x:800,y:400},3));

        this.graphObjects = container;
    }
    graph(fn:Function){
        this.graphFns.push(fn);
        this.drawGraphs();
    }
    plot(point:Point){
        this.plottedPoints.push(point);
    }
    plot_points(points:Point[]){
        points.forEach((point:Point)=>this.plot(point));
    }
    clearGraphs(){
        this.graphFns = [];
        this.drawGraphs();
    }
    /**
     * Translates a point in the coordinate space of the grid to the coordinate space of the 
     * HTML5 canvas.  
     * @param point 
     */
    translatePoint(point:Point){
        let dx = this.mCanvas.canvas.width/2;
        let dy = this.mCanvas.canvas.height/2;
        return {x:point.x*this._gridSpace+dx,y:-point.y*this._gridSpace + dy};
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
    contains(point:Point): boolean {
        throw new Error("Method not implemented.");
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