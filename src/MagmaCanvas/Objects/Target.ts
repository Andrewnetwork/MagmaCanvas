import { CanvasObject, Point, BoundingBox, PointFn } from "../Global";
import { Circle } from "../Primitives";


export class Target extends CanvasObject{
    targetRings:Circle[];
    radius:number;
    objs:CanvasObject[];

    constructor(center:Point|PointFn={x:0,y:0},boundingBox:BoundingBox=null,nRings:number=10,ringSize:number=10){
        super(center,boundingBox);
        this.objs = [];
        this.targetRings = [];
        for(let i = nRings; i >= 1; i--){
            this.targetRings.push(new Circle(center,i*ringSize,true,`rgb(${i*5},${i*10},${i*30})`));
        }
        this.radius = nRings*ringSize;
        //boundingBox = new BoundingBox({x:this._centerPoint.x-,y:})
    }
    get area(){
        return this.targetRings[0].area;
    }
    contains(point:Point): boolean {
        return this.targetRings[0].contains(point);
    }
    score(point:Point):number{
        // i=0 is the largest ring.
        for(let i = this.targetRings.length-1; i >= 0; i--){
            if(this.targetRings[i].contains(point)){
                return (i+1)/this.targetRings.length;
            }
        }
        return 0;
    }    
    draw(ctx: CanvasRenderingContext2D){
        this.targetRings.forEach((ring)=>ring.draw(ctx));
        this.objs.forEach((obj)=>obj.draw(ctx));
    }
    center(center?: Point | PointFn, callFunction?: boolean):Point{
        let centerPoint = super.center(center,callFunction);
        if(center != null && this.targetRings != null){
            // We must update all rings.
            this.targetRings.forEach((ring)=>ring.center(centerPoint));
        }
        return centerPoint;
    }
    add(obj:CanvasObject){
        let x = obj.center().x - this.center().x;
        let y = obj.center().y - this.center().y;
        let psn = () => {return {x:this.center().x+x,y:this.center().y+y}};
        obj.center(psn,false);
        this.objs.push(obj);
    }
}