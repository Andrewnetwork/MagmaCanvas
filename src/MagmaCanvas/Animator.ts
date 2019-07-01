/**
 * Animator.ts
 * Andrew Ribeiro 
 * July 2019
 */
import lo from "lodash";

interface AnimationFrame{
    transCondition:Function;
    action:Function;
}
export class Animator{
    frames : AnimationFrame[];
    intervalHandler:number;
    nRepeat:number;
    loopFrames:AnimationFrame[];
    isLooping:boolean;
    constructor(){
        this.frames = [];
        this.nRepeat = 0;
        this.loopFrames = [];
        this.isLooping = false;
    }
    /**
     * Add an animation frame. 
     * @param transCondition When true, the animator transitions to the next frame. 
     * @param action Action called until the transition condition is triggered. 
     */
    addFrame(transCondition:Function,action:Function){
        if(this.isLooping){
            this.loopFrames.push({transCondition:transCondition,action:action});
        }else{
            this.frames.push({transCondition:transCondition,action:action});
        }
        
    }
    start(msTick:number = 0){
        this.intervalHandler = window.setInterval(()=>{
            if(this.frames.length != 0){
                if(!this.frames[0].transCondition()){
                    this.frames[0].action();
                }else{
                    this.frames.shift()
                }
            }else{
                // We have exhausted all frames. Stop the animation loop. 
                clearInterval(this.intervalHandler);
            }
            
        },msTick);
    }
    stop(){
        clearInterval(this.intervalHandler);
    }
    startLoop(nRepeat:number){
        this.nRepeat = nRepeat;
        this.isLooping = true;
    }
    endLoop(){
        
        let rp = lo.reduce(lo.fill(Array<AnimationFrame>(this.nRepeat),this.loopFrames),
            (p:AnimationFrame[],c:AnimationFrame[])=>p.concat(c));
        this.frames = [...this.frames,...rp];
        this.isLooping = false;
        
    }
}