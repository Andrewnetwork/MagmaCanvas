import {Shapes} from "../src/MagmaCanvas/Shapes";

test("Make rectangle.",()=>{
    expect(Shapes.makeRect(0,0,10,10).points).toStrictEqual([
        { x: 0, y: 0 },{ x: 10, y: 0 },{ x: 10, y: 10 },{ x: 0, y: 10 }]);
});