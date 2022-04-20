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
var fieldsToRemove:string[] = [];
var previousFields:string[] = [];
var activeSchemaName:string = '';

function SchemaStructureAddField (fieldName?:string, fieldType?:string):void {
        
    if (activeSchemaName) {
        $("#fld_schema_structure").attr('disabled', 'disabled');
        $("#fld_schema_structure").val(activeSchemaName);
    } else {
        $("#fld_schema_structure").removeAttr('disabled');
        $("#fld_schema_structure").val('');
    }

    var fieldNameRaw = activeSchemaName ? `'${fieldName}'` : undefined;
    var removeButton = activeSchemaName || lastFieldNum > 0 ?
        `<button class="small" onclick="SchemaStructureRemoveField(${lastFieldNum}, ${fieldNameRaw});">-</button>` :
        ``;
    var element = 
        `<div id="con_field_structure_${lastFieldNum}">
            <input placeholder="enter field name..." id="fld_field_structure_${lastFieldNum}" type="text" value="${fieldName || ''}"><select id="sel_field_structure_${lastFieldNum}" name="cars">
                <option value="string" ${fieldType == 'string' ? 'selected' : ''}>string</option>
                <option value="number" ${fieldType == 'number' ? 'selected' : ''}>number</option>
                <option value="boolean" ${fieldType == 'boolean' ? 'selected' : ''}>boolean</option>
                <option value="date" ${fieldType == 'date' ? 'selected' : ''}>date</option>
            </select><button class="small" onclick="SchemaStructureAddField();">+</button>${removeButton}
        </div>`;
    $("#custom_schema_structure").append(element); 
    fieldNumbers.push(lastFieldNum);
    lastFieldNum++;
} 

function SchemaStructureRemoveField (fieldNumber:number, schemaName?:string):void {
    // TODO : check for removal of a field
    if (schemaName) {
        fieldsToRemove.push(schemaName);
    }
    for (var i:number = 0; i < fieldNumbers.length; i++) { 
        if (fieldNumbers[i] === fieldNumber) {
            fieldNumbers.splice(i, 1); 
        }
    }
    console.log(fieldNumbers);
    $(`#con_field_structure_${fieldNumber}`).remove(); 
} 

async function SchemaStructureSave ():Promise<void> {
    var value:{ 
        schemaName      : string, 
        schemaFields    : {
            add?        : {[key:string]:string}
            remove?     : string[] 
        }
    } = {
        schemaName: ($(`#fld_schema_structure`).val()) as string,
        schemaFields: {}
    }
    if (value.schemaName.length == 0) {
        Log('schema name cannot be empty!');
        return Promise.reject(new Error('schema name cannot be empty!'));
    }

    // Prepare data to be sent
    if (fieldNumbers.length > 0) {
        for (var i:number = 0; i < fieldNumbers.length; i++) {
            var fieldNumber:number = fieldNumbers[i];
            var fieldType:string = $(`#sel_field_structure_${fieldNumber}`).find(":selected").text();
            var fieldName:string = ($(`#fld_field_structure_${fieldNumber}`).val()) as string;
            if (fieldName.length == 0) {
                Log('one of the field cannot be empty!');
                return Promise.reject(new Error('one of the field cannot be empty!'));
            }
            var add = value.schemaFields.add || {};
            add[fieldName] = fieldType;
            value.schemaFields.add = add;
        }
        if (value.schemaFields.add) {
            var fieldsToAdd:string[] = Object.keys(value.schemaFields.add);
            for (var i:number = 0; i < previousFields.length; i++) {
                var fieldName:string = previousFields[i];
                if (!fieldsToAdd.includes(fieldName)) {
                    fieldsToRemove.push(fieldName);
                }
            }
        }
    }
    if (fieldsToRemove.length > 0) {
        value.schemaFields.remove = [];
        for (var i:number = 0; i < fieldsToRemove.length; i++) {
            value.schemaFields.remove.push(fieldsToRemove[i]);
        }
    }

    Log(`save schema: ${value.schemaName}...`);
    console.log(value);
    try {
        await Conquer.SchemaStructureSave(value);
        Log(`schema '${value.schemaName}' saved!`);
        await SchemaStructureLoad();
        $("#btn_schema_data_save").hide();
        $("#btn_schema_structure_save").hide();
        $("#fld_schema_structure").hide();
    }
    catch (error:any) {
        console.error(error);
    }
}

var customSchemas:{[key:string]:any} = {};

