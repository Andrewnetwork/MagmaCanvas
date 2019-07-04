export declare class List<T> {
    arry: T[];
    constructor(arry?: T[]);
    push(elm: T): void;
    delete(idx: number): void;
    readonly length: number;
    readonly i: T[];
}
