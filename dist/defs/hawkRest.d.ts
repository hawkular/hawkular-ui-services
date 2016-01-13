/// <reference path="../../lib/hawtio-core-dts/angular.d.ts" />
declare module hawkularRest {
    var _module: ng.IModule;
    interface IWebSocketHandler {
        onmessage?(json: any): void;
        onopen?(event: any): void;
        onclose?(event: any): void;
        onerror?(event: any): void;
    }
}
