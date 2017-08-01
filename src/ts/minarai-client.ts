/// <reference path="./typings/tsd.d.ts" />
import EventEmmitter2 = require("eventemitter2");
import {logger} from "./logger";

export interface MinaraiClientConstructorOptions{
  io: any;
  lang: string;
  socketIORootURL: string;
  socketIOOptions: any;
  clientId: string;
  debug?: boolean;
  silent?: boolean;
}


export interface SendOptions{
  lang?: string;
  extra?: any;
}

export class MinaraiClient extends EventEmmitter2.EventEmitter2{
  private latestUtter: string;
  private socketIORootURL: string;
  private socketIOOptions: any;
  private io: any;
  public socket: SocketIO.Socket;
  public clientName: string;
  public clientId: string;
  public lang: string;


  constructor( options: MinaraiClientConstructorOptions ){
    super();
    logger.set( {debug: options.debug, silent: options.silent});

    this.io = options.io;
    this.clientId =  options.clientId;
    this.socketIORootURL = options.socketIORootURL;
    this.socketIOOptions = options.socketIOOptions;
    this.lang = options.lang || 'ja';
    logger.debug("new MINARAI CLIENT" );
    logger.debug(`options = JSON.stringify(options)`);
  }

  init( initOptions: any = {} ){
    this.socket = this.io.connect( this.socketIORootURL, this.socketIOOptions );
    this.socket.on('connect', ()=>{
      logger.info("connected to socket.io server");
      this.emit("connect");

      logger.debug("trying to join as Minarai Client....");
      this.socket.emit('join-as-client', { clientId: this.clientId, extra: initOptions.joinOptions },(res:any)=>{
        this.emit('join-failed' , res);
      });
    });

    this.socket.on('minarai-error', (e)=>{
      logger.error( `error on MinaraiClient : ${JSON.stringify(e)}` );
      this.emit('error', e );
    });

    this.socket.on('message', (rcvData)=>{
      logger.debug("recieved message");
      const recievedData = backwardCompatibilitySupport( rcvData );
      // raw
      this.emit('message', this.convertResponsePayload( recievedData ));
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

    this.socket.on('disconnect', () => {
      logger.info('disconnect to socket.io server');
      this.emit('disconnect');
    });
  }

  public convertResponsePayload( recievedData  ){
    return recievedData;
  }

  public convertRequestPayload( requestPayload ){
    return requestPayload;
  }

  public send( utter , options?: SendOptions ){
    options = options || {};
    const timestamp = new Date().getTime();
    const payload = {
      id: `${this.clientId}-${timestamp}`,
      head:{
        clientId: this.clientId,
        timestampUnixTime: timestamp,
        lang: options.lang || this.lang || 'ja',
      },
      body:{
        message: utter,
        extra: options.extra,
      }
    };
    logger.debug( `send : ${JSON.stringify(payload)}` );
    this.socket.emit('message', this.convertRequestPayload( payload ));
  }

  public sendSystemCommand( command, payload ) {
    const message = { command, payload };
    logger.debug( `send system command : command="${command}", payload="${JSON.stringify(payload)}"` );
    this.socket.emit('system-command', { message } );
  }
}

function backwardCompatibilitySupport( data ){
  // backwardCompatibility
  if( data.head && data.body ){
    return data;
  }else{
    logger.warn(`Minarai server seems to be older than v0.1.0. The response is corrected to new format. This backward compatibility support might not be done in the future. \ngiven data=${JSON.stringify(data)}`);
    return {
      head: {
        serializedContext: data.serializedContext
      },
      body: data,
    };
  }
}
