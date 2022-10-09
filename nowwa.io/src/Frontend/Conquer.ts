import io from 'socket.io-client';
import { Client, RpcResponse, Session } from '@heroiclabs/nakama-js';

class Conquer {

    constructor() {
        this.nakamaClient = new Client(process.env.NAKAMA_SERVER_KEY, process.env.NAKAMA_HOST, process.env.NAKAMA_PORT, process.env.NAKAMA_USE_SSL as string == "true");
    }

    private async Call(method: Conquer.Method, fullurl: string, reqdata?: any, isFile?: boolean): Promise<any> {
        try {
            var requestInit: RequestInit = {
                method: method,
                body: isFile || !reqdata ? reqdata : JSON.stringify(reqdata),
                headers: isFile ? undefined : {
                    'Content-Type': 'application/json'
                }
            };
            var response: Response = await fetch(fullurl, requestInit);
            var resdata: any = await response.json();
            return resdata;
        }
        catch (error: any) {
            console.error(error);
            return null;
        }
    }

    //#region Nakama

    private nakamaClient: Client;
    private nakamaSession?: Session;
    private nakamaUsername?: string;

    public async NakamaConnect(username: string, password: string, email?: string): Promise<void> {
        try {
            if (email == null) {
                email = `${username}@conquer.nowwa`;
            }
            this.nakamaSession = await this.nakamaClient.authenticateEmail(email, password, true, username);
            this.nakamaUsername = username;
            return Promise.resolve();
        } catch (err) {
            return Promise.reject(err);
        }
    }

    public async NakamaRPC(rpc: string, input?: object): Promise<RpcResponse> {
        if (!this.nakamaSession) {
            return Promise.reject();
        }
        return this.nakamaClient.rpc(this.nakamaSession as Session, rpc, input || {});
    }

    public async NakamaRPCAnonymous(rpc: string, input?: object): Promise<RpcResponse> {
        return this.nakamaClient.rpcHttpKey(process.env.NAKAMA_HTTP_KEY as string, rpc, input || {});
    }

    public async NakamaSaveKeyContext(gameId: string, contextId: string, key: string, value: any): Promise<RpcResponse> {
        let input = {
            game_id: gameId,
            context_id: contextId,
            key: key,
            value: value
        }
        return await this.nakamaClient.rpcHttpKey(process.env.NAKAMA_HTTP_KEY as string, "set_data", input);
    }

    public async NakamaLoadKeyContext(gameId: string, contextId: string, key: string): Promise<RpcResponse> {
        let input = {
            game_id: gameId,
            context_id: contextId,
            key: key
        }
        return await this.nakamaClient.rpcHttpKey(process.env.NAKAMA_HTTP_KEY as string, "get_data", input);
    }

    public async NakamaSaveContext(gameId: string, contextId: string, value: object): Promise<RpcResponse> {
        let input = {
            game_id: gameId,
            context_id: contextId,
            value: value
        }
        return await this.nakamaClient.rpcHttpKey(process.env.NAKAMA_HTTP_KEY as string, "set_data", input);
    }

    public async NakamaLoadContext(gameId: string, contextId: string): Promise<RpcResponse> {
        let input = {
            game_id: gameId,
            context_id: contextId
        }
        return await this.nakamaClient.rpcHttpKey(process.env.NAKAMA_HTTP_KEY as string, "get_data", input);
    }

    public async NakamaSaveKey(gameId: string, key: string, value: any): Promise<RpcResponse> {
        if (!this.nakamaSession) {
            return Promise.reject();
        }
        let input = {
            game_id: gameId,
            username: this.nakamaUsername,
            key: key,
            value: value
        }
        return await this.nakamaClient.rpc(this.nakamaSession, "set_data", input);
    }

    public async NakamaLoadKey(gameId: string, key: string): Promise<RpcResponse> {
        if (!this.nakamaSession) {
            return Promise.reject();
        }
        let input = {
            game_id: gameId,
            username: this.nakamaUsername,
            key: key
        }
        return await this.nakamaClient.rpc(this.nakamaSession, "get_data", input);
    }

