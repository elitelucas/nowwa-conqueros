import { fileTempPath, fileUpload, storageUrl } from "../../Core/CONFIG/CONFIG";

class FILE {


    public async init(): Promise<any> {

        return Promise.resolve();
    }

    public async upload(file: File): Promise<any> {

        return new Promise(async (resolve) => {
            let formData = new FormData();
            formData.append("files", file);
            let url: URL = new URL(`${window.location.origin}${fileUpload}`);
            let init: RequestInit = {
                method: "POST",
                body: formData
            };
            fetch(url, init)
                .then(res => res.json())
                .then((res: any) => {
                    resolve({
                        success: res.success,
                        error: res.error
                    });
                })
                .catch((error: any) => {
                    console.error(`error: ${error}`);
                });
        });
    }

    public async list(): Promise<any> {

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