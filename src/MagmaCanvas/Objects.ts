import { Drawable,Shapes,Line } from "./Shapes";
import { ManagedCanvas } from "./ManagedCanvas";

export class Grid{
    private _gridSpaceIndex:number;
    private _gridSpace:number;
    width:number;
    height:number;
    mCanvas:ManagedCanvas;
    shapeHandlers:number[];
    gridSpaces:number[];

    constructor(width:number,height:number){
        this.width = width;
        this.height = height;
        this._gridSpaceIndex = 7;
        this.gridSpaces = divisors(this.width).slice(4, -4);
        this._gridSpace = this.gridSpaces[this._gridSpaceIndex];
    }
    set gridSpace(newVal:number){
        if(newVal != this._gridSpace){
            this._gridSpace = newVal;
            this.mCanvas.removeList(this.shapeHandlers);
            this.make();
        }
    }
    get gridSpace(){
        return this._gridSpace;
    }
    attach(mCanvas:ManagedCanvas){
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
        });
        this.make();
    }
    make(){
        let container : Drawable[] = [];
        
        let a = Shapes.makeRect(400,0,400,400);
        a.fillColor = "#E1D2DF";
        container.push(a);
        let b = Shapes.makeRect(0,0,400,400);
        b.fillColor = "#F7E7EA";
        container.push(b);
        let c = Shapes.makeRect(0,400,400,400);
        c.fillColor = "#E8F2E2";
        container.push(c);
        let d = Shapes.makeRect(400,400,400,400);
        d.fillColor = "#F7FBEA";
        container.push(d);
    
        for(let i = this._gridSpace; i < this.width; i+=this._gridSpace){
            container.push(new Line({x:i,y:0},{x:i,y:this.height}));
        }
        for(let i = this._gridSpace; i < this.height; i+=this._gridSpace){
            container.push(new Line({x:0,y:i},{x:this.width,y:i}));
        }
        container.push(new Line({x:400,y:0},{x:400,y:800},3));
        container.push(new Line({x:0,y:400},{x:800,y:400},3));

        this.shapeHandlers = this.mCanvas.addList(container);
    }
}
function divisors(n:number):number[]{
    let div : number[] = [];
    for(let i = 1; i <= n/2;i++){
        if(n%i == 0){
            div.push(i);
        }
    }
    return div;
}