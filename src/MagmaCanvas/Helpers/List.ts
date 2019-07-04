export class List<T>{
    arry:T[];
    constructor(arry:T[] = []){
        this.arry = arry;
    }
    push(elm:T){
        this.arry.push(elm);
    }
    delete(idx:number){
        this.arry = this.arry.slice(0,idx).concat(this.arry.slice(idx+1,this.arry.length));
    }
    get length(){
        return this.arry.length;
    }
    get i(){
        return this.arry;
    }
}