import express from 'express';
import Environment from '../CONFIG/Environment';
import Authentication from '../DEPRECATED/Authentication';
import SocketIO from "socket.io";
import { createServer } from "http";
import LOG, { log, error } from '../../UTIL/LOG';
import SocketInstance from './SocketInstance';

class SOCKET 
{
    public static async init( env:Environment.Config ):Promise<void> 
    {
        var httpServer = createServer();

        var io : SocketIO.Server = new SocketIO.Server<SOCKET.ClientToServerEvents, SOCKET.ServerToClientEvents, SOCKET.InterServerEvents, SOCKET.SocketData>(
            httpServer, { cors : { origin: "*" } }
        );

        log("SOCKET LOG");

        io.on( "connection", (socket) => 
        {
            log("NEW CONNECTION" );
           // new SocketInstance( socket );
        });


       /*     

        io.on( "connection", (socket) => 
        {
            log("SOCKET onConnection", socket.id ); 
 
            socket.on( 'request', (text:any, callback:any) => 
            {
                log(  "Server request received", text ); 

                callback("Oh Hey this worked?");
                // send echo
              //  socket.emit('fromServer', args);
              //  socket.broadcast.emit('fromServer', `[broadcast: ${socket.id}]: ${JSON.stringify(args)}`); // sender does not get the broadcast
            });
 
 
        });


        
        io.on( "connection", (socket) => 
        {
            log("SOCKET onConnection", socket.id );

            socket.emit("noArg");
            socket.emit("basicEmit", 1, "2", Buffer.from([3]));

            socket.emit("withAck", "4", (e:any) => 
            {
                log(`e: ${e}`);
            });
        
            // works when broadcast to all
            io.emit("noArg");
        
            // works when broadcasting to a room
            io.to("room1").emit("basicEmit", 1, "2", Buffer.from([3]));

            socket.on( 'fromClient', (args:any) => 
            {
                log( `[socket] [client:${socket.id}]: ${JSON.stringify(args)}`); 
                // send echo
                socket.emit('fromServer', args);
                socket.broadcast.emit('fromServer', `[broadcast: ${socket.id}]: ${JSON.stringify(args)}`); // sender does not get the broadcast
            });

            socket.on( 'login', (args:Authentication.Input) => 
            {
                Authentication.Login(args).then((user) => 
                {
                    socket.emit('fromServer', { success: true, value: user });

                }).catch((error) => 
                {
                    socket.emit('fromServer', { success: false, error: error.message || error });
                });
            });

            socket.on( 'register', (args:Authentication.Input) => 
            {
                Authentication.Register(args).then((user) => 
                {
                    socket.emit('fromServer', { success: true, value: user });

                }).catch((error) => 
                {
                    socket.emit('fromServer', { success: false, error: error.message || error });

                });
            })
        });
        */

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