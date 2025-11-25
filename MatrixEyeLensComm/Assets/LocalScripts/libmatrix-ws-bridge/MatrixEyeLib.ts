import {EventEmitter} from "../utils/EventEmitter";
import type TypedEmitter from '../typed-emitter/TypedEmitter';
import type { Options } from './types/Options';
import {Interval} from "../utils/Intervals";

const defaultOpts = {
    timeout: 2000,
    initialReconnectDelay: 1000, // 1 sec
    maxReconnectDelay: 32000, // 32 sec
    uri: "ws://localhost:18080"
};

export interface MessageEvents {
    'disconnected': (err: string, errCode: number) => void
    'reconnecting': (status: string) => void
    'reconnected': (status: string) => void
    'ondata': (data: JSON) => void
    'connectionerror': (err: string, errCode: number) => void
}


/**
 * MQTT Client object
 */
// PORTING
export class MatrixEyeLib extends (EventEmitter as new () => TypedEmitter<MessageEvents>) {
    private uri: string;
    private scriptComp?: BaseScriptComponent;
    private reconnectTimer?: Interval;
    private opts: Partial<Options> = defaultOpts; // {};
    private internetModule: InternetModule = require("LensStudio:InternetModule");
    private webSocket?: WebSocket;
    private connected: boolean;
    private reconnecting: boolean = false;

    /**
     * constructor
     * @param url MQTT broker where the client should attempt a connection
     */
    constructor(options: Partial<Options> = {}, sceneObj: BaseScriptComponent) {
        super();
        this.scriptComp = sceneObj;
        this.opts = options;
        this.reconnectTimer = new Interval(this.scriptComp);
        this.connected = false;
    }

    connect() {
        this.emit('reconnecting', 'starting reconnect');
        /*
        this.doConnect(this.opts.timeout)
            .then((result: MQTTConnAck) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        */
    }


    /*
    private doConnect(timeout: number): Promise<MQTTConnAck> {
        return new Promise((resolve, reject) => {
            this.webSocket = this.internetModule.createWebSocket(this.uri);
            // XXX Need to convert handling of arraybuffer to blob            
            this.webSocket.binaryType = 'blob';

            // this.webSocket.onclose = (event: CloseEvent) => {
            this.webSocket.onclose = (event) => {
                let e: Error;
                e = new Error('Websocket closed normally we think');
                print("protocolhandler WebSocket.onclose");
                // Do we need this?
                // this.internalDisconnect(e);
            };

            // PORTING
            // this.webSocket.onerror = (error: Event) => {
            this.webSocket.onerror = (event: WebSocketEvent) => {
                print("protocolhandler WebSocket.onerror");                
                // this.connectingPromise?.reject(error);
                this.connectingPromise?.reject(new Error("WebSocket error for unknown reason"));
                this.connected = false;
            };

            // PORTING
            // this.webSocket.onmessage = (evt: MessageEvent) => {
            this.webSocket.onmessage = async (evt: WebSocketMessageEvent) => {
                print("protocolhandler WebSocket.onmessage");
                if (evt.data instanceof Blob) {
                    // Binary frame, can be retrieved as either Uint8Array or string
                    const bytes = await evt.data.bytes();
                    // const text = await evt.data.text();
                    this.messageReceived(bytes);
                }
            };

            this.webSocket.onopen = () => {
                print("protocohandler WebSocket.onopen");
                this.protocolConnect();
            };

            this.connectingPromise = new Deferred<MQTTConnAck>();

            // PORTING
            const timer = new Interval(this.scriptComp);
            timer.setTimeoutInSec(() => {
                this.disconnect({ reasonCode: MQTTDisconnectReason.Code.UnspecifiedError });
            }, timeout);

            this.connectingPromise?.getPromise()
                .then((connack: MQTTConnAck) => {
                    // PORTING
                    // clearTimeout(timer);
                    timer.cancelInterval();
                    resolve(connack);
                    this.connected = true;
                    if (connack.properties && connack.properties.serverKeepAlive) {
                        this.pinger = new Pinger(connack.properties.serverKeepAlive, this, this.scriptComp);
                    }
                    else {
                        this.pinger = new Pinger(this.connectParams ? this.connectParams.keepAlive : 0, this, this.scriptComp);
                    }

                    if (connack.properties && connack.properties.receiveMaximum) {
                        this.sendQoS12Quota = connack.properties.receiveMaximum;
                    }

                }).catch(
                    (err) => {
                        // PORTING
                        // clearTimeout(timer);
                        timer.cancelInterval();
                        reject(err);
                    }
                );
        });
    }
    */




    

}