async function SchemaStructureLoad (schemaNames?:string[]):Promise<void> {
    Log('load custom schemas...');
    $("#custom_schema_list").empty();
    var structures = await Conquer.SchemaStructureLoad(schemaNames);
    Log(`custom schema loaded!`);
    customSchemas = {};
    for (var i:number = 0; i < structures.length; i++) {
        var data = structures[i];
        customSchemas[data.schemaName as string] = data;
        $("#custom_schema_list").append( 
            `${i > 0 ? '<br/>' : ''}<button onclick="SchemaStructureSelect('${data.schemaName}');">${data.schemaName}</button>`
        ); 
    }
    $("#custom_schema_data").empty();
    $("#custom_schema_structure").empty();
    $("#lbl_schema_data").text(`Schema Data`);
}

function SchemaStructureNew () {
    Log(`Schema Structure: NEW`);
    $("#custom_schema_data").empty();
    $("#custom_schema_structure").empty();
    $("#lbl_schema_data").text(`Schema Data`);
    $("#btn_schema_data_save").hide();
    $("#btn_schema_structure_save").show();
    $("#fld_schema_structure").show();
    fieldNumbers = [];
    fieldsToRemove = [];
    lastFieldNum = 0;
    activeSchemaName = '';
    SchemaStructureAddField();
}

function SchemaStructureSelect(schemaName:string) {
    Log(`Schema Structure: ${schemaName}`);
    activeSchemaName = schemaName;
    fieldsToRemove = [];
    fieldNumbers = [];
    previousFields = [];
    var structure = customSchemas[schemaName];
    var fieldNames = Object.keys(structure.schemaFields);

    $("#lbl_schema_data").text(`Schema Data - ${schemaName}`);
    $("#custom_schema_data").empty();
    $("#custom_schema_structure").empty();
    for (var i:number = 0; i < fieldNames.length; i++) {
        var fieldName = fieldNames[i];
        var fieldType = structure.schemaFields[fieldName];
        SchemaStructureAddField(fieldName, fieldType);
        previousFields.push(fieldName);
        
        $("#custom_schema_data").append( 
            `<div id="con_field_data">
                <input type="text" value="${fieldName} - ${fieldType}" readonly><input placeholder="enter ${fieldType} value..." id="fld_field_data_${fieldName}" type="text">
            </div>`
        ); 
    }
    $("#btn_schema_data_save").show();
    $("#btn_schema_structure_save").show();
    $("#fld_schema_structure").show();
}

async function SchemaDataSave ():Promise<void> {
    try {
        var data:{
            schemaName      : string,
            schemaFields    : {
                values      : {[key:string]:any}
            }
        } = {
            schemaName      : activeSchemaName,
            schemaFields    : {
                values      : {}
            }
        }
        var fieldNames = Object.keys(customSchemas[activeSchemaName].schemaFields);
        for (var i:number = 0; i < fieldNames.length; i++) {
            var fieldName:string = fieldNames[i];
            var fieldType:string = customSchemas[activeSchemaName].schemaFields[fieldName];
            var rawFieldValue:string = $(`#fld_field_data_${fieldName}`).val() as string;
            var fieldValue:any = rawFieldValue;
            if (fieldType == 'number') {
                fieldValue = parseFloat(rawFieldValue);
            }
            else if (fieldType == 'boolean') {
                fieldValue = rawFieldValue === 'true';
            }
            data.schemaFields.values[fieldName] = fieldValue;
        }
        var document = await Conquer.SchemaDataSave(data);
        console.log(document);
    }
    catch (error:any) {
        console.error(error);
    }
}

async function SchemaDataLoad ():Promise<void> {
    try {
        var value = {
            schemaName      : "schema003",
            schemaFields    : {
                where       : {
                    field007    : {
                        $gt     : 0,
                    }
                },
            }
        }
        var documents = await Conquer.SchemaDataLoad(value);
        console.log(documents);
    }
    catch (error:any) {
        console.error(error);
    }
}

async function RunCommand ():Promise<void> {
    try {
        var input:string = $("#input").val() as string;
        console.log(input);
        return Promise.resolve();
    }
    catch (error:any) {
        console.error(error);
    }
}

function ExampleStructureSave () {
    var input = 
`{
    "schemaName"        : "schema001",
    "schemaFields"      : {
        "values"        : {
            "field001"  : "number",
            "field002"  : "string",
            "field003"  : "boolean",
            "field004"  : "object"
        },
    }
}`;
    $("#input").val(input);
    $("#lbl_command").text(`call Conquer.SchemaStructureSave(value)`);
}

function ExampleStructureLoad () {
    var input = 
`[
    "schema001",
    "schema002"
]`;
    $("#input").val(input);
    $("#lbl_command").text(`call Conquer.SchemaStructureLoad(value)`);
}

window.onload = Init;