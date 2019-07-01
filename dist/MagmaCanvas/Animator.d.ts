interface AnimationFrame {
    transCondition: Function;
    action: Function;
}
export declare class Animator {
    frames: AnimationFrame[];
    intervalHandler: number;
    nRepeat: number;
    loopFrames: AnimationFrame[];
    isLooping: boolean;
    constructor();
    addFrame(transCondition: Function, action: Function): void;
    start(msTick?: number): void;
    stop(): void;
    startLoop(nRepeat: number): void;
    endLoop(): void;
}
export {};
