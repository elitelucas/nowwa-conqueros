import fs from 'fs';

export type Replace = {
    Pattern :string | RegExp;
    Value   :string; 
};

export async function stringReplace (inputFilepath:string, outputFilepath:string, replaces?: Replace[]) {
    return (new Promise<string>((resolve,reject) => {
        fs.readFile(inputFilepath, 'utf8', (err,data) => {
            if (err) {
                console.log(`[stringReplace] read [${inputFilepath}]: fail`);
                console.log(err);
                reject();
            } else {
                console.log(`[stringReplace] read [${inputFilepath}]: success`);
                resolve(data);
            }
        });
    }))
    .then((data:string) => {
        if (replaces != null) {
            for (let i:number = 0; i < replaces.length; i++) {
                let replace = replaces[i];
                var matches = data.match(replace.Pattern);
                console.log(`[stringReplace] before: ${matches != null ? matches[0] : ''}`);
                console.log(`[stringReplace] after: ${matches != null ? replace.Value : ''}`);
                if (matches) {
                    data = data.replace(replace.Pattern, replace.Value);
                }
            }
        }
        return Promise.resolve(data);
    })
    .then((data:string) => {
        return new Promise<void>((resolve,reject) => {
            fs.writeFile(outputFilepath, data, 'utf8', (err) => {
                if (err) {
                    console.log(`[stringReplace] write [${outputFilepath}]: fail`);
                    console.log(err);
                    reject();
                } else {
                    console.log(`[stringReplace] write [${outputFilepath}]: success`);
                    resolve();
                }
            });
        });
    });
}

export function removeNullAndFalse(obj:any) {
    removeNull(obj);
    removeFalse(obj);
}

export function removeFalse(obj:any) {
    for( let prop in obj){
        if( obj[prop] === false )
            delete(obj[prop]);

        // recursive
        if( typeof obj[prop] === "object" ) {
            removeFalse(obj[prop]);
        }
    }
}

export function removeNull(obj:any) {
    for( let prop in obj){
        if( obj[prop] === null )
            delete(obj[prop]);

        // non recursive, it breaks the game
    }
}