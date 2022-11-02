
import MATH from "../MATH";


class Mat4
{
    public x : number;
    public y : number;
    public z : number;
    public c : number;
    public data : any = {};

    constructor( x:number, y:number, z:number, c:number )
    {
        this.x = x;
        this.y = y;
        this.z = z;
        this.c = c;
    }

    public lerp( src:Mat4, dst:Mat4, time:number )
    {
        const m = this.data;
        const lm = src.data;
        const rm = dst.data;
        for (let i = 0; i < 16; i++) m[i] = MATH.lerp(lm[i], rm[i], time );
        return this;
    };
}

export default Mat4;