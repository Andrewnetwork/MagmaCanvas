import { Point,Line,Circle,Shapes,Polygon } from "./MagmaCanvas/Shapes";
import { ManagedCanvas }                    from "./MagmaCanvas/ManagedCanvas";
import { Animator }                         from "./MagmaCanvas/Animator";
import { Grid }                             from "./MagmaCanvas/Objects";

function start(){
    //animationExample(ex1);
    cutExample();
    //follow();
    //circleSim();
    //graph();
}
function graph(){
    const canvasDim  = 800;
    const mCanvas    = new ManagedCanvas("canvasContainer",canvasDim,canvasDim,true);
    const grid       = new Grid(canvasDim,canvasDim);
    grid.attach(mCanvas);   
    function ballDrop(startPos:Point){
        let circ = new Circle({x:startPos.x,y:startPos.y},10);
        mCanvas.add(circ);
        let a = 9.8;
        let t = 0;
        let iHandler = setInterval(()=>{
            if(circ.pos.y + 10 <= 800){
                circ.pos.y += (a*t**2)/2;
                t+=0.01;
            }else{
                circ.pos.y = 790;
                clearInterval(iHandler);
            }
          
        },0);
    }
    let ignoreCounter = 0;

    mCanvas.addEventListener("mousemove",(_,pos)=>{
        if(ignoreCounter == 0){
            ballDrop(pos);
        }else if(ignoreCounter >= 1){
            ignoreCounter = -1;
        }

        ignoreCounter+=1;
    });
 
}
function circleSim(){
    const canvasDim  = 800;
    const mCanvas    = new ManagedCanvas("canvasContainer",canvasDim,canvasDim,true);
    function ballDrop(startPos:Point){
        let circ = new Circle({x:startPos.x,y:startPos.y},10);
        mCanvas.add(circ);
        let a = 9.8;
        let t = 0;
        let iHandler = setInterval(()=>{
            if(circ.pos.y + 10 <= 800){
                circ.pos.y += (a*Math.sin(t**2))/2;
                t+=0.01;
            }else{
                circ.pos.y = 790;
                clearInterval(iHandler);
            }
          
        },0);
    }
    let ignoreCounter = 0;

    mCanvas.addEventListener("mousemove",(_,pos)=>{
        if(ignoreCounter == 0){
            ballDrop(pos);
        }else if(ignoreCounter >= 10){
            ignoreCounter = -1;
        }

        ignoreCounter+=1;
    });

  
}
function randomDraw(){
    const canvasDim  = 800
    const mCanvas    = new ManagedCanvas("canvasContainer",canvasDim,canvasDim,true,false);
    const maxPoints = 1000;
    const nPoly = 3;
    let polys:Polygon[] = [];
    let randFn = ()=> Math.random()*canvasDim;
    for(let i = 0; i < nPoly; i++){
        let nPoints = Math.floor(Math.random()*maxPoints)
        let points : Point[] = [];
        for(let j = 0; j < nPoints; j++){
            points.push({x:randFn(),y:randFn()});
        }
        let poly = new Polygon(points,`rgba(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.random()})`);
        polys.push(poly);
        mCanvas.add(poly);
    }
    let alt = true;
    setInterval(()=>{
        polys.forEach((poly)=>{
            poly.points.forEach((point)=>{
                if(alt){
                    point.x += Math.random();
                    point.y += Math.random();
                    alt = !alt;
                }else{
                    point.x -= Math.random();
                    point.y -= Math.random();
                    alt = !alt;
                }
               
            });
        });
        mCanvas.render();
    },0);
}

