import { fileGet, fileTempPath, storageUrl } from "../../Core/CONFIG/CONFIG";
import CONQUER from "../CONQUER";
import COREFILE from '../../Core/CMS/FILE';

class File 
{
    private conquer: CONQUER;
    public constructor(instance:CONQUER) {
        this.conquer = instance;
    }

    public async set( params:COREFILE.GetParams ): Promise<any> 
    {
        return this.conquer.do( "FILE.set", params );
    }

    public async get( params:COREFILE.Ownership ) : Promise<any> 
    {
        return this.conquer.do( "FILE.get", params );
    }

    public download( url:string ): void 
    { 
        var dlink       = document.createElement('a');
        dlink.href      = `${window.location.origin}${fileGet}/${url}`;
        dlink.target    = '_blank';
        dlink.onclick   = function (e) {};
        dlink.click();
    }

}

export default File;