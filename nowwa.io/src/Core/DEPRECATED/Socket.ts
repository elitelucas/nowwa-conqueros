import express from 'express';
import Environment from '../Environment';
import Authentication from '../Authentication';
import SocketIO from "socket.io";
import { createServer } from "http";

class Socket {

    private static Instance: Socket;

    /**
     * Initialize socket feature.
     */
    public static async AsyncInit(app: express.Express, env: Environment.Config): Promise<void> {

        var httpServer = createServer();
        var io: SocketIO.Server = new SocketIO.Server<Socket.ClientToServerEvents, Socket.ServerToClientEvents, Socket.InterServerEvents, Socket.SocketData>(
            httpServer,
            {
                cors: {
                    origin: "*"
                }
            }
        );

        io.on("connection", (socket) => {
            socket.emit("noArg");
            socket.emit("basicEmit", 1, "2", Buffer.from([3]));
            socket.emit("withAck", "4", (e: any) => {
                // e is inferred as number
                console.log(`e: ${e}`);
            });

            // works when broadcast to all
            io.emit("noArg");

            // works when broadcasting to a room
            io.to("room1").emit("basicEmit", 1, "2", Buffer.from([3]));

            socket.on('fromClient', (args: any) => {
                console.log(`[socket] [client:${socket.id}]: ${JSON.stringify(args)}`);
                // send echo
                socket.emit('fromServer', args);
                socket.broadcast.emit('fromServer', `[broadcast: ${socket.id}]: ${JSON.stringify(args)}`); // sender does not get the broadcast
            });

            socket.on('login', (args: Authentication.Input) => {
                Authentication.Login(args)
                    .then((user) => {
                        socket.emit('fromServer', { success: true, value: user });
                    })
                    .catch((error) => {
                        socket.emit('fromServer', { success: false, error: error.message || error });
                    });
            });

            socket.on('register', (args: Authentication.Input) => {
                Authentication.Register(args)
                    .then((user) => {
                        socket.emit('fromServer', { success: true, value: user });
                    })
                    .catch((error) => {
                        socket.emit('fromServer', { success: false, error: error.message || error });
                    });
            })

        });

        io.listen(env.SOCKET_PORT);
    }
}

namespace Socket {
    export interface ServerToClientEvents {
        noArg: () => void;
        basicEmit: (a: number, b: string, c: Buffer) => void;
        withAck: (d: string, callback: (e: number) => void) => void;
    }

    export interface ClientToServerEvents {
        hello: () => void;
    }

    export interface InterServerEvents {
        ping: () => void;
    }

    export interface SocketData {
        name: string;
        age: number;
    }
}

export default Socket;