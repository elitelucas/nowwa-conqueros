import express from 'express';
import CONFIG from '../CONFIG/CONFIG';
import Authentication from '../DEPRECATED/Authentication';
import SocketIO from "socket.io";
import { createServer } from "http";
import LOG, { log, error } from '../../UTIL/LOG';
import SocketInstance from './SocketInstance';
import { callbackPromise } from 'nodemailer/lib/shared';

class SOCKET 
{
    public static async init( env:CONFIG.Config ):Promise<void> 
    {
        var httpServer = createServer();

        var io : SocketIO.Server = new SocketIO.Server<SOCKET.ClientToServerEvents, SOCKET.ServerToClientEvents, SOCKET.InterServerEvents, SOCKET.SocketData>(
            httpServer, { cors : { origin: "*" } }
        );

        log( "NEW SOCKET SERVER" );
 
        io.on( "connection", (socket) => 
        {
            log("[SERVER]========================================================== NEW CONNECTION");
            new SocketInstance( socket );
        });

        // todo, destroy instance
        io.on( "disconnect", (socket) => 
        {
            log( "[SERVER] Socket disconnect", socket.id );
        });
 
        io.listen( env.SOCKET_PORT );
    }
}

namespace SOCKET 
{
    export interface ServerToClientEvents 
    {
        noArg       : () => void;
        basicEmit   : (a: number, b: string, c: Buffer) => void;
        withAck     : (d: string, callback: (e: number) => void) => void;
    }
      
    export interface ClientToServerEvents 
    {
        hello : () => void;
    }
      
    export interface InterServerEvents 
    {
        ping : () => void;
    }
      
    export interface SocketData 
    {
        name    : string;
        age     : number;
    }
}

export default SOCKET;