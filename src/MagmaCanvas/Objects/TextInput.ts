import { Point, CanvasObject } from "../Global";
import { MagmaCanvas } from "../MagmaCanvas";

export class TextInput extends CanvasObject{
    active:boolean;
    width:number;
    height:number;
    counter:number;
    showCursor:boolean;
    value:string;

    constructor(active=false,center:Point={x:0,y:0}){
        super(center);
        this.active = active;
        this.width = 400;
        this.height = 60;
        this.counter = 0;
        this.showCursor = false;
        this.value = "";
    }
    contains(point:Point):boolean{
        return true
    }
    draw(ctx: CanvasRenderingContext2D){
        if(this.counter>=40 && this.active){
            this.counter = 0;
            this.showCursor = !this.showCursor;
        }
        ctx.beginPath();
        ctx.rect(this.center().x-this.width/2, this.center().y-this.height/2, this.width, this.height); 
        if(this.showCursor){
            ctx.fillStyle = "#f2f2f2";
        }else{
            ctx.fillStyle = "white";
        }
        ctx.fill(); 
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(167,167,167)"; 
        ctx.stroke();
        ctx.closePath();
        ctx.font = '40px Arial';
        ctx.fillStyle = '#000000';
        ctx.fillText(this.value, this.center().x-(this.value.length*18)/2, this.center().y+this.height/4);
        this.counter++;
    }
    attach(mCanvas:MagmaCanvas){
        mCanvas.addEventListener("click",(e:MouseEvent,pos:Point)=>{
            let xBounds = pos.x > this.center().x-this.width/2 && pos.x < this.center().x+this.width/2;
            let yBounds = pos.y > this.center().y-this.height/2 && pos.y < this.center().y+this.height/2;
            if(xBounds && yBounds){
                this.active = true;
            }else{
                this.active = false;
                this.showCursor = false;
                this.counter = 0;
            }
        }); 
        window.addEventListener("keydown",(ev: KeyboardEvent)=>{
            if(this.active){
                if(ev.key.match(/[0-9]|[a-z]|[A-Z]| |/g) != null && ev.key.length == 1){
                    this.value += ev.key;
                }else if(ev.keyCode == 8){
                    this.value = this.value.slice(0,-1);
                }
                console.log(ev.keyCode);
            }
        });
        let refs : number[] = [];
        return {refs};
    }
}