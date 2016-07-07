
const black   = '\u001b[30m';
const red     = '\u001b[31m';
const green   = '\u001b[32m';
const yellow  = '\u001b[33m';
const blue    = '\u001b[34m';
const magenta = '\u001b[35m';
const cyan    = '\u001b[36m';
const white   = '\u001b[37m';
const reset   = '\u001b[0m';

class Logger{
  public debugMode: boolean;
  public silentMode: boolean;
  public isSetup: boolean = false; 
  public set(options: { debug: boolean, silent: boolean }){
    this.debugMode = options.debug;
    this.silentMode = (options.silent == undefined)? true: options.silent;
    this.isSetup = true;
  } 
  public debug(t:string){
    if( !this.isSetup ){ this.loggerWarning(); }
    if( !this.debugMode ){ return; }
    if( this.silentMode ){ return; }
    console.log( `${cyan}[DEBUG]${reset} ${t}` );
  }
  public info(t:string){
    if( !this.isSetup ){ this.loggerWarning(); }
    if( this.silentMode ){ return; }
    console.log( `${green}[INFO]${reset} ${t}` );
  }
  public error(t:string){
    if( !this.isSetup ){ this.loggerWarning(); }
    if( this.silentMode ){ return; }
    console.error( `${red}[ERROR]${reset} ${t}` );
  }
  public warn(t:string){
    if( !this.isSetup ){ this.loggerWarning(); }
    if( this.silentMode ){ return; }
    console.error( `${yellow}[WARN]${reset} ${t}` );
  }

  private loggerWarning(){
    console.warn(`${yellow}[WARN]${reset}logger has not been set up. call "set()" method`);
  }
}

export const logger = new Logger();
