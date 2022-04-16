//@ts-ignore
declare var Conquer:any;

function Init () {
    var data = {
        fields: {}
    }
    Conquer.SaveSchemaStructure(data);
    CallGetLoadCustomSchemas();
}

var logs:string[] = [];
var maxLogs:number = 10;
var port:number = 80;
var host:string = 'nowwa.io';
var url:string = `https://${host}` + (port == 80) ? `` : `:${port}`;

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

var lastFieldNum:number = 1;
var fieldNumbers:number[] = [0];

function AddCustomField ():void {
    $( "#custom_schema_create" ).append( 
        `<div id="con_field_${lastFieldNum}">
            <input placeholder="field name" id="fld_field_create_${lastFieldNum}" type="text"><select id="sel_field_${lastFieldNum}" name="cars">
                <option value="string">string</option>
                <option value="number">number</option>
                <option value="boolean">boolean</option>
                <option value="date">date</option>
            </select><button class="small" onclick="AddCustomField();">+</button><button class="small" onclick="RemoveCustomField(${lastFieldNum});">-</button>
        </div>`
    ); 
    fieldNumbers.push(lastFieldNum);
    lastFieldNum++;
} 

function RemoveCustomField (fieldNumber:number):void {
    for( var i = 0; i < fieldNumbers.length; i++){ 
        if ( fieldNumbers[i] === fieldNumber) { 
            fieldNumbers.splice(i, 1); 
        }
    }
    $(`#con_field_create_${fieldNumber}`).remove(); 
} 

async function CallPostAddCustomSchema ():Promise<void> {
    var value:{ 
        schema:string, 
        fields:{[key:string]:string} 
    } = {
        schema: ($(`#fld_schema_create`).val()) as string,
        fields: {}
    }
    if (value.schema.length == 0) {
        Log('schema name cannot be empty!');
        return Promise.resolve();
    }
    Log(`add schema: ${value.schema}`);
    for (var i:number = 0; i < fieldNumbers.length; i++) {
        var fieldNumber:number = fieldNumbers[i];
        var fieldType:string = $(`#sel_field_create_${fieldNumber}`).find(":selected").text();
        var fieldName:string = ($(`#fld_field_${fieldNumber}`).val()) as string;
        if (fieldName.length == 0) {
            Log('one of the field cannot be empty!');
            return Promise.resolve();
        }
        Log(`add field: ${fieldName} as ${fieldType}`);
        $(`#sel_field_${fieldNumber}`).val("string");
        $(`#fld_field_${fieldNumber}`).val('');
        if (fieldNumber != 0) {
            $(`#con_field_${fieldNumber}`).remove();
        }
        value.fields[fieldName] = fieldType;
    }
    $(`#fld_schema`).val('');
    Log('call post add custom schema...');
    var output = await Call("POST", url + "/add_custom_schema", value);
    if (!output) {
        await CallGetLoadCustomSchemas();
    }
}

var customSchemas:{[key:string]:any} = {};

async function CallGetLoadCustomSchemas ():Promise<void> {
    Log('call post get load custom schemas...');
    var schemas = (await Call("GET", url + "/load_custom_schemas")).value;
    
    for (var i:number = 0; i < schemas.length; i++) {
        var data = schemas[i];
        if (customSchemas[data.schema] == undefined) {
            customSchemas[data.schema] = data;
            $( "#custom_schema_list" ).append( 
                `<br/><button onclick="ShowCustomSchema('${data.schema}');">${data.schema}</button>`
            ); 
        }
    }
    SelectCustomSchema(schemas.length == 0 ? undefined : schemas[0].schema);
    if (schemas.length > 0) {
        OnSelectCustomSchema();
    }
}

function ShowCustomSchema(schemaName:string) {
    var detail:string = `${schemaName}:\n` + JSON.stringify(customSchemas[schemaName].fields, null, 4);
    $( "#custom_schema_detail" ).val(detail);
}

function SelectCustomSchema(schemaName?:string) {
    $( "#sel_schema_save" ).val([]);
    if (schemaName) {
        var schemaNames = Object.keys(customSchemas);
        if (schemaNames.length > 0) {
            for (var i:number = 0; i < schemaNames.length; i++) {
                console.log(`Schema Name: ${schemaNames[i]}`);
                $( "#sel_schema_save" ).append( 
                    `<option value="${schemaNames[i]}">${schemaNames[i]}</button>`
                ); 
            }
        }
    }
}

function OnSelectCustomSchema () {
    $( "#con_field_save" ).empty();
    var selcetedSchemaName = $( "#sel_schema_save" ).find(":selected").text();
    var schema = customSchemas[selcetedSchemaName];
    var fieldNames = Object.keys(schema.fields);
    for (var i:number = 0; i < fieldNames.length; i++) {
        var fieldName = fieldNames[i];
        var fieldType = schema.fields[fieldName];
        $( "#con_field_save" ).append( 
            `<input type="text" value="${fieldName} - ${fieldType}" readonly><input placeholder="field value" id="fld_field_save_${i}" type="text"><br/>`
        ); 
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