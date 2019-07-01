/**
 * Shapes.ts
 * Andrew Ribeiro 
 * June 2019
 */
export interface Point{
    x : number
    y : number
}
export enum Axis{ X,Y }
export abstract class Drawable{
    abstract draw(ctx:CanvasRenderingContext2D) : void
}
export class Shapes{
    static makeRect(x:number,y:number,w:number,h:number){
        return new Polygon([{x:x,y:y},{x:x+w,y:y},{x:x+w,y:y+h},{x:x,y:y+h}]);
    }
}
export class Diagram extends Drawable{
    img:HTMLImageElement;
    loc:Point;
    constructor(src:string,loc:Point){
        super();
        this.img = new Image();
        this.img.src = src;
        this.loc = loc; 
    }
    draw(ctx:CanvasRenderingContext2D){
        ctx.drawImage(this.img,this.loc.x,this.loc.y);
    }

}
export class Polygon extends Drawable{
    points : Point[];
    ctx: CanvasRenderingContext2D;
    fillColor:string;
    constructor(points:Point[],fillColor:string = "red"){
        super();
        this.points = points;
        this.fillColor = fillColor;
    }
    draw(ctx:CanvasRenderingContext2D){
        ctx.fillStyle = this.fillColor;
        ctx.beginPath();
        if(this.points[0] != null){
            ctx.moveTo(this.points[0].x, this.points[0].y);
            for(let i = 0; i < this.points.length-1; i++){
                if(this.points[i+1] != null){
                    ctx.lineTo(this.points[i+1].x, this.points[i+1].y);
                }
            }
            ctx.fill();
        }
    }
    splitBy(line:Line):Polygon[]{
        let a = this.points.map( (point) => ({x:point.x,y:line.findY(point.x)}) )
        let b = this.points.map( (point) => ({x:line.findX(point.y),y:point.y}) );
        let boundaryPoints : Point[] = [];
        a.concat(b).forEach( (point) => {
            if(this.has(point)){
                // Do not include duplicates. 
                if(!includes(boundaryPoints,point)){
                    boundaryPoints.push(point);
                }
            }
        });
        // Create polygons created by boundary points.
        // let left   = this.pointsWith(Axis.X,200);
        // let right  = this.pointsWith(Axis.X,600);
        // let top    = this.pointsWith(Axis.Y,200);
        // let bottom = this.pointsWith(Axis.Y,600);
        let containedPoints : Point[] = [];
        this.points.forEach((point)=>{
            let cond1 = boundaryPoints[0].x >= point.x || boundaryPoints[0].y >= point.y;
            let cond2 = boundaryPoints[1].x >= point.x || boundaryPoints[1].y >= point.y;
            if(cond1 || cond2){
                containedPoints.push(point);
            }
        });
        let as = [...boundaryPoints,...containedPoints.reverse()];
        console.log(as);
        return [new Polygon(as)];
    }
    /**
     * Checks if a set of points is a valid polygon. A valid 
     * polygon is one that has a list of points ordered so that
     * when it is rendered, lines do not cross. 
     * @param points A list of points defining a polygon. 
     */
    static validPolygon(points:Point[]){

    }
    pointsWith(axis:Axis,val:number){
        let ls : Point[] = []
        this.points.forEach((point)=>{
            if(val == (axis == Axis.X ? point.x : point.y)){
                ls.push(point);
            }
        });
        // Sort by secondary axis. 
        ls.sort((a:Point,b:Point)=>{
            if(axis == Axis.X){
                return b.y-a.y ;
            }else{
                return b.x - a.x;
            }
        });
        return ls;
    }
    /**
     * Check if a given line intersects this polygon. 
     * @param line Line we are checking for intersection. 
     */
    lineIntersects(line:Line):Boolean{
        return true;
    }
    /**
     * 
     * @param point 
     */
    has(targ:Point):boolean{
        let xBounds = this.min(Axis.X) <= targ.x && targ.x <= this.max(Axis.X);
        let yBounds = this.min(Axis.Y) <= targ.y && targ.y <= this.max(Axis.Y);
        return xBounds && yBounds;
    }
    /**
     * Applies a binary boolean function over all points.
     * @param axis 
     * @param fun 
     */
    pointFunc(startVal:number,axis:Axis,fun:(a:number,b:number)=>boolean):number{
        let val = startVal;
        this.points.map((point)=>{
            let curVal = axis == Axis.X ? point.x : point.y;
            if(fun(val,curVal)){
                val = curVal; 
            }
        });
        return val;
    }
    max(axis:Axis):number{
        return this.pointFunc(0,axis,(a,b)=>a<b);
    }
    min(axis:Axis):number{
        return this.pointFunc(Infinity,axis,(a,b)=>b<=a);
    }
    center():Point{
        let ySum = 0;
        let xSum = 0;
        let n = this.points.length;
        this.points.map((point)=>{
            xSum += point.x;
            ySum += point.y;
        });
        return {x:xSum/n,y:ySum/n};
    }
}
export class Circle extends Drawable{
    fillColor:string;
    pos:Point;
    radius:number;
    constructor(pos:Point,radius:number,fillColor:string = "blue"){
        super();
        this.fillColor = fillColor;
        this.pos = pos;
        this.radius = radius;
    }
    draw(ctx:CanvasRenderingContext2D){
        ctx.fillStyle = this.fillColor;
        ctx.beginPath();
        ctx.arc(this.pos.x,this.pos.y,this.radius,0,Math.PI * 2, true);
        ctx.fill();
    }
}
export class Line extends Drawable{
    ctx: CanvasRenderingContext2D;
    start: Point;
    end: Point;
    extend:Boolean;
    lineWidth:number;

    constructor(start:Point,end:Point,lineWidth:number=1,extend:Boolean=false){
        super();
        this.start     = start;
        this.end       = end; 
        this.extend    = extend;
        this.lineWidth = lineWidth;
    }
    draw(ctx:CanvasRenderingContext2D){
        ctx.lineWidth = this.lineWidth;
        if(this.extend){
            ctx.beginPath();
            ctx.moveTo(this.findX(0),0);
            ctx.lineTo(this.findX(1000),1000);
            ctx.stroke();
        }else{
            ctx.beginPath();
            ctx.moveTo(this.start.x,this.start.y);
            ctx.lineTo(this.end.x,this.end.y);
            ctx.stroke();
        }
    }
    slope(){
        return (this.end.y-this.start.y)/(this.end.x-this.start.x);
    }
    findX(yVal:number){
        return (yVal - this.start.y + this.slope()*this.start.x)/this.slope();
    }
    findY(xVal:number){
        return this.slope()*(xVal - this.start.x) + this.start.y
    }
}
export function includes(points:Point[],target:Point){
    for(let i = 0; i < points.length; i++){
        if(points[i].x == target.x && points[i].y == target.y){
            return true;
        }
    }
    return false;
}