/// <reference path="./typings/tsd.d.ts" />
import EventEmmitter2 = require("eventemitter2");
import {logger} from "./logger";

export interface MinaraiClientConstructorOptions{
  io: any;
  socketIORootURL: string;
  socketIOOptions: any;
  clientId: string;
  debug?: boolean;
  silent?: boolean;
}

export class MinaraiClient extends EventEmmitter2.EventEmitter2{
  private latestUtter: string;
  public socket: SocketIO.Socket;
  public clientName: string;
  public clientId: string;

  constructor( options: MinaraiClientConstructorOptions ){
    super();
    logger.set( {debug: options.debug, silent: options.silent});
    this.socket = options.io.connect( options.socketIORootURL, options.socketIOOptions );
    this.clientId =  options.clientId;
    logger.debug("new MINARAI CLIENT" );
    logger.debug(`options = JSON.stringify(options)`);
  }

  init(){
    this.socket.on('connect', ()=>{
      logger.info("connected to socket.io server");
      this.emit("connect");

      logger.debug("trying to join as Minarai Client....");
      this.socket.emit('join-as-client', { clientId: this.clientId });
    });

    this.socket.on('message', (data)=>{
      logger.debug("recieved message");
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
      logger.debug("recieved system message");
      const { type } = data;
      if( type === "joined-as-client" ){
        logger.info("joined as minarai-client");
        this.emit("joined");
      }
      this.emit('system-message', data)
    });

  }

  public send( utter ){
    // TODO プロトコルを合わせる
    const payload = {
      message: utter
    };
    logger.debug( `send : ${JSON.stringify(payload)}` );
    this.socket.emit('message', payload);
  }
}


