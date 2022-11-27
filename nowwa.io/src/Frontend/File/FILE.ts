import { fileTempPath, fileUpload, storageUrl } from "../../Core/CONFIG/CONFIG";
import CONQUER from "../CONQUER";
import COREFILE from '../../Core/CMS/FILE';

class FILE {


    public async init(): Promise<any> {

        return Promise.resolve();
    }

    public async upload(params: COREFILE.UploadParams): Promise<any> {

        // TODO : include conquer user id
        return CONQUER.do("FILE.upload", params);

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

    public async list(params:COREFILE.Ownership): Promise<any> {

        // TODO : include conquer user id
        // console.log('list started...');
        return CONQUER.do("FILE.list", params);
        // return new Promise(async (resolve) => {
        //     CONQUER.do("FILE.list").then((outs)=>{
        //         console.log(`outs`, outs);
        //         resolve({
        //             success: true,
        //             files: []
        //         });
        //     });
        // });

        return new Promise(async (resolve) => {
            fetch(`${window.location.origin}${storageUrl}${fileTempPath}`)
                .then(res => res.json())
                .then((res: any) => {
                    resolve({
                        success: res.success,
                        files: res.files
                    });
                })
                .catch((error: any) => {
                    console.error(`error: ${error}`);
                });
        });
    }

    public download(filename: string): void {
        var dlink = document.createElement('a');
        dlink.href = `${window.location.origin}${fileTempPath}/${filename}`;
        dlink.target = '_blank';
        dlink.onclick = function (e) {

        };
        dlink.click();
    }

}

export default FILE;