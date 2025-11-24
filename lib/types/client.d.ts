declare function getAwakeness(t: any): any;
declare function getAwakeness(t: any): any;
declare function curHoursCET(): {
    h24frac: number;
    h12ampm: string;
    hhmm: string;
};
declare function curHoursCET(): {
    h24frac: number;
    h12ampm: string;
    hhmm: string;
};
declare function playPling(): void;
declare function playPling(): void;
declare function WsMatrixChat(WS_URL: any): {
    form: HTMLFormElement;
    appendMessage: (data: any, cls: any) => void;
    whenAppendMessage: (callback: any) => void;
    isAvailable: () => boolean;
    whenAvailable: (callback: any) => void;
};
declare function WsMatrixChat(WS_URL: any, cb: any): {
    form: any;
    appendMessage: (data: any, cls: any) => void;
    whenAppendMessage: (callback: any) => void;
    isAvailable: () => boolean;
    whenAvailable: (callback: any) => void;
};
declare function setupAgent(): void;
declare function setupAgent(): void;
declare const bridge_url_relative: "/chat/socket";
declare let bride_url: any;
declare var awakeness: {
    0: number;
    3: number;
    6: number;
    8: number;
    23: number;
};
declare function formatPercent(p: any): string;
declare const curAwakenessPercent: string;
declare const curLocalTimeFormatted: string;
declare namespace tpldata {
    export { curAwakenessPercent };
    export { curLocalTimeFormatted };
}
declare function notifyTitle(): void;
declare const chat: {
    form: any;
    appendMessage: (data: any, cls: any) => void;
    whenAppendMessage: (callback: any) => void;
    isAvailable: () => boolean;
    whenAvailable: (callback: any) => void;
};
