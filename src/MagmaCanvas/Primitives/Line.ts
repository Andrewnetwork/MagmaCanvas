/**
 * Line.ts
 * Andrew Ribeiro 
 * July 2019
 */
import { CanvasObject, Point } from "../Global";

export class Line extends CanvasObject{
    ctx: CanvasRenderingContext2D;
    start: Point;
    end: Point;
    extend:Boolean;
    lineWidth:number;
    strokeStyle:string;

    constructor(start:Point,end:Point,lineWidth:number=1,extend:Boolean=false,strokeStyle:string="black"){
        super({x:Math.abs(start.x-end.x),y:Math.abs(start.y-end.y)});
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
    contains(point: Point): boolean {
        let m = this.slope();
        let b = this.findY(0);
        return Math.abs(b+m*point.x - point.y)/Math.sqrt(1+m**2) <= this.lineWidth;
    }
    pointOfIntersection(line:Line){
        let xIntersection = (line.findY(0) - this.findY(0))/(this.slope() - line.slope());
        let yIntersection = line.findY(xIntersection);
        return {x:xIntersection,y:yIntersection};
    }
}