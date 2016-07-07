
var io = require('socket.io-client');
var commandLineArgs = require('command-line-args');
var readline = require('readline');
var MinaraiClient = require("../dist/minarai-client").MinaraiClient; 

var args = (function(){
  var args = commandLineArgs([
    { name: 'id', type: String },
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
  console.log("#### Minarai CONNECTED ####");
  var message = "";
  reader.prompt();
});

minaraiClient.on( "message", function( data ){
  if( args.showAll ){
    console.log( data );
  }else{
    console.log( data.utterance );
  }
  reader.prompt();
});

function sendToMinarai( message ){
  minaraiClient.send( message );
}

console.log("#### CONNECTING TO MINARAI ####");
console.log("#### " +  config.root + " ####" );
if( !args.showAll ){
  console.log("to show all the response from Minarai node-proxy, use '-a' option");
}
minaraiClient.init();
