//@ts-ignore
declare var Conquer:any;

function Init () {
    var data = {
        fields: {}
    }
    
    SchemaStructureLoad();
}

var logs:string[] = [];
var maxLogs:number = 10;
var port:number = 80;
var host:string = 'nowwa.io';
var version:string = '0.0.1';
var url:string = `https://${host}/webhook/${version}` + (port == 80) ? `` : `:${port}`;

type Method = "GET" | "POST";

function Log(log:any, isError?:boolean):void {
    if (typeof log != 'string') {
        logs.push(JSON.stringify(log));
    } else {
        logs.push(log);
    }
    if (logs.length > maxLogs) logs.shift();
    var output = "";
    for (var i = 0; i < logs.length; i++) {
        output += logs[i];
        output += '\n';
    }
    if (isError) {
        console.error(log);
    } else {
        console.log(log);
    }
    if (document != null)  {
        var element = document.getElementById(`output`);
        if (element != null) {
            element.innerHTML = output;
        }
    }
}

async function Call (method:Method, url:string, reqdata?:any, isFile?:boolean):Promise<any> {
    try {
        var requestInit:RequestInit = { 
            method  : method,
            body    : isFile ? reqdata : JSON.stringify(reqdata),
            headers : isFile ? undefined : {
                'Content-Type'  : 'application/json'
            }
        };
        console.log(requestInit);
        var response:Response = await fetch (url, requestInit);
        Log(reqdata);
        var resdata:any = await response.json();
        Log(resdata);
        return resdata;
    }
    catch (error:any) {
        Log(error, true);
        return null;
    }
}

async function CallGetDefault ():Promise<void> {
    Log('call get default...');
    return Call("GET", url);
}

async function CallPostAuthenticate ():Promise<void> {
    var username:string = $(`#fld_username`).val() as string;
    var password:string = $(`#fld_password`).val() as string;
    if (username.length == 0) {  
        return Log('username cannot be empty!');
    }
    if (password.length == 0) {  
        return Log('password cannot be empty!');
    } 
    Log('call post authenticate...');
    return Call("POST",url + "/authenticate", {username:username, password:password});
}

async function CallPostRegister ():Promise<void> {
    var username:string = $(`#fld_username`).val() as string;
    var password:string = $(`#fld_password`).val() as string;
    var repassword:string = $(`#fld_repassword`).val() as string;
    if (username.length == 0) {  
        Log('username cannot be empty!');
        return Promise.resolve();
    }
    if (password.length == 0) {  
        Log('password cannot be empty!');
        return Promise.resolve();
    } 
    if (repassword != password) {  
        Log('password mismatch!');
        return Promise.resolve();
    }
    Log('call post register...');
    return Call("POST", url + "/register", {username:username, password:password});
}

async function CallPostUpload ():Promise<void> {
    var filename = ($(`#fld_file`).val()) as string;
    if (filename.length == 0) {  
        return Log('file cannot be empty!');
    }
    var method:Method = "POST";
    var files:FileList | null = (($(`#fld_file`) as unknown as HTMLInputElement[])[0]).files;
    if (files != null) {
        let formData = new FormData();
        for (var i:number = 0; i < files.length; i++) {
            console.log(files[i]);
            formData.append(`fld_file_${i}`, files[i]);
        }
        Log('call post upload...');
        return Call(method,url + "/upload", formData, true);
    }
}

var lastFieldNum:number = 0;
var fieldNumbers:number[] = [];

