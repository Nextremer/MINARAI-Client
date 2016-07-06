/// <reference path="./typings/tsd.d.ts" />
import EventEmmitter2 = require("eventemitter2");


export interface MinaraiClientConstructorOptions{
  io: any;
  socketIORootURL: string;
  socketIOOptions: any;
  clientId: string;
  clientName: string;
}

export class MinaraiClient extends EventEmmitter2.EventEmitter2{
  private latestUtter: string;
  public socket: SocketIO.Socket;
  public clientName: string;
  public clientId: string;

  constructor( options: MinaraiClientConstructorOptions ){
    super();
    this.socket = options.io.connect( options.socketIORootURL, options.socketIOOptions );
    this.clientId =  options.clientId;
    this.clientName = options.clientName;
  }

  init(){
    this.socket.on('connect', ()=>{
      this.emit("connect");
      this.socket.emit('join-as-client', { clientId: this.clientId });
    });

    this.socket.on('message', (data)=>{
      if( data.utterance ){
        // onUtterance;
      }
      if( data.uiCommand ){
        //onUiCommand;
      }
      if( data.slots ){
        //onSlotChanged;
      }
      // raw
      this.emit('message', data)
    });

    this.socket.on('system-message', (data)=>{
      console.log("on system-message");
      this.emit('system-message', data)
    });

  }

  public send( utter ){
    // TODO プロトコルを合わせる
    //this.socket.emit('message', {utterance: utter});
    this.socket.emit('message', {message : utter});
  }
}


