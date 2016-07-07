"use strict"
var p = console.log;
var io = require('socket.io-client');
var commandLineArgs = require('command-line-args');
var readline = require('readline');
var MinaraiClient = require("../dist/minarai-client").MinaraiClient; 

var args = (function(){
  var args = commandLineArgs([
    { name: 'id', type: String },
    { name: 'verbose', alias: 'v', type: Boolean },
    { name: 'showAll', alias: 'a', type: Boolean },
    { name: 'url', type: String },
    { name: 'basicAuth', type: String },
  ]);

  if( !args.url ){
    console.error("URL must be specified.");
    console.error("EX.) --url http://localhost:3000 ");
    process.exit(1);
  }
  return args;
})();

p("")
p("###################################")
p("##            MINARAI            ##")
p("###################################")
p("")

var config  = {
  root: args.url,
};

var ioOption = (()=>{
  if( !args.basicAuth ){ return {} };
  var b = new Buffer( args.basicAuth);
  var s = b.toString('base64');
  return {extraHeaders: { 'Authorization':'Basic ' + s }}
})();

var minaraiClient = new MinaraiClient({
  io: io,
  socketIOOptions: ioOption, //options
  socketIORootURL: config.root,
  clientId: args.id || "test" + new Date().getTime(), // any string is fine
  debug: args.verbose ,
  silent: !args.verbose, 
});


var reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
reader.setPrompt('> ');
reader.on('line', function (line) {
  sendToMinarai( line )
});
reader.on('close', function () {
  //do something
});

minaraiClient.on('connect', function(){
  p("## socket.io connected. trying to join as Minarai Client");
});
minaraiClient.on('joined', function(){
  p("## Minarai CONNECTED");
  reader.prompt();
});

minaraiClient.on( "message", function( data ){
  if( args.showAll ){
    console.log( data );
  }else{
    console.log( "BOT:" + data.utterance );
  }
  reader.prompt();
});

function sendToMinarai( message ){
  minaraiClient.send( message );
}


p("## Connecting to " +  config.root + " ..." );
if( !args.showAll ){
  p("## to show all the response from Minarai node-proxy, use '-a' option");
}
p("");
minaraiClient.init();
