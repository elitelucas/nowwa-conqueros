//@ts-ignore
module Conquer {

    var version:string = '0.0.1';
    var host:string = 'localhost:9000';
    // var host:string = 'nowwa.io';
    var useSSL:boolean = false;
    // var useSSL:boolean = true;
    var protocol:string = useSSL ? 'https' : 'http';
    var url:string = `${protocol}://${host}/webhook/v${version}`;

    var Types:string[] = [
        'string',
        'number',
        'boolean',
        'object'
    ]

    type Method = "GET" | "POST";

    type Data = {
        schemaName? : string,
        schemaFields? : {
            remove? : string[],
            add?    : {[key:string]:string}
            values? : {[key:string]:any},
            types?  : {[key:string]:string},
            where?  : {[key:string]:
                string | 
                number | 
                boolean |
                {
                    $lt?    : number, // less than
                    $lte?   : number, // less than equal to
                    $gt?    : number, // greater than
                    $gte?   : number, // greater than equal to
                    $ne?    : number, // not equal to
                    $in?    : number[] | string[], // in an array of
                    $nin?   : number[] | string[], // not in an array of 
                    $regex? : string | RegExp, // match regex
                    $size?  : number, // is an array with size of   
                }
            },
            limit?  : number,
        }
    }

    function BasicCheck (data?:Data) {
        if (data == undefined) {
            throw new Error(`must have an object to be processed!`);
        }
        if (!data.schemaName) {
            throw new Error(`property 'schema' is needed!`);
        }
        if (!data.schemaFields) {
            throw new Error(`property 'fields' is needed!`);
        }
        return null;
    }

    export async function SchemaStructureSave (structure:Data):Promise<void> {
        try {
            BasicCheck(structure);
            
            // Check possible property 'schemaFields.add' & 'schemaFields.remove' 
            var fieldsToAdd = structure.schemaFields?.add;
            var fieldsToRemove = structure.schemaFields?.remove;
            if (!fieldsToAdd && !fieldsToRemove) {
                throw new Error(`property 'schemaFields.add' or 'schemaFields.remove' is needed!`);
            }

            // If 'schemaFields.add' is present
            if (fieldsToAdd) {

                // Check if fieldsToAdd has at least 1 property
                if (Object.keys(fieldsToAdd).length == 0) {
                    throw new Error(`property 'schemaFields.add' need at least 1 property!`);
                }
                
                // Iterate through 'schemaFields.add'
                var structureFieldNamesToAdd:string[] = Object.keys(structure.schemaFields?.add as {[key:string]:string});
                console.log(structure.schemaName);
                for (var i = 0; i < structureFieldNamesToAdd.length; i++) {
                    var fieldName:string = structureFieldNamesToAdd[i];
                    
                    // Check field type reference
                    var fieldType = structure.schemaFields?.add?.[`${fieldName}`];
                    if (typeof fieldType != 'string') {
                        throw new Error(`property 'schemaFields.add.${fieldName}' needs to be defined in string! (e.g 'number' or 'boolean' or 'string')`);
                    }
                    if (fieldType && !Types.includes(fieldType)) {
                        throw new Error(`property 'schemaFields.add.${fieldName}' has an unknown type: '${fieldType}'!`);
                    }
                }
            }

            // If 'schemaFields.remove' is present
            if (fieldsToRemove) {
                
                // Check if fieldsToRemove has at least 1 property
                if (fieldsToRemove.length == 0 || typeof fieldsToRemove != 'object') {
                    throw new Error(`property 'schemaFields.remove' need to be at least an array with 1 string element!`);
                }
                
                // Iterate through 'schemaFields.remove'
                if (fieldsToRemove) {
                    var structureFieldNamesToRemove = fieldsToRemove as any[];
                    for (var i:number = 0; i < structureFieldNamesToRemove.length; i++) {
                        
                        // Check field type reference
                        if (typeof structureFieldNamesToRemove[i] != 'string') {
                            throw new Error(`element no.[${i}] in 'schemaFields.remove' needs to be a string! (it was ${structureFieldNamesToRemove[i]})`);
                        }
                    }
                }
            }

            console.log(structure);

            // Send schema structure to server
            var response = await Call("POST", url + '/schema_structure_save', structure);
            if (response.success) {
                return Promise.resolve();
            }
            return Promise.reject(response.error);
        }
        catch (error:any) {
            return Promise.reject(error);
        }
    }

    export async function SchemaStructureLoad (schemaNames?:string[]):Promise<Data[]> {
        try {
            var response = await Call("POST", url + '/schema_structure_load', { schemaNames: schemaNames });
            if (response.success) {
                return Promise.resolve(response.value);
            }
            return Promise.reject(response.error);
        }
        catch (error:any) {
            return Promise.reject(error);
        }
    }

    export async function SchemaDataSave (data:Data):Promise<void> {
        try {
            BasicCheck(data);

            // Check necessary property 'schemaFields.value'
            console.log(data);
            var values = data.schemaFields?.values;
            if (!values) {
                throw new Error(`property 'schemaFields.values' is needed!`);
            }

            // Send schema data to server
            var response = await Call("POST", url + '/schema_data_save', data);
            if (response.success) {
                return Promise.resolve(response.value);
            }
            return Promise.reject(response.error);
        }
        catch (error:any) {
            return Promise.reject(error);
        }
    }

    export async function SchemaDataLoad (data:Data):Promise<Data> {
        try {
            BasicCheck(data);

            // Check possible property 'schemaFields.where' 
            var fieldsWhere = data.schemaFields?.where;
            var fieldsLimit = data.schemaFields?.limit;
            if (!fieldsWhere && !fieldsLimit) {
                throw new Error(`property 'schemaFields.where' or 'schemaFields.limit' is needed!`);
            }

            // Send schema data request to server
            var response = await Call("POST", url + '/schema_data_load', data);
            if (response.success) {
                return Promise.resolve(response.value);
            }
            return Promise.reject(response.error);
        }
        catch (error:any) {
            return Promise.reject(error);
        }
    }

    async function Call (method:Method, fullurl:string, reqdata?:any, isFile?:boolean):Promise<any> {
        try {
            var requestInit:RequestInit = { 
                method  : method,
                body    : isFile || !reqdata ? reqdata : JSON.stringify(reqdata),
                headers : isFile ? undefined : {
                    'Content-Type'  : 'application/json'
                }
            };
            var response:Response = await fetch (fullurl, requestInit);
            var resdata:any = await response.json();
            return resdata;
        }
        catch (error:any) {
            console.error(error);
            return null;
        }
    }
    
}