function follow(){
    const canvasDim  = 800
    const mCanvas    = new ManagedCanvas("canvasContainer",canvasDim,canvasDim,true);
    let rect = Shapes.makeRect(canvasDim/4,canvasDim/4,canvasDim/2,canvasDim/2); 
    let rectHandler = mCanvas.add(rect);
    mCanvas.addEventListener("mousemove",(_,pos)=>{
        let centerPoint = rect.center();
        rect.points.forEach((point)=>{
            point.x = point.x + pos.x - centerPoint.x;
            point.y = point.y + pos.y - centerPoint.y;
        });
        mCanvas.render();
    });
}
function weird(){
    const canvasDim  = 800
    const mCanvas    = new ManagedCanvas("canvasContainer",canvasDim,canvasDim,true);
    let polygonHandler : number = null; 
    mCanvas.addEventListener("mousemove",(_,pos)=>{
        if(polygonHandler!=null){
            mCanvas.remove(polygonHandler);
        }
        polygonHandler = mCanvas.add(new Polygon([{x:pos.x,y:pos.y},{x:pos.x+500,y:pos.y},{x:pos.y,y:pos.x+500}]));
    });
}
function cutExample(){
    let points : Point[]          = [];
    let lines  : Line[]           = [];
    let guideLineID : number      = null;
    let pointHandlers : number [] = [];
    const canvasDim               = 800
    const mCanvas                 = new ManagedCanvas("canvasContainer",canvasDim,canvasDim,true);
    let plane                     = Shapes.makeRect(canvasDim/4,canvasDim/4,canvasDim/2,canvasDim/2);
    let planeHandler              = mCanvas.add(plane);

    mCanvas.addEventListener("click",(_,pos)=>{
        pointHandlers.push(mCanvas.add(new Circle(pos,10)));
        points.push(pos);
        if(points.length == 2){
            let line = new Line(points[0],points[1]);
            mCanvas.add(line);
            lines.push(line);
            points = [];
            mCanvas.removeList(pointHandlers);
            mCanvas.remove(planeHandler);
            mCanvas.addList(plane.splitBy(line));
        }
    });
    mCanvas.addEventListener("mousemove",(_,pos)=>{
        if(points.length == 1){
            if(guideLineID != null){
                mCanvas.remove(guideLineID);
            }
            guideLineID = mCanvas.add(new Line(points[0],pos));
        }
    });
}
function animationExample(exFn:(a:number,b:Animator,c:ManagedCanvas)=>void){
    const canvasDim  = 800
    const mCanvas    = new ManagedCanvas("canvasContainer",canvasDim,canvasDim,true);
    let animator     = new Animator();

    exFn(canvasDim,animator,mCanvas);
}
function ex2(canvasDim:number,animator:Animator,mCanvas:ManagedCanvas){
    let plane        = Shapes.makeRect(canvasDim/4,canvasDim/4,canvasDim/2,canvasDim/2);
    let planeHandler = mCanvas.add(plane);
    
    animator.addFrame(()=>plane.center().x > 800,()=>mCanvas.move(planeHandler,{x:1,y:1}));
    animator.start();
}
function ex1(canvasDim:number,animator:Animator,mCanvas:ManagedCanvas){
    let plane        = Shapes.makeRect(canvasDim/4,canvasDim/4,canvasDim/2,canvasDim/2);
    let planeHandler = mCanvas.add(plane);

    animator.addFrame(()=>plane.center().x > 800,()=>mCanvas.move(planeHandler,{x:1,y:1}));
    animator.startLoop(2);
    animator.addFrame(()=>plane.center().y < 0,()=>mCanvas.move(planeHandler,{x:0,y:-1}));
    animator.addFrame(()=>plane.center().x < 0,()=>mCanvas.move(planeHandler,{x:-1,y:0}));
    animator.addFrame(()=>plane.center().y > 800,()=>mCanvas.move(planeHandler,{x:0,y:1}));
    animator.addFrame(()=>plane.center().x > 800,()=>mCanvas.move(planeHandler,{x:1,y:0}));
    animator.endLoop();
    animator.addFrame(()=>plane.center().x == 400,()=>mCanvas.move(planeHandler,{x:-1,y:-1.5}));
    animator.addFrame(()=>false,()=>mCanvas.move(planeHandler,{x:-1,y:-1.5}));
    animator.start();
}
window.addEventListener("DOMContentLoaded",start);