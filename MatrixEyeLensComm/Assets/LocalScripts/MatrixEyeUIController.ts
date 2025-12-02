import {Interactable} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import {PinchButton} from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton"
import {ToggleButton} from "SpectaclesInteractionKit.lspkg/Components/UI/ToggleButton/ToggleButton"
import {ContainerFrame} from "SpectaclesInteractionKit.lspkg/Components/UI/ContainerFrame/ContainerFrame"
import {MatrixEyeLib} from "./libmatrix-ws-bridge/MatrixEyeLib";
import type {MessageEvents} from "./libmatrix-ws-bridge/MatrixEyeLib";
import type TypedEmitter from './typed-emitter/TypedEmitter';


// import {chat} from "./libmatrix-ws-bridge/matrixeyelensclient.d.ts"
export enum LoginStatusCode {
    Success = 0x00, 
    NotLoggedIn = 0x10,
    AuthenticationFailure  = 0x11,
    UnspecifiedError = 0x80
}

export enum ConnectionStatusCode {
    Connected = 0x00, 
    NotConnected = 0x10,
    ConnectionFailure  = 0x11,
    NetworkTimeoutFailure  = 0x12,
    AuthenticationFailure  = 0x13,
    UnspecifiedError = 0x80
}

@component
export class MatrixEyeUIController extends BaseScriptComponent {
    @input
    connectToggleCapsule!: ToggleButton
    @input
    sendToggleCapsule!: PinchButton
    @input
    clearToggleCapsule!: PinchButton
    @input
    chatPanel: ContainerFrame
    @input
    connStatusText: Text
    @input
    connStats: Text

    private timeoutInterval: DelayedCallbackEvent | null = null
    private configPasswordRequiredLength = 3;
    private loginStatus = LoginStatusCode.NotLoggedIn;
    private connectionStatus = ConnectionStatusCode.NotConnected;


    // TODO: set these values via UI or TUI
    private matrixeyeclient = new MatrixEyeLib({
        timeout: 10000,
        initialReconnectDelay: 1000, // 1 sec
        maxReconnectDelay: 32000, // 32 sec
        uri: "ws://10.0.0.228:18081"
    }, this);
    // TODO: implement a session model
    
    onAwake() {
        print("onAwake()");
        
        this.createEvent("OnStartEvent").bind(() => {
            this.onStart()
        })

        // TODO refactor
        this.timeoutInterval = this.createEvent("DelayedCallbackEvent");
        const somecb = (): void => {
            print("password mask timeout CB complete");
        };
        this.timeoutInterval.bind(somecb);
        
        //
        // set up network related event listeners
        // Use this approach to easily update the UI without
        // having to have UI things handled by the protocol
        // library.  We also don't want to expose the websocket
        // at the Lens App UI layer
        // this.matrixeyeclient.on('reconnecting', this.handleConnectingEvent);
        this.matrixeyeclient.on('reconnecting', (data) => {
            globalThis.textLogger.log(`Event triggered! Received data: ${data}`);
            this.setConnStatus("Connecting");
        });
        this.matrixeyeclient.on('reconnected', (data) =>{
            globalThis.textLogger.log(`Event triggered! Received data: ${data}`);  // Use Lens Studio's print() for logging
            // Add your Spectacles-specific logic here, e.g., update a material or trigger AR effects
            this.connStatusText.text = "Connected";
        });
        this.matrixeyeclient.on('disconnected', (data) => {
            globalThis.textLogger.log(`Event triggered! Received data: ${data}`);  // Use Lens Studio's print() for logging
            // Add your Spectacles-specific logic here, e.g., update a material or trigger AR effects
            this.connStatusText.text = "Disconnected";
        });
        this.matrixeyeclient.on('ondata', (data) => {
            globalThis.textLogger.log(`Event triggered! Received data: ${data}`);  // Use Lens Studio's print() for logging
            // Add your Spectacles-specific logic here, e.g., update a material or trigger AR effects
        });
        this.matrixeyeclient.on('connectionerror', (data) => {
            globalThis.textLogger.log(`Event triggered! Received data: ${data}`);  // Use Lens Studio's print() for logging
            // Add your Spectacles-specific logic here, e.g., update a material or trigger AR effects
            this.connStatusText.text = "Connection Error: " + data;
        });
        // this.connStatusText.text = "foobar";
        // this.setConnStatus("foobar");
    }

    onStart() {
        // TODO: Refactor into a better handler
        // https://developers.snap.com/lens-studio/api/lens-scripting/classes/Packages_SpectaclesInteractionKit_Components_UI_PinchButton_PinchButton.PinchButton.html#onbuttonpinched
        this.connectToggleCapsule.onStateChanged.add(
            () => {
                if (this.connectToggleCapsule.isToggledOn) {
                    globalThis.textLogger.log("connectToggleCapsule ON");
                    this.matrixeyeclient.connect();
                } else {
                    globalThis.textLogger.log("connectToggleCapsule OFF");
                }
                
            },
        );
        this.clearToggleCapsule.onButtonPinched.add(
            () => {
                globalThis.textLogger.log("clearToggleCapsule");  
            },
        );
        this.sendToggleCapsule.onButtonPinched.add(
            () => {
                globalThis.textLogger.log("sendToggleCapsule");  
            },
        );

       
    }

    //
    // Network Comms
    //

    //
    // event handlers
    // These don't work
    handleOnDataEvent(data: JSON) {
        globalThis.textLogger.log(`Event triggered! Received data: ${data}`);  // Use Lens Studio's print() for logging
        // Add your Spectacles-specific logic here, e.g., update a material or trigger AR effects
    }

    handleConnectingEvent(data: string, thiz: BaseScriptComponent) {
        print(`Event triggered! Received data: ${data}`);  // Use Lens Studio's print() for logging
        // Add your Spectacles-specific logic here, e.g., update a material or trigger AR effects
        // this.connStatusText.text = "Connecting";
        
        // thiz.setConnStatus("Connecting");
    }

    handleConnectedEvent(data: string) {
        print(data);
        globalThis.textLogger.log(`Event triggered! Received data: ${data}`);  // Use Lens Studio's print() for logging
        // Add your Spectacles-specific logic here, e.g., update a material or trigger AR effects
        this.connStatusText.text = "Connected";
    }

    handleDisconnectedEvent(data: string) {
        globalThis.textLogger.log(`Event triggered! Received data: ${data}`);  // Use Lens Studio's print() for logging
        // Add your Spectacles-specific logic here, e.g., update a material or trigger AR effects
        this.connStatusText.text = "Disconnected";
    }

    handleConnectionErrorEvent(data: string) {
        globalThis.textLogger.log(`Event triggered! Received data: ${data}`);  // Use Lens Studio's print() for logging
        // Add your Spectacles-specific logic here, e.g., update a material or trigger AR effects
        this.connStatusText.text = "Connection Error: " + data;
    }

    //
    // Accessors
    //
    setConnStatus(text: string) {
        this.connStatusText.text = text;
    }

    
}
