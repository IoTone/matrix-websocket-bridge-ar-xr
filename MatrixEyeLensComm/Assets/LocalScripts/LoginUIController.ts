import {Interactable} from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import {PinchButton} from "SpectaclesInteractionKit.lspkg/Components/UI/PinchButton/PinchButton"
import {ContainerFrame} from "SpectaclesInteractionKit.lspkg/Components/UI/ContainerFrame/ContainerFrame"

export enum LoginStatusCode {
    Success = 0x00, 
    NotLoggedIn = 0x10,
    AuthenticationFailure  = 0x11,
    UnspecifiedError = 0x80
}

@component
export class NewScript extends BaseScriptComponent {
    @input
    oneButtonCapsule!: PinchButton
    @input
    twoButtonCapsule!: PinchButton
    @input
    threeButtonCapsule!: PinchButton
    @input
    fourButtonCapsule!: PinchButton
    @input
    fiveButtonCapsule!: PinchButton
    @input
    sixButtonCapsule!: PinchButton
    @input
    sevenButtonCapsule!: PinchButton
    @input
    eightButtonCapsule!: PinchButton
    @input
    nineButtonCapsule!: PinchButton
    @input
    zeroButtonCapsule!: PinchButton
    @input
    clearButtonCapsule!: PinchButton
    @input
    backspcButtonCapsule!: PinchButton
    @input
    passwordTextHidden!: Text;
    @input
    loginPanel: ContainerFrame;
    private passwordData : Array<Number> = [];
    private timeoutInterval: DelayedCallbackEvent | null = null
    private configPasswordRequiredLength = 3;
    private loginStatus = LoginStatusCode.NotLoggedIn;
    // TODO: implement a session model
    
    onAwake() {
        print("onAwake()");
        
        this.createEvent("OnStartEvent").bind(() => {
            this.onStart()
        })

        // TODO refactor
        this.timeoutInterval = this.createEvent("DelayedCallbackEvent");
        const passwordmaskcb = (): void => {
            print("password mask timeout CB complete");
            let passwordmasked = "";
            let idx = 0;
            this.passwordData.forEach((value: Number) => {
                passwordmasked = passwordmasked + "*";
                idx++;
            });
            this.passwordTextHidden.text = passwordmasked;
        };
        this.timeoutInterval.bind(passwordmaskcb);
    }

