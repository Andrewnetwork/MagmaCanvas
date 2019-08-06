/**
 * Polygon.ts
 * Andrew Ribeiro 
 * July 2019
 */
import { Point,CanvasObject,Axis, PointFn } from "../Global";
import { Line } from "./Line";
import { List } from "../Helpers";

export class Polygon extends CanvasObject{
    points : Point[];
    ctx: CanvasRenderingContext2D;
    color:string;
    fill:boolean;

    constructor(points:Point[],fill:boolean = true,color:string = "red"){
        super(polygon_center(points));
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
            if(line.contains(point)){
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
    contains(point: Point): boolean {
        throw new Error("Method not implemented.");
    }
}
function polygon_center(points:Point[]):Point{
    if(points!=null){
        let ySum = 0;
        let xSum = 0;
        let n = points.length;
        points.map((point)=>{
            xSum += point.x;
            ySum += point.y;
        });
        return {x:xSum/n,y:ySum/n};
    }else{
        return {x:0,y:0};
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