//@ts-ignore
module Conquer {

    var port:number = 80;
    var host:string = 'nowwa.io';
    var url:string = `https://${host}` + (port == 80) ? `` : `:${port}`;

    var Types:string[] = [
        'string',
        'number',
        'boolean',
    ]

    type Method = "GET" | "POST";

    type Data = {
        schema? : string,
        fields? : {
            remove? : string[],
            add?    : {[key:string]:string}
            values? : {[key:string]:any},
            types?  : {[key:string]:string},
            where?  : {[key:string]:any},
            limit?  : number,
        }
    }

    function BasicCheck (data?:Data) {
        if (data == undefined) {
            throw new Error(`must have an object to be processed!`);
        }
        if (!data.schema) {
            throw new Error(`property 'schema' is needed!`);
        }
        if (!data.fields) {
            throw new Error(`property 'fields' is needed!`);
        }
        return null;
    }

    export async function SaveSchemaStructure (structure:Data):Promise<void> {
        try {
            BasicCheck(structure);
            
            // Check possible property 'fields.add' & 'fields.remove' 
            var fieldsToAdd = structure.fields?.add;
            var fieldsToRemove = structure.fields?.remove;
            if (!fieldsToAdd && !fieldsToRemove) {
                throw new Error(`property 'fields.add' or 'fields.remove' is needed!`);
            }

            // If 'fields.add' is present
            if (fieldsToAdd) {

                // Check if fieldsToAdd has at least 1 property
                if (Object.keys(fieldsToAdd).length == 0) {
                    throw new Error(`property 'fields.add' need at least 1 property!`);
                }
                
                // Iterate through 'fields.add'
                var structureFieldNamesToAdd:string[] = Object.keys(structure.fields?.add as {[key:string]:string});
                for (var fieldName in structureFieldNamesToAdd) {
                    
                    // Check field type reference
                    var fieldType = structure.fields?.add?.[`'${fieldName}'`];
                    if (typeof fieldType != 'string') {
                        throw new Error(`property 'fields.add.${fieldName}' needs to be defined in string! (e.g 'number' or 'boolean' or 'string')`);
                    }
                    if (fieldType && !Types.includes(fieldType)) {
                        throw new Error(`property 'fields.add.${fieldName}' has an unknown type: '${fieldType}'!`);
                    }
                }
            }

            // If 'fields.remove' is present
            if (fieldsToRemove) {
                
                // Check if fieldsToRemove has at least 1 property
                if (fieldsToRemove.length == 0 || typeof fieldsToRemove != 'object') {
                    throw new Error(`property 'fields.remove' need to be at least an array with 1 string element!`);
                }
                
                // Iterate through 'fields.remove'
                if (fieldsToRemove) {
                    var structureFieldNamesToRemove = fieldsToRemove as any[];
                    for (var i:number = 0; i < structureFieldNamesToRemove.length; i++) {
                        
                        // Check field type reference
                        if (typeof structureFieldNamesToRemove[i] != 'string') {
                            throw new Error(`element no.[${i}] in 'fields.remove' needs to be a string! (it was ${structureFieldNamesToRemove[i]})`);
                        }
                    }
                }
            }

            // TODO: Send schema structure to server
            return Promise.resolve();
        }
        catch (error:any) {
            return Promise.reject(error);
        }
    }

    export async function LoadSchemaStructure (schema:string):Promise<Data> {
        try {
            // TODO: Send schema name to server
            
            // TODO : Return schema structure from server
            var data:Data = {
                schema  : schema,
                fields  : {
                    types   : {
                        name    : "string",
                        price   : "number"
                    }
                }
            }
            return Promise.resolve(data);
        }
        catch (error:any) {
            return Promise.reject(error);
        }
    }

    export async function SaveSchemaData (data:Data):Promise<void> {
        try {
            BasicCheck(data);

            // Check necessary property 'fields.value'
            if (!data.fields?.values) {
                throw new Error(`property 'fields.values' is needed!`);
            }

            // Load schema structure
            var structure:Data = await LoadSchemaStructure(data.schema as string);

            // Iterate through 'fields.value'
            var dataFieldNames:string[] = Object.keys(data.fields?.values as {[key:string]:any});
            for (var fieldName in dataFieldNames) {
                
                // Check field name reference
                var structureFieldType = structure.fields?.types?.[`'${fieldName}'`];
                if (!structureFieldType) {
                    throw new Error(`property 'fields.values.${fieldName}' is not needed!`);
                }

                // Check field type reference
                var fieldValue = data.fields?.values?.[`'${fieldName}'`];
                if (typeof fieldValue != structureFieldType) {
                    throw new Error(`property 'fields.values.${fieldName}' has incorrect type!`);
                }
            }

            // TODO: Send schema data to server
            return Promise.resolve();
        }
        catch (error:any) {
            return Promise.reject(error);
        }
    }

    export async function LoadSchemaData (data:Data):Promise<Data> {
        try {
            BasicCheck(data);

            // Check possible property 'fields.where' 
            var fieldsWhere = data.fields?.where;
            var fieldsLimit = data.fields?.limit;
            if (!fieldsWhere && !fieldsLimit) {
                throw new Error(`property 'fields.where' or 'fields.limit' is needed!`);
            }

            // If 'fields.where' is present
            if (fieldsWhere) {

                // Load schema structure
                var structure:Data = await LoadSchemaStructure(data.schema as string);

                // Iterate through 'fields.where'
                var dataFieldNames:string[] = Object.keys(data.fields?.where as {[key:string]:any});
                for (var fieldName in dataFieldNames) {
                    
                    // Check field name reference
                    var structureFieldType = structure.fields?.types?.[`'${fieldName}'`];
                    if (!structureFieldType) {
                        throw new Error(`property 'fields.where.${fieldName}' does not exists!`);
                    }

                    // Check field type reference
                    var fieldValue = data.fields?.where?.[`'${fieldName}'`];
                    if (typeof fieldValue != structureFieldType) {
                        throw new Error(`property 'fields.where.${fieldName}' has incorrect type!`);
                    }
                }
            }

            // TODO: Send schema data to server
            //var output = await Call("POST", url + "/schema_data_load", data); 

            // TODO : Return schema data from server
            var output:Data = {
                schema  : data.schema,
                fields  : {
                    values  : {
                        name    : "Loot Box",
                        price   : 100
                    }
                }
            }
            return Promise.resolve(output);
        }
        catch (error:any) {
            return Promise.reject(error);
        }
    }

    async function Call (method:Method, fullurl:string, reqdata?:any, isFile?:boolean):Promise<any> {
        try {
            var requestInit:RequestInit = { 
                method  : method,
                body    : isFile ? reqdata : JSON.stringify(reqdata),
                headers : isFile ? undefined : {
                    'Content-Type'  : 'application/json'
                }
            };
            var response:Response = await fetch (fullurl, requestInit);
            console.log(reqdata);
            var resdata:any = await response.json();
            console.log(resdata);
            return resdata;
        }
        catch (error:any) {
            console.error(error);
            return null;
        }
    }
    
}