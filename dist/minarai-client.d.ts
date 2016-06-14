/**
 * HrimeSocket
 */
declare module "hrime-socket" {
  export class HrimeSocket{
    constructor(socketRoot:string, userId:string, userName:string, socketio: any);
    send: Function;
    init: Function;
    on: (a: string, callback: Function) => void;
  }
  export interface HrimeChatResponse{
    balloon: string;        // "Any"
    face: string;           // "Any"
    frame_type: string;     // "Any"
    level: string;          // "Any"
    type: string;           // "msg"
    value: string;          // "そんなこと言いなや！"
  }
}
