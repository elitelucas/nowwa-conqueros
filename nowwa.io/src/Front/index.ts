function Init () {

}

var logs:string[] = [];
var maxLogs:number = 10;
var port:number = 80;
var host:string = 'nowwa.io';
var url:string = `https://${host}` + (port == 80) ? `` : `:${port}`;

type Method = "GET" | "POST";

function GetInputTextValue(id:string):string {
    if (document != null)  {
        var element:HTMLElement | null  = document.getElementById(id);
        if (element != null) {
            return (element as HTMLInputElement).value;
        }
    }
    return "";
}

function GetInputFileValue(id:string):File | null {
    if (document != null)  {
        var element:HTMLElement | null  = document.getElementById(id);
        if (element != null) {
            var files:FileList | null = (element as HTMLInputElement).files;
            if (files != null) {
                return files[0];
            }
        }
    }
    return null;
}

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
    var username:string = GetInputTextValue(`fld_username`);
    var password:string = GetInputTextValue(`fld_password`);
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
    var username:string = GetInputTextValue(`fld_username`);
    var password:string = GetInputTextValue(`fld_password`);
    var repassword:string = GetInputTextValue(`fld_repassword`);
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
    var filename = GetInputTextValue(`fld_file`);
    if (filename.length == 0) {  
        return Log('file cannot be empty!');
    }
    var file:File | null = GetInputFileValue("fld_file");
    if (file != null) {
        let formData = new FormData();
        formData.append("fld_file", file);
        Log('call post upload...');
        return Call("POST",url + "/upload", formData);
    }
}

window.onload = Init;