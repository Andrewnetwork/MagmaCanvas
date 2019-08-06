/**
 * Shapes.ts
 * Andrew Ribeiro 
 * June 2019
 */
import { Polygon } from "./Polygon";

export class Shapes{
    static makeRect(x:number,y:number,w:number,h:number){
        return new Polygon([{x:x,y:y},{x:x+w,y:y},{x:x+w,y:y+h},{x:x,y:y+h}]);
    }
}