import { fileGet, fileTempPath, storageUrl } from "../../Core/CONFIG/CONFIG";
import CONQUER from "../CONQUER";
import COREFILE from '../../Core/CMS/FILE';

class FILE {


    public async init(): Promise<any> {

        return Promise.resolve();
    }

    public async set(params: COREFILE.GetParams): Promise<any> 
    {
        return CONQUER.do("FILE.set", params);

        // return new Promise(async (resolve) => {
        //     let formData = new FormData();
        //     formData.append("files", file);
        //     let url: URL = new URL(`${window.location.origin}${fileUpload}`);
        //     let init: RequestInit = {
        //         method: "POST",
        //         body: formData
        //     };
        //     fetch(url, init)
        //         .then(res => res.json())
        //         .then((res: any) => {
        //             resolve({
        //                 success: res.success,
        //                 error: res.error
        //             });
        //         })
        //         .catch((error: any) => {
        //             console.error(`error: ${error}`);
        //         });
        // });
    }

    public async get(params:COREFILE.Ownership): Promise<any> {
        return CONQUER.do("FILE.get", params);
    }

    public download(url: string): void { 
        var dlink = document.createElement('a');
        dlink.href = `${window.location.origin}${fileGet}/${url}`;
        dlink.target = '_blank';
        dlink.onclick = function (e) {

        };
        dlink.click();
    }

}

export default FILE;