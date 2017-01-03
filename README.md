
# MINARAI-Client

A SDK that enables you to connect `MINARAI-Dialogue-Hub` easily on Node.js, browser both.
**on browser** , you need to use `webpack` or `browserify` to use 'common.js' style module.

* information about webpack/browserify -> http://qiita.com/megane42/items/2ab6ffd866c3f2fda066
* if you want to use onother platform or language, use this client module as a references of specification.**

# install & usage

## node.js( common.js module )

#### install

on your project root 

```
npm install Nextremer/MINARAI-Client --save
```

#### usage

```js
var MinaraiClient = require("minarai-client");
var io = require("socket.io-client");

var minaraiClient = new MinaraiClient({
  io: io,                                             // Socket.io object
  lang: "ja",                                       // ex: ja,en
  socketIORootURL: "http://",                       // ex: http://localhost:3000/minarai
  socketIOOptions: {},                          // options for io.connect method
  clientId: "clientID001", // any string is fine
});
minaraiClient.init();

// binding events
minaraiClient.on('connect', function(){
  console.log("## socket.io connected. trying to join as Minarai Client");
});
minaraiClient.on('joined', function(){
  console.log("## Minarai CONNECTED");
});
minaraiClient.on( "message", function( data ){
  console.log("recieve message");
  console.log(data)
});
minaraiClient.on( "error", function( err ){
  console.log("minarai client error");
  console.log(err);
});

// send message "hello" to dialogue-hub every 3 seconds
setInterval( function(){
  minaraiClient.send("hello");
}, 3000 );

```

# references

### constructor options

* **io**: socket.io object
* **lang**: language option( default: "ja" )
* **socketIORootURL**:  root url of dialogue-hub  (ex) http://localhost:3000/minarai
* **socketIOOptions**: options for io.connect method (ex) {}
* **clientId: string**: clientId (ex) "clientId001"                  
* **debug** : set true to show debug logs
* **slient** : set true value to hide all the logs

### methods

* **send** : send message to dialogue-hub
    * options
        * lang : string : language option. ex: "ja", "en"
            * if not passed, constructor options language will be taken.
        * extra: any : you can pass extra info to dialogue-hub

```js
// send "hello" to dialogue-hub
cli.send("hello", options);
```


* **sendSystemCommand** : send system command to dialogue-hub

```js
const command = "happyEmotionDetected";
cli.sendSystemCommand(  command ,  { value: true });
```

### event

* **connect** : when connected to dialogue-hub.
* **disconnect** : when disconnected to dialogue-hub.
* **joined** : when successfully signed in as Minarai-Client.
* **message** : when dialogue-hub send any event
    * payload:
```js
cli.on("message", (data)=>{
  console.log(data);
  // => { 
  //      utterance: 'こんばんは。受付を担当していますミーナです。ご用件をお伺いいたします。',
  //      uiCommand: 'ojigi',
  //      systemCommand: {},
  //      serializedContext: {},
  //    }
});

```

* **error** : emitted when something went wrong on dialogue-hub.
* **utterance** : not supported yet. use "message" event for now.
* **uiCommand** : not supported yet. use "message" event for now.
* **systemCommand** : not supported. yet use "message" event for now.
* **contextChanged** : not supported. yet use "message" event for now.


# For Developpers

after clone this repository and at the project root,,

```
npm install
gulp tsd
gulp tsc
```