    onStart() {
        // TODO: Refactor into a better handler
        // https://developers.snap.com/lens-studio/api/lens-scripting/classes/Packages_SpectaclesInteractionKit_Components_UI_PinchButton_PinchButton.PinchButton.html#onbuttonpinched
        this.oneButtonCapsule.onButtonPinched.add(
            () => {
                // Set the index for the next left config
                // These first two are special cases
                // global.textLogger.log("");
                print("1-password: ");
                print(this.passwordData);
                this.passwordData.push(1);
                let passwordmasked = "";
                let idx = 0;
                this.passwordData.forEach((value: Number) => {
                    print("show 1 on screen");
                    if (idx == this.passwordData.length-1) {
                        passwordmasked = passwordmasked + String(value);
                    } else {
                        passwordmasked = passwordmasked + "*";
                    }
                    idx++;
                });
                this.passwordTextHidden.text = passwordmasked;
                this.timeoutInterval.reset(1 /*sec*/);
                if (this.passwordData.length == this.configPasswordRequiredLength) {
                    this.checkPassword();
                }
            },
        );
        this.twoButtonCapsule.onButtonPinched.add(
            () => {
                // Set the index for the next left config
                // These first two are special cases
                // global.textLogger.log("");
                print("2-password: ");
                print(this.passwordData);
                this.passwordData.push(2);
                let passwordmasked = "";
                let idx = 0;
                this.passwordData.forEach((value: Number) => {
                    
                    if (idx == this.passwordData.length-1) {
                        passwordmasked = passwordmasked + String(value);
                    } else {
                        passwordmasked = passwordmasked + "*";
                    }
                    idx++;
                });
                this.passwordTextHidden.text = passwordmasked;
                this.timeoutInterval.reset(1 /*sec*/);
                if (this.passwordData.length == this.configPasswordRequiredLength) {
                    this.checkPassword();
                }
            },
        );
        this.threeButtonCapsule.onButtonPinched.add(
            () => {
                // Set the index for the next left config
                // These first two are special cases
                // global.textLogger.log("");
                print("3-password: ");
                print(this.passwordData);
                this.passwordData.push(3);
                let passwordmasked = "";
                let idx = 0;
                this.passwordData.forEach((value: Number) => {
            
                    if (idx == this.passwordData.length-1) {
                        passwordmasked = passwordmasked + String(value);
                    } else {
                        passwordmasked = passwordmasked + "*";
                    }
                    idx++;
                });
                this.passwordTextHidden.text = passwordmasked;
                this.timeoutInterval.reset(1 /*sec*/);
                if (this.passwordData.length == this.configPasswordRequiredLength) {
                    this.checkPassword();
                }
            },
        );
        this.fourButtonCapsule.onButtonPinched.add(
            () => {
                // Set the index for the next left config
                // These first two are special cases
                // global.textLogger.log("");
                print("3-password: ");
                print(this.passwordData);
                this.passwordData.push(4);
                let passwordmasked = "";
                let idx = 0;
                this.passwordData.forEach((value: Number) => {
            
                    if (idx == this.passwordData.length-1) {
                        passwordmasked = passwordmasked + String(value);
                    } else {
                        passwordmasked = passwordmasked + "*";
                    }
                    idx++;
                });
                this.passwordTextHidden.text = passwordmasked;
                this.timeoutInterval.reset(1 /*sec*/);
                if (this.passwordData.length == this.configPasswordRequiredLength) {
                    this.checkPassword();
                }
            },
        );
        this.fiveButtonCapsule.onButtonPinched.add(
            () => {
                // Set the index for the next left config
                // These first two are special cases
                // global.textLogger.log("");
                print("5-password: ");
                print(this.passwordData);
                this.passwordData.push(5);
                let passwordmasked = "";
                let idx = 0;
                this.passwordData.forEach((value: Number) => {
            
                    if (idx == this.passwordData.length-1) {
                        passwordmasked = passwordmasked + String(value);
                    } else {
                        passwordmasked = passwordmasked + "*";
                    }
                    idx++;
                });
                this.passwordTextHidden.text = passwordmasked;
                this.timeoutInterval.reset(1 /*sec*/);
                if (this.passwordData.length == this.configPasswordRequiredLength) {
                    this.checkPassword();
                }
            },
        );
        this.sixButtonCapsule.onButtonPinched.add(
            () => {
                // Set the index for the next left config
                // These first two are special cases
                // global.textLogger.log("");
                print("6-password: ");
                print(this.passwordData);
                this.passwordData.push(6);
                let passwordmasked = "";
                let idx = 0;
                this.passwordData.forEach((value: Number) => {
            
                    if (idx == this.passwordData.length-1) {
                        passwordmasked = passwordmasked + String(value);
                    } else {
                        passwordmasked = passwordmasked + "*";
                    }
                    idx++;
                });
                this.passwordTextHidden.text = passwordmasked;
                this.timeoutInterval.reset(1 /*sec*/);
                if (this.passwordData.length == this.configPasswordRequiredLength) {
                    this.checkPassword();
                }
            },
        );
        this.sevenButtonCapsule.onButtonPinched.add(
            () => {
                // Set the index for the next left config
                // These first two are special cases
                // global.textLogger.log("");
                print("7-password: ");
                print(this.passwordData);
                this.passwordData.push(7);
                let passwordmasked = "";
                let idx = 0;
                this.passwordData.forEach((value: Number) => {
            
                    if (idx == this.passwordData.length-1) {
                        passwordmasked = passwordmasked + String(value);
                    } else {
                        passwordmasked = passwordmasked + "*";
                    }
                    idx++;
                });
                this.passwordTextHidden.text = passwordmasked;
                this.timeoutInterval.reset(1 /*sec*/);
                if (this.passwordData.length == this.configPasswordRequiredLength) {
                    this.checkPassword();
                }
            },
        );
        this.eightButtonCapsule.onButtonPinched.add(
            () => {
                // Set the index for the next left config
                // These first two are special cases
                // global.textLogger.log("");
                print("8-password: ");
                print(this.passwordData);
                this.passwordData.push(8);
                let passwordmasked = "";
                let idx = 0;
                this.passwordData.forEach((value: Number) => {
            
                    if (idx == this.passwordData.length-1) {
                        passwordmasked = passwordmasked + String(value);
                    } else {
                        passwordmasked = passwordmasked + "*";
                    }
                    idx++;
                });
                this.passwordTextHidden.text = passwordmasked;
                this.timeoutInterval.reset(1 /*sec*/);
                if (this.passwordData.length == this.configPasswordRequiredLength) {
                    this.checkPassword();
                }
            },
        );
        this.nineButtonCapsule.onButtonPinched.add(
            () => {
                // Set the index for the next left config
                // These first two are special cases
                // global.textLogger.log("");
                print("9-password: ");
                print(this.passwordData);
                this.passwordData.push(9);
                let passwordmasked = "";
                let idx = 0;
                this.passwordData.forEach((value: Number) => {
            
                    if (idx == this.passwordData.length-1) {
                        passwordmasked = passwordmasked + String(value);
                    } else {
                        passwordmasked = passwordmasked + "*";
                    }
                    idx++;
                });
                this.passwordTextHidden.text = passwordmasked;
                this.timeoutInterval.reset(1 /*sec*/);
                if (this.passwordData.length == this.configPasswordRequiredLength) {
                    this.checkPassword();
                }
            },
        );
        this.zeroButtonCapsule.onButtonPinched.add(
            () => {
                // Set the index for the next left config
                // These first two are special cases
                // global.textLogger.log("");
                print("0-password: ");
                print(this.passwordData);
                this.passwordData.push(0);
                let passwordmasked = "";
                let idx = 0;
                this.passwordData.forEach((value: Number) => {
            
                    if (idx == this.passwordData.length-1) {
                        passwordmasked = passwordmasked + String(value);
                    } else {
                        passwordmasked = passwordmasked + "*";
                    }
                    idx++;
                });
                this.passwordTextHidden.text = passwordmasked;
                this.timeoutInterval.reset(1 /*sec*/);
                if (this.passwordData.length == this.configPasswordRequiredLength) {
                    this.checkPassword();
                }
            },
        );
        this.backspcButtonCapsule.onButtonPinched.add(
            () => {
                // Set the index for the next left config
                // These first two are special cases
                // global.textLogger.log("");
                print("backspace-password: ");
                
                this.passwordData.pop();
                print(this.passwordData);
                let passwordmasked = "";
                let idx = 0;
                this.passwordData.forEach((value: Number) => {
            
                    passwordmasked = passwordmasked + "*";
                    
                    idx++;
                });
                this.passwordTextHidden.text = passwordmasked;
                
            },
        );
        this.clearButtonCapsule.onButtonPinched.add(
            () => {
                // Set the index for the next left config
                // These first two are special cases
                // global.textLogger.log("");
                print("clear-password: ");
                print(this.passwordData);
                this.passwordData.length = 0;
                
                this.passwordTextHidden.text = "";
                
            },
        );
    }

    //
    // Accessors
    //
    getLoginStatus = (): LoginStatusCode => {
        return this.loginStatus;
    }

    //
    // Private
    //
    private checkPassword = (): void => {
        // Password is hardcoded
        // XXX Refactor
        // password should load from DB or validate in 
        // backend
        let localPassword= [1,2,3];
        if (this.passwordData.length === localPassword.length && this.passwordData.every((value, index) => value === localPassword[index])) {
            print("Passwords match");
            globalThis.textLogger.log("Passwords match");
            this.loginStatus = LoginStatusCode.Success;
            this.loginPanel.getSceneObject().enabled = false;
        } else {
            globalThis.textLogger.log("Passwords do not match");
            this.passwordTextHidden.text = "Incorrect PIN";
            this.loginStatus = LoginStatusCode.AuthenticationFailure;
        }
    }
}
