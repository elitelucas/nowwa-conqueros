import CONQUER from "../Frontend/CONQUER";

class PAGES
{
    public fuckthis : string = "PAGES";
    public conquer  : CONQUER;

    constructor()
    {
        console.log("NEW PAGES CREATED");
    }

    public initalize( conquer:CONQUER )
    {
        this.conquer = conquer;
        console.log("PAGES INITIALIZED");
    }
}

export const _global = ( window /* browser */ || global /* node */) as any
 
let Pages : PAGES = new PAGES();
_global.Pages   = Pages; 

export default Pages;
 