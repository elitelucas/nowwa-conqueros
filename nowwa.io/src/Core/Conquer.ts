import io from 'socket.io-client';
import { Client, Session } from '@heroiclabs/nakama-js';

class Conquer {

    private static Instance: Conquer;

    private static nakamaClient: Client;
    private static nakamaSession: Session;

    public static async NakamaConnect(username: string, password: string, email?: string) {
        const nakamaClient = new Client(Conquer.nakamaKey, Conquer.nakamaHost, Conquer.nakamaPort.toString(), Conquer.nakamaUseSSL);
        if (email == null) {
            email = `${username}@conquer.nowwa`;
        }
        const nakamaSession = await nakamaClient.authenticateEmail(email, password, true, username);
        this.nakamaClient = nakamaClient;
        this.nakamaSession = nakamaSession;
        return nakamaSession;
    }

    public static async NakamaRPC(rpc: string, input: object) {
        return this.nakamaClient.rpc(this.nakamaSession as Session, rpc, input);
    }

}

namespace Conquer {

    export var version: string = '0.0.1';

    var mainHost = '127.0.0.1';
    // var mainHost = 'nowwa.io';
    var mainPort = 9000;
    // var mainPort = 80;
    var mainUseSSL = false;
    // var mainUseSSL = true;
    var mainProtocol: string = mainUseSSL ? 'https' : 'http';
    var mainPortFinal: string = (mainPort == 80 && !mainUseSSL) || (mainPort == 443 && mainUseSSL) ? `` : `:${mainPort.toString()}`;
    var mainURL: string = `${mainProtocol}://${mainHost}${mainPortFinal}`;

    var socketHost = '127.0.0.1';
    // var socketHost = 'nowwa.io';
    var socketPort = 9003;
    // var socketPort = 80;
    var socketUseSSL = false;
    // var socketUseSSL = true;
    var socketProtocol: string = socketUseSSL ? 'https' : 'http';
    var socketPortFinal: string = (socketPort == 80 && !socketUseSSL) || (socketPort == 443 && socketUseSSL) ? `` : `:${socketPort.toString()}`;
    var socketURL: string = `${socketProtocol}://${socketHost}${socketPortFinal}`;

    export var nakamaHost = '127.0.0.1';
    // var nakamaHost = 'nowwa.io';
    export var nakamaPort = 7350;
    // var nakamaPort = 80;
    export var nakamaUseSSL = false;
    // var nakamaUseSSL = true;
    export var nakamaKey = "server-N0ww@";
    export var nakamaProtocol: string = nakamaUseSSL ? 'https' : 'http';
    export var nakamaPortFinal: string = (nakamaPort == 80 && !nakamaUseSSL) || (nakamaPort == 443 && nakamaUseSSL) ? `` : `:${nakamaPort.toString()}`;
    export var nakamaURL: string = `${nakamaProtocol}://${nakamaHost}${nakamaPortFinal}`;

    var Types: string[] = [
        'string',
        'number',
        'boolean',
        'object'
    ]

    type Method = "GET" | "POST";

    type Data = {
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

    function SchemaCheck(data?: Data) {
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

    export async function SchemaStructureSave(structure: Data): Promise<void> {
        try {
            SchemaCheck(structure);

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
                    for (var i: number = 0; i < structureFieldNamesToRemove.length; i++) {

                        // Check field type reference
                        if (typeof structureFieldNamesToRemove[i] != 'string') {
                            throw new Error(`element no.[${i}] in 'schemaFields.remove' needs to be a string! (it was ${structureFieldNamesToRemove[i]})`);
                        }
                    }
                }
            }

            // Send schema structure to server
            var response = await Call("POST", mainURL + '/database/structure/save', structure);
            if (response.success) {
                return Promise.resolve();
            }
            return Promise.reject(response.error);
        }
        catch (error: any) {
            return Promise.reject(error);
        }
    }

    export async function SchemaStructureLoad(schemaNames?: string[]): Promise<Data[]> {
        try {
            var response = await Call("POST", mainURL + '/database/structure/load', { schemaNames: schemaNames });
            if (response.success) {
                return Promise.resolve(response.value);
            }
            return Promise.reject(response.error);
        }
        catch (error: any) {
            return Promise.reject(error);
        }
    }

    export async function SchemaDataSave(data: Data): Promise<void> {
        try {
            SchemaCheck(data);

            // Check necessary property 'schemaFields.value'
            var values = data.schemaFields?.values;
            if (!values) {
                throw new Error(`property 'schemaFields.values' is needed!`);
            }

            // Send schema data to server
            var response = await Call("POST", mainURL + '/database/data/save', data);
            if (response.success) {
                return Promise.resolve(response.value);
            }
            return Promise.reject(response.error);
        }
        catch (error: any) {
            return Promise.reject(error);
        }
    }

    export async function SchemaDataLoad(data: Data): Promise<Data> {
        try {
            SchemaCheck(data);

            // Check possible property 'schemaFields.where' 
            var fieldsWhere = data.schemaFields?.where;
            var fieldsLimit = data.schemaFields?.limit;
            if (!fieldsWhere && !fieldsLimit) {
                throw new Error(`property 'schemaFields.where' or 'schemaFields.limit' is needed!`);
            }

            // Send schema data request to server
            var response = await Call("POST", mainURL + '/database/data/load', data);
            if (response.success) {
                return Promise.resolve(response.value);
            }
            return Promise.reject(response.error);
        }
        catch (error: any) {
            return Promise.reject(error);
        }
    }

    export async function UserAuthenticate(username: string, password: string) {
        try {
            var data = {
                username: username,
                password: password
            }

            // Send schema data request to server
            var response = await Call("POST", mainURL + '/authentication/login', data);
            if (response.success) {
                return Promise.resolve(response.value);
            }
            return Promise.reject(response.error);
        }
        catch (error: any) {
            return Promise.reject(error);
        }
    }

    export async function UserRegister(username: string, password: string) {
        try {
            var data = {
                username: username,
                password: password
            }

            // Send schema data request to server
            var response = await Call("POST", mainURL + '/authentication/register', data);
            if (response.success) {
                return Promise.resolve(response.value);
            }
            return Promise.reject(response.error);
        }
        catch (error: any) {
            return Promise.reject(error);
        }
    }

    export async function UserUpload() {

    }

    async function Call(method: Method, fullurl: string, reqdata?: any, isFile?: boolean): Promise<any> {
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

    export var socket: any;
    var socketListeners: Map<string, any> = new Map<string, any>();

    export function SocketConnect(reconnect: boolean = true) {
        socket = io(socketURL);
        socket.on("connect", () => {
            console.log(`[socket] connect status: ${socket.connected}`);
        });

        socket.on("disconnect", () => {
            console.log(`[socket] connect status: ${socket.connected}`);
            // reconnect
            if (reconnect) {
                SocketConnect();
            }
        });

        socketListeners.forEach((action: any, key: string) => {
            socket.on(key, (args: any) => {
                action(args);
            });
        });
    }

    export function SocketSend(key: string, args: any) {
        socket.emit(key, args);
    }

    export function SocketDisconnect() {
        socket.disconnect();
    }

    export function SocketAddListener(key: string, action: any) {
        socketListeners.set(key, action);
        socket.on(key, (args: any) => {
            action(args);
        });
    }

    export function SocketClearListener() {
        socketListeners.clear();
    }

    export async function TestNakama() {
        var Nakama_client = new Client(nakamaKey, nakamaHost, nakamaPort.toString(), nakamaUseSSL);
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

}

export default Conquer; 