    public async NakamaSave(gameId: string, value: object): Promise<RpcResponse> {
        if (!this.nakamaSession) {
            return Promise.reject();
        }
        let input = {
            game_id: gameId,
            username: this.nakamaUsername,
            content: value
        }
        return await this.nakamaClient.rpc(this.nakamaSession, "set_data", input);
    }

    public async NakamaLoad(gameId: string): Promise<RpcResponse> {
        if (!this.nakamaSession) {
            return Promise.reject();
        }
        let input = {
            game_id: gameId,
            username: this.nakamaUsername
        }
        return await this.nakamaClient.rpc(this.nakamaSession, "get_data", input);
    }
    //#endregion

    //#region Socket

    private socketHost = '127.0.0.1';
    // var socketHost = 'nowwa.io';
    private socketPort = 9003;
    // var socketPort = 80;
    private get socketUseSSL() { return false; }
    // var socketUseSSL = true;
    private get socketProtocol(): string { return this.socketUseSSL ? 'https' : 'http'; }
    private get socketPortFinal(): string { return (this.socketPort == 80 && !this.socketUseSSL) || (this.socketPort == 443 && this.socketUseSSL) ? `` : `:${this.socketPort.toString()}`; };
    private get socketURL(): string { return `${this.socketProtocol}://${this.socketHost}${this.socketPortFinal}`; }

    private socket?: any;
    private socketListeners: Map<string, any> = new Map<string, any>();

    public SocketConnect(reconnect: boolean = true) {
        this.socket = io(this.socketURL);
        this.socket.on("connect", () => {
            console.log(`[socket] connect status: ${this.socket.connected}`);
        });

        this.socket.on("disconnect", () => {
            console.log(`[socket] connect status: ${this.socket.connected}`);
            // reconnect
            if (reconnect) {
                this.SocketConnect();
            }
        });

        this.socketListeners.forEach((action: any, key: string) => {
            this.socket.on(key, (args: any) => {
                action(args);
            });
        });
    }

    private SocketSend(key: string, args: any) {
        this.socket.emit(key, args);
    }

    private SocketDisconnect() {
        this.socket.disconnect();
    }

    private SocketAddListener(key: string, action: any) {
        this.socketListeners.set(key, action);
        this.socket.on(key, (args: any) => {
            action(args);
        });
    }

    private SocketClearListener() {
        this.socketListeners.clear();
    }
    //#endregion

    //#region Database