function SchemaStructureAddField (reset:boolean, schemaName?:string, fieldName?:string, fieldType?:string):void {
    if (reset) {
        for( var i = 0; i < fieldNumbers.length; i++){ 
            var fieldNumber = fieldNumbers[i];
            $(`#con_field_structure_${fieldNumber}`).remove(); 
        }
        fieldNumbers = [];
        lastFieldNum = 0;
        
        if (schemaName) {
            $("#fld_schema_structure").attr('disabled', 'disabled');
            $("#fld_schema_structure").val(schemaName);
        } else {
            $("#fld_schema_structure").removeAttr('disabled');
            $("#fld_schema_structure").val('');
        }
    }
    var removeButton = lastFieldNum > 0 ?
    `<button class="small" onclick="SchemaStructureRemoveField(${lastFieldNum});">-</button>` :
    ``;
    var schemaNameRaw = schemaName ? `'${schemaName}'` : undefined;
    var element = 
    `<div id="con_field_structure_${lastFieldNum}">
        <input placeholder="enter field name..." id="fld_field_structure_${lastFieldNum}" type="text" value="${fieldName || ''}"><select id="sel_field_structure_${lastFieldNum}" name="cars">
            <option value="string" ${fieldType == 'string' ? 'selected' : ''}>string</option>
            <option value="number" ${fieldType == 'number' ? 'selected' : ''}>number</option>
            <option value="boolean" ${fieldType == 'boolean' ? 'selected' : ''}>boolean</option>
            <option value="date" ${fieldType == 'date' ? 'selected' : ''}>date</option>
        </select><button class="small" onclick="SchemaStructureAddField(false, ${schemaNameRaw});">+</button>${removeButton}
    </div>`
    $( "#custom_schema_structure" ).append(element); 
    fieldNumbers.push(lastFieldNum);
    lastFieldNum++;
} 

function SchemaStructureRemoveField (fieldNumber:number, schemaName?:string):void {
    // TODO : check for removal of a field
    for( var i = 0; i < fieldNumbers.length; i++){ 
        if ( fieldNumbers[i] === fieldNumber) { 
            fieldNumbers.splice(i, 1); 
        }
    }
    $(`#con_field_structure_${fieldNumber}`).remove(); 
} 

async function SchemaStructureSave ():Promise<void> {
    var value:{ 
        schemaName:string, 
        schemaFields: {
            add: {[key:string]:string}
        }
    } = {
        schemaName: ($(`#fld_schema_structure`).val()) as string,
        schemaFields: {
            add: {}
        }
    }
    if (value.schemaName.length == 0) {
        Log('schema name cannot be empty!');
        return Promise.reject(new Error('schema name cannot be empty!'));
    }

    // Prepare data to be sent
    for (var i:number = 0; i < fieldNumbers.length; i++) {
        var fieldNumber:number = fieldNumbers[i];
        var fieldType:string = $(`#sel_field_structure_${fieldNumber}`).find(":selected").text();
        var fieldName:string = ($(`#fld_field_structure_${fieldNumber}`).val()) as string;
        if (fieldName.length == 0) {
            Log('one of the field cannot be empty!');
            return Promise.reject(new Error('one of the field cannot be empty!'));
        }
        Log(`add field: ${fieldName} as ${fieldType}...`);
        value.schemaFields.add[fieldName] = fieldType;
    }

    Log(`save schema: ${value.schemaName}...`);
    try {
        await Conquer.SchemaStructureSave(value);
        await SchemaStructureLoad();
        Log(`schema '${value.schemaName}' added!`);
    }
    catch (error:any) {
        console.error(error);
    }
}

var customSchemas:{[key:string]:any} = {};

async function SchemaStructureLoad (schemaNames?:string[]):Promise<void> {
    Log('load custom schemas...');
    var schemas = await Conquer.SchemaStructureLoad(schemaNames);
    $( "#custom_schema_list" ).empty();
    for (var i:number = 0; i < schemas.length; i++) {
        var data = schemas[i];
        if (customSchemas[data.schemaName as string] == undefined) {
            customSchemas[data.schemaName as string] = data;
            $( "#custom_schema_list" ).append( 
                `${i > 0 ? '<br/>' : ''}<button onclick="SchemaStructureSelect('${data.schemaName}');">${data.schemaName}</button>`
            ); 
        }
    }

}

function SchemaStructureSelect(schemaName?:string) {
    if (schemaName) {
        var structure = customSchemas[schemaName];
        console.log(`Schema Name: ${structure.schemaName}`);
        var fieldNames = Object.keys(structure.schemaFields);
        for (var i:number = 0; i < fieldNames.length; i++) {
            var fieldName = fieldNames[i];
            var fieldType = structure.schemaFields[fieldName];
            SchemaStructureAddField(i == 0, schemaName, fieldName, fieldType);
        }
    }
}

async function CallPostSaveCustomSchema ():Promise<void> {
    var selcetedSchemaName = $( "#sel_schema_save" ).find(":selected").text();
    if (selcetedSchemaName.length == 0) {
        Log('schema name cannot be empty!');
        return Promise.resolve();
    }
}

window.onload = Init;