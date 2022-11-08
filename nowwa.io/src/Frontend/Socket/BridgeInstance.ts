import io from 'socket.io-client';
import LOG, { log } from '../../UTIL/LOG';
import PROMISE, { resolve } from '../../UTIL/PROMISE';

class BridgeInstance {
    private socketHost: string = '127.0.0.1';
    // var socketHost = 'nowwa.io';
    private socketPort: number = 9003;
    // var socketPort = 80;
    private get socketUseSSL() { return false; }
    // var socketUseSSL = true;
    private get socketProtocol(): string { return this.socketUseSSL ? 'https' : 'http'; }
    private get socketPortFinal(): string { return (this.socketPort == 80 && !this.socketUseSSL) || (this.socketPort == 443 && this.socketUseSSL) ? `` : `:${this.socketPort.toString()}`; };
    private get socketURL(): string { return `${this.socketProtocol}://${this.socketHost}${this.socketPortFinal}`; }

    private socket?: any;
    private id: any;

    public async init(): Promise<any> {
        log("client: Init New Socket Client");
        await this.connect(true);

        return Promise.resolve();
    }

    private async connect(isFirstTime?: boolean) {
        log("client: Socket Connect");

        this.socket = io(this.socketURL);

        this.socket.on("connect", () => {
            this.id = this.socket.id;

            log("client: ============ Socket connected", this.id);
            if (isFirstTime) resolve();
        });

        this.socket.on("disconnect", () => {
            console.log(`client: connect status: ${this.socket.connected}`);
            this.connect();
        });

    }

    public async do(action: string, vars?: any, callback?: Function): Promise<any> {
        log("client: Calling action", action);

        this.socket.emit("action", action, vars, function (e: any) {
            resolve(e);
        });
    }

    public disconnect() {
        this.socket.disconnect();
    }

};

export default BridgeInstance;