    private mainHost = '127.0.0.1';
    // var mainHost = 'nowwa.io';
    private mainPort = 9000;
    // var mainPort = 80;
    private get mainUseSSL() { return false; }
    // var mainUseSSL = true;
    private get mainProtocol(): string { return this.mainUseSSL ? 'https' : 'http'; }
    private get mainPortFinal(): string { return (this.mainPort == 80 && !this.mainUseSSL) || (this.mainPort == 443 && this.mainUseSSL) ? `` : `:${this.mainPort.toString()}`; };
    private get mainURL(): string { return `${this.mainProtocol}://${this.mainHost}${this.mainPortFinal}`; }
    private SchemaCheck(data?: Conquer.Data) {
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

    public async SchemaStructureSave(structure: Conquer.Data): Promise<void> {
        try {
            this.SchemaCheck(structure);

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
                var structureFieldNamesToAdd: string[] = Object.keys(structure.schemaFields?.add as { [key: string]: string });
                for (var i = 0; i < structureFieldNamesToAdd.length; i++) {
                    var fieldName: string = structureFieldNamesToAdd[i];

                    // Check field type reference
                    var fieldType = structure.schemaFields?.add?.[`${fieldName}`];
                    if (typeof fieldType != 'string') {
                        throw new Error(`property 'schemaFields.add.${fieldName}' needs to be defined in string! (e.g 'number' or 'boolean' or 'string')`);
                    }
                    if (fieldType && !Conquer.Types.includes(fieldType)) {
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
                    for (var i: number = 0; i < structureFieldNamesToRemove.length; i++) {

                        // Check field type reference
                        if (typeof structureFieldNamesToRemove[i] != 'string') {
                            throw new Error(`element no.[${i}] in 'schemaFields.remove' needs to be a string! (it was ${structureFieldNamesToRemove[i]})`);
                        }
                    }
                }
            }

            // Send schema structure to server
            var response = await this.Call("POST", this.mainURL + '/database/structure/save', structure);
            if (response.success) {
                return Promise.resolve();
            }
            return Promise.reject(response.error);
        }
        catch (error: any) {
            return Promise.reject(error);
        }
    }

    public async SchemaStructureLoad(schemaNames?: string[]): Promise<Conquer.Data[]> {
        try {
            var response = await this.Call("POST", this.mainURL + '/database/structure/load', { schemaNames: schemaNames });
            if (response.success) {
                return Promise.resolve(response.value);
            }
            return Promise.reject(response.error);
        }
        catch (error: any) {
            return Promise.reject(error);
        }
    }

    public async SchemaDataSave(data: Conquer.Data): Promise<void> {
        try {
            this.SchemaCheck(data);

            // Check necessary property 'schemaFields.value'
            var values = data.schemaFields?.values;
            if (!values) {
                throw new Error(`property 'schemaFields.values' is needed!`);
            }

            // Send schema data to server
            var response = await this.Call("POST", this.mainURL + '/database/data/save', data);
            if (response.success) {
                return Promise.resolve(response.value);
            }
            return Promise.reject(response.error);
        }
        catch (error: any) {
            return Promise.reject(error);
        }
    }

    public async SchemaDataLoad(data: Conquer.Data): Promise<Conquer.Data> {
        try {
            this.SchemaCheck(data);

            // Check possible property 'schemaFields.where' 
            var fieldsWhere = data.schemaFields?.where;
            var fieldsLimit = data.schemaFields?.limit;
            if (!fieldsWhere && !fieldsLimit) {
                throw new Error(`property 'schemaFields.where' or 'schemaFields.limit' is needed!`);
            }

            // Send schema data request to server
            var response = await this.Call("POST", this.mainURL + '/database/data/load', data);
            if (response.success) {
                return Promise.resolve(response.value);
            }
            return Promise.reject(response.error);
        }
        catch (error: any) {
            return Promise.reject(error);
        }
    }

    //#endregion

    public async UserAuthenticate(username: string, password: string) {
        try {
            var data = {
                username: username,
                password: password
            }

            // Send schema data request to server
            var response = await this.Call("POST", this.mainURL + '/authentication/login', data);
            if (response.success) {
                return Promise.resolve(response.value);
            }
            return Promise.reject(response.error);
        }
        catch (error: any) {
            return Promise.reject(error);
        }
    }

    public async UserRegister(username: string, password: string) {
        try {
            var data = {
                username: username,
                password: password
            }

            // Send schema data request to server
            var response = await this.Call("POST", this.mainURL + '/authentication/register', data);
            if (response.success) {
                return Promise.resolve(response.value);
            }
            return Promise.reject(response.error);
        }
        catch (error: any) {
            return Promise.reject(error);
        }
    }

    public async UserUpload() {

    }

}

namespace Conquer {

    export var version: string = '0.0.1';

    export var Types: string[] = [
        'string',
        'number',
        'boolean',
        'object'
    ]

    export type Method = "GET" | "POST";

    export type Data = {
        schemaName?: string,
        schemaFields?: {
            remove?: string[],
            add?: { [key: string]: string }
            values?: { [key: string]: any },
            types?: { [key: string]: string },
            where?: {
                [key: string]:
                string |
                number |
                boolean |
                {
                    $lt?: number, // less than
                    $lte?: number, // less than equal to
                    $gt?: number, // greater than
                    $gte?: number, // greater than equal to
                    $ne?: number, // not equal to
                    $in?: number[] | string[], // in an array of
                    $nin?: number[] | string[], // not in an array of 
                    $regex?: string | RegExp, // match regex
                    $size?: number, // is an array with size of   
                }
            },
            limit?: number,
        }
    }

    export async function TestNakama() {
        var Nakama_client = new Client(process.env.NAKAMA_SERVER_KEY, process.env.NAKAMA_HOST, process.env.NAKAMA_PORT, process.env.NAKAMA_USE_SSL as string == 'true');
        var Nakama_email = "user001@test.com";
        var Nakama_password = "password001";
        var Nakama_username = "username001";
        const Nakama_session = await Nakama_client.authenticateEmail(Nakama_email, Nakama_password, true, Nakama_username);
        console.info(`this is a nakama session: `);
        console.info(Nakama_session);

        var params1 = {
            game_id: "game001",
            // context_id: "context001",
            username: "username001",
            // content: {
            //     key002: {
            //         fieldX: "valueX",
            //         fieldY: "valueY"
            //     },

            //     key001: {
            //         fieldA: "valueA",
            //         fieldB: "valueB"
            //     }
            // },
            key: "key002",
            value: {
                fieldX: "valueX",
                fieldY: "valueY"
            }
        }
        // var response1 = await Nakama_client.rpc(Nakama_session, "set_data", params1);
        // console.info(`response set_data`);
        // console.log(response1);

        var params2 = {
            game_id: "game001",
            // context_id: "context001",
            username: "username001",
            key: "key002"
        }
        var response2 = await Nakama_client.rpc(Nakama_session, "get_data", params2);
        console.info(`response get_data`);
        console.log(response2.payload);
    }

    export async function TestDatabase() {


        // // Case invalid data type
        // var data001 = {
        //     "schemaName"        : "schema002",
        //     "schemaFields"      : {
        //         "values"        : {
        //             "field001"  : "a string value", // invalid, should be number as defined above
        //             "field002"  : 100, // invalid, should be string as defined above
        //             "field003"  : true, // valid
        //         },
        //     }
        // };
        // await Conquer.SchemaDataSave(data001);

        // Case valid data type
        // var data001 = {
        //     "schemaName"        : "schema002",
        //     "schemaFields"      : {
        //         "values"        : {
        //             "field001"  : -99, // valid
        //             "field002"  : "hello", // valid
        //             "field003"  : false, // valid
        //         },
        //     }
        // };
        // await Conquer.SchemaDataSave(data001);
        // console.log('schema data saved');

        // Case valid search filter
        // var filter001 = {
        //     "schemaName"        : "schema002",
        //     "schemaFields"      : {
        //         "where"         : {
        //             "field002"  : {
        //                 $lt     : 100 // less than operator ($lt) 
        //             }
        //         },
        //     }
        // };
        // var data = await Conquer.SchemaDataLoad(filter001);
        // console.log('schema data loaded');
        // console.log(data);

        // var structure002alter001 = {
        //     "schemaName"        : "schema002",
        //     "schemaFields"      : {
        //         "add"           : {
        //             "field004"  : "object"
        //         },
        //     }
        // };
        // await Conquer.SchemaStructureSave(structure002alter001);
        // console.log('schema structure altered');


        // var structure002Alter002 = {
        //     "schemaName"        : "schema002",
        //     "schemaFields"      : {
        //         "remove"        : ["field001"]
        //     }
        // };
        // await Conquer.SchemaStructureSave(structure002Alter002);
        // console.log('schema structure altered');

        // Case valid data type
        // var data002 = {
        //     "schemaName"        : "schema002",
        //     "schemaFields"      : {
        //         "values"        : {
        //             "field004"  : {
        //                 "key"   : "value"
        //             }, // valid
        //             "field002"  : "hello", // valid
        //             "field003"  : false, // valid
        //         },
        //     }
        // };
        // await Conquer.SchemaDataSave(data002);
        // console.log('schema data saved');
        return Promise.resolve();
    }

}

export default Conquer; 