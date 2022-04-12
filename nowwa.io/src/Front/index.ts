function Init () {

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

async function Call (method:Method, url:string, data?:any):Promise<any> {
    try {
        var response:Response = await fetch (url, { 
            method  : method,
            body    : data
        });
        var data:any = await response.json();
        Log(data);
        return data;
    }
    catch (error:any) {
        Log(error, true);
        return null;
    }
}

async function CallGetDefault ():Promise<void> {
    Log('call get default...');
    await Call("GET", url);
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
    await Call("POST",url + "/authenticate", {username:username, password:password});
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
    var file:File | null = (($(`#fld_file`) as unknown as HTMLInputElement[])[0]).files![0];
    if (file != null) {
        let formData = new FormData();
        formData.append("fld_file", file);
        Log('call post upload...');
        return Call(method,url + "/upload", formData);
    }
}

var lastFieldNum:number = 1;
var fieldNumbers:number[] = [0];

function AddCustomField ():void {
    $( "#custom" ).append( 
        `<div id="con_field_${lastFieldNum}">
            <input placeholder="field name" id="fld_field_${lastFieldNum}" type="text"><select id="sel_field_${lastFieldNum}" name="cars">
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
    $(`#con_field_${fieldNumber}`).remove(); 
} 

async function CallPostAddSchema ():Promise<void> {
    var schema:string = ($(`#fld_schema`).val()) as string;
    Log(`add schema: ${schema}`);
    for (var i:number = 0; i < fieldNumbers.length; i++) {
        var fieldNumber:number = fieldNumbers[i];
        var fieldType:string = $(`#sel_field_${fieldNumber}`).find(":selected").text();
        var fieldName:string = ($(`#fld_field_${fieldNumber}`).val()) as string;
        Log(`add field: ${fieldName} as ${fieldType}`);
        $(`#sel_field_${fieldNumber}`).val("string");
        $(`#fld_field_${fieldNumber}`).val('');
        if (fieldNumber != 0) {
            $(`#con_field_${fieldNumber}`).remove(); 
        }
    }
    $(`#fld_schema`).val('');
    return Promise.resolve();
}

window.onload = Init;