import express from 'express';
import CONFIG from '../CONFIG/CONFIG';
import SocketIO from "socket.io";
import { createServer } from "http";
import LOG, { log, error } from '../../UTIL/LOG';
import SocketInstance from './SocketInstance';

class SOCKET 
{
    public static io : SocketIO.Server;

    public static async init(): Promise<void> 
    {
        var httpServer = createServer();

        this.io = new SocketIO.Server<SOCKET.ClientToServerEvents, SOCKET.ServerToClientEvents, SOCKET.InterServerEvents, SOCKET.SocketData>(
            httpServer, { cors: { origin: "*" } }
        );

        //log( "NEW SOCKET SERVER>>>" );

        this.io.on( "connection", (socket) => 
        {
            //console.log("[SERVER]========================================================== NEW CONNECTION");
            new SocketInstance(socket);
        });

        // todo, destroy instance
        this.io.on( "disconnect", (socket) => {
            // log("[SERVER] Socket disconnect", socket.id);
        });

        this.io.listen(CONFIG.vars.CORE_SOCKET_PORT);
    }
}

namespace SOCKET 
{
    export interface ServerToClientEvents 
    {
        noArg: () => void;
        basicEmit: (a: number, b: string, c: Buffer) => void;
        withAck: (d: string, callback: (e: number) => void) => void;
    }

    export interface ClientToServerEvents 
    {
        hello: () => void;
    }

    export interface InterServerEvents 
    {
        ping: () => void;
    }

    export interface SocketData 
    {
        name: string;
        age: number;
    }
}

export default SOCKET;