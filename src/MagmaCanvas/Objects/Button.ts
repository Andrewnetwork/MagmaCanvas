import { CanvasObject,Point } from "../Global";
import { MagmaCanvas } from "../MagmaCanvas";

export class Button extends CanvasObject{
    _onClick:Function;
    label:string;
    width:number;
    height:number;

    constructor(label:string,_onClick:Function,center:Point={x:0,y:0}){
        super(center);
        this._onClick = _onClick;
        this.label = label;
        this.height = 60;
        this.width = this.label.length * 30;
    }
    draw(ctx:CanvasRenderingContext2D){
        var grd = ctx.createLinearGradient(this.center().x-this.width/2,this.center().y-this.height/2,this.center().x-this.width/2,this.center().y+this.height/2);
        grd.addColorStop(0,"rgb(246,246,246)");
        grd.addColorStop(1,"rgb(222,222,222)");
        ctx.beginPath();
        ctx.rect(this.center().x-this.width/2, this.center().y-this.height/2, this.width, this.height); 
        ctx.fillStyle = grd;
        ctx.fill(); 
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(167,167,167)"; 
        ctx.stroke();
        ctx.closePath();
        ctx.font = '40px Arial';
        ctx.fillStyle = '#000000';
        ctx.fillText(this.label, this.center().x-(this.label.length*18)/2, this.center().y+this.height/4);
    }
    contains(point:Point):boolean{
        return true
    }
    attach(mCanvas:MagmaCanvas){
        mCanvas.addEventListener("click",(e:MouseEvent,pos:Point)=>{
            let xBounds = pos.x > this.center().x-this.width/2 && pos.x < this.center().x+this.width/2;
            let yBounds = pos.y > this.center().y-this.height/2 && pos.y < this.center().y+this.height/2;
            if(xBounds && yBounds){
                this._onClick();
            }
        }); 
        let refs : number[] = [];
        return {refs};
    }
}