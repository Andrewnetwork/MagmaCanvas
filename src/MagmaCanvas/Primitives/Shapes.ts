/**
 * Shapes.ts
 * Andrew Ribeiro 
 * June 2019
 */
import {List} from "../Helpers";
import {Drawable,Point,CanvasObject,Axis, PointFn} from "../Global";
import { MagmaCanvas } from "../MagmaCanvas";

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
export class Rectangle extends Drawable{
    upperLeft:Point;
    width:number;
    height:number;
    constructor(upperLeft:Point,width:number,height:number){
        super();
        this.upperLeft = upperLeft;
        this.width = width;
        this.height = height;
    }
    draw(ctx: CanvasRenderingContext2D){
        throw new Error("Method not implemented.");
    }
}
export class Polygon extends Drawable{
    points : Point[];
    ctx: CanvasRenderingContext2D;
    color:string;
    fill:boolean;

    constructor(points:Point[],fill:boolean = true,color:string = "red"){
        super();
        this.points = points;
        this.color = color;
        this.fill = fill;
    }
    draw(ctx:CanvasRenderingContext2D){
        ctx.beginPath();
        if(this.points[0] != null){
            ctx.moveTo(this.points[0].x, this.points[0].y);
            for(let i = 0; i < this.points.length-1; i++){
                if(this.points[i+1] != null){
                    ctx.lineTo(this.points[i+1].x, this.points[i+1].y);
                }
            }
            if(this.fill){
                ctx.fillStyle = this.color;
                ctx.fill();
            }else{
                ctx.strokeStyle = this.color;
                ctx.stroke();
            }
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
        // Find all points above and below the cut line.
        let cutLine = new Line(boundaryPoints[0],boundaryPoints[1]); 
        let abovePoints:Point[] = [];
        let belowPoints:Point[] = [];
        this.points.forEach((point)=>{
            if(point.y > cutLine.findY(point.x)){
                abovePoints.push(point);
            }else{
                belowPoints.push(point);
            }
        });
        let topOut = euclideanWalk([...boundaryPoints,...abovePoints]); 
        let bottomOut = euclideanWalk([...boundaryPoints,...belowPoints]);
        return [new Polygon(topOut),new Polygon(bottomOut)];
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
    reflectOver(line:Line){
        let [a,b] = this.splitBy(line);
        a.color = "blue";
        a.points = a.points.map((point)=>{
            if(line.isOn(point)){
                return point;
            }else{
                if(Math.abs(line.slope()) < 1){
                    let lineY = line.findY(point.x);
                    let newY = 0;
                    if(lineY > point.y){
                        newY = point.y + (lineY-point.y)*2;
                    }
                    else{
                        newY = point.y - (point.y-lineY)*2;
                    }
                    return {x:line.orthLine(point).findX(newY),y:newY};
                }else{
                    let lineX = line.findX(point.y);
                    let newX = 0;
                    if(lineX > point.x){
                        newX = point.x + (lineX-point.x)*2;
                    }
                    else{
                        newX = point.x - (point.x-lineX)*2;
                    }
                    return {x:newX,y:line.orthLine(point).findY(newX)};
                }
            }
        });
        return [a,b];
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

export class Circle extends CanvasObject{
    color:string;
    radius:number;
    fill:boolean;

    constructor(center:Point|PointFn,radius:number,fill:boolean=true,color:string = "blue"){
        super(center);
        this.color  = color;
        this.radius = radius;
        this.fill   = fill;
        this.boundingBox = new Rectangle({x:this.center().x-radius,y:this.center().y-radius},radius*2,radius*2);
    }
    draw(ctx:CanvasRenderingContext2D){
        ctx.beginPath();
        
        ctx.arc(this.center().x,this.center().y,this.radius,0,Math.PI * 2, true);
        
        if(this.fill){
            ctx.fillStyle = this.color;
            ctx.fill();
        }else{
            ctx.strokeStyle = this.color;
            ctx.stroke();
        }
       
    }
    attach(mCanvas:MagmaCanvas,invokeRender:Function){
        let refs : number[] = [];
        this.invokeRender = invokeRender;
        return {refs};
    }
    contains(point:Point){
        let center : Point = <Point>this._center;
        if(this.center instanceof Function){
            center = this.center();
        }
        return  Math.sqrt((point.y - center.y)**2 + (point.x - center.x)**2) <= this.radius;
    }
}
export class Line extends Drawable{
    ctx: CanvasRenderingContext2D;
    start: Point;
    end: Point;
    extend:Boolean;
    lineWidth:number;
    strokeStyle:string;

    constructor(start:Point,end:Point,lineWidth:number=1,extend:Boolean=false,strokeStyle:string="black"){
        super();
        this.start     = start;
        this.end       = end; 
        this.extend    = extend;
        this.lineWidth = lineWidth;
        this.strokeStyle = strokeStyle;
    }
    draw(ctx:CanvasRenderingContext2D){
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.strokeStyle;
        if(this.extend){
            ctx.beginPath();
            let slope = this.slope();
            if(slope == 0){
                ctx.moveTo(0,this.start.y);
                ctx.lineTo(1000,this.end.y);
            }else if(slope == Infinity || slope == -Infinity){
                ctx.moveTo(this.start.x,0);
                ctx.lineTo(this.end.x,1000);
            }
            else{
                ctx.moveTo(this.findX(0),0);
                ctx.lineTo(this.findX(1000),1000);
            }
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
    /**
     * A line orthogonal to this line and through the given point. 
     * @param point Point the orthogonal line passes through. 
     */
    orthLine(point:Point,lineWidth:number=1,extend:boolean=false,strokeStyle:string="black"){
        let orthSlope = -1/this.slope();
        let newY = 0;
        let newX = 0;
        if(orthSlope == 0){
            newX = 0;
            newY = point.y;
        }else if(orthSlope == Infinity || orthSlope == -Infinity){
            newX = point.x;
            newY = 0;
        }
        else{
            newY = (-1/this.slope())*point.x + this.findY(0);
            newX = (newY - point.y + orthSlope*point.x)/orthSlope;
        }
        return new Line({x:newX,y:newY},point,lineWidth,extend,strokeStyle);
    }
    isOn(point:Point){
        return this.findY(point.x) == point.y;
    }
    pointOfIntersection(line:Line){
        let xIntersection = (line.findY(0) - this.findY(0))/(this.slope() - line.slope());
        let yIntersection = line.findY(xIntersection);
        return {x:xIntersection,y:yIntersection};
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
function euclideanDist(p1:Point,p2:Point){
    return Math.sqrt((p1.x-p2.x)**2+(p1.y-p2.y)**2);
}
/**
 * Given a set of points, walk from the first point to the nearest point
 * and so on. 
 * @param points 
 */
export function euclideanWalk(pts:Point[]){
    let points = new List<Point>(pts);
    let walk : Point[] = [points.i[0]];
    let currPoint = points.i[0];
    points.delete(0);
    while(currPoint != null){
        let minDist = Infinity;
        let minPointIdx : number = null;
        for(let i=0; i<points.length ;i++){
            let dist = euclideanDist(currPoint,points.i[i]);
            if(dist < minDist){
                minDist = dist;
                minPointIdx = i;
            }
        }
        if(minPointIdx != null){
            currPoint = points.i[minPointIdx];
            points.delete(minPointIdx);
            walk.push(currPoint);
        }else{
            currPoint = null;
        }
    }
    return walk;
}