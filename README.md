
# MINARAI-Client

# Messaging

## 基本仕様

```js
var MinaraiClient = require("minarai-client");
var minaraiClient = new MinaraiClient();  // 本来は引数をつけるかも

// utteranceを送信
minaraiClient.sendUtterance( {} );

// SystemEventを送信
// リロード等、サーバに対してクライアントのシステム的状態を教えるためのコマンドは
// メソッドに包んでおきたい。
minaraiClient.XXXX();

// 接続に関しては能動的なタイミングでできるように
minaraiClient.connect();

// イベントハンドリング
minaraiClient.on('connect', ()=>{
  // do something
});
```

## サーバからのイベント受信方法

これは要設計。

例えばdialog-hubからきたsocket.ioイベントを噛み砕いて、自分下記イベントを発火させるようにしておけば、
payloadからtypeをみて〜〜という部分はアプリケーション層からは隠せる。

```js
minaraiClient.on(`utterance`, (message)=>{
  // しゃべらせる
});
minaraiClient.on('uiCommand', ( command )=>{
  // コマンドに応じた処理
  // typeScript的にinterfaceを切ってあげたやつを突っ込むようにするとわかりやすいかも
  // EX: customAnimation.execute( command );  
  //     CustomeAnimation extends Animation のイメージ。
  //     classにはには各種コマンドに対するメソッドが実装されていて、それをオーバーライドして使う。
  //     親クラスのメソッドのexecuteがcommand引数を解釈して動かしてくれると面白いかも。
  //     空の実装を用意しておいてあげれば対応しない場合はそのままにしておけば良い。
  //     同様に、カスタムイベントでハンドリングしたいメソッドも用意しておけば、自由度も担保できる。
  // でも結局画像表示とかその辺の要求は出てくるんだろうな〜
});
minaraiClient.on(`slotChanged`, ( slots )=>{
  // 対話やアプリケーションで管理したい状態が常に降ってくる
  // これをlocalのstateに反映する
});

```

一方、「セリフをいい終わった後にアニメーションする」のようなことがしたい場合などの場合は、
一つのイベントが発火して、そこで処理を記述できるようにしておいたほうが良い場合もある。

```js
minaraiClient.on('message',(payload)=>{
  // payload.animationCommand があったら〜〜などの処理を入れ込む
  // １つ目の案のようなメソッド分けはアプリケーション層でお願いしてしまうという方式
  // ん〜〜、なんとなく１つ目の案がよさそうだが、アドホックにカスタマイズしたい場合に備えて
  // この口も用意することになると思う。
});
```


# How To Use

**package.json**

```
"dependencies": {
    "minarai-client": "git+ssh://github.com:app/kouchi/MINARAI-client",
}
```

then, `npm install`


# For TypeScript

copy `dist/minarai-client.d.ts` and paset to your index.d.ts.

# How To Use / API References



**TODO**
順次書いていく

```js
var minaraiClient = new MinaraiClient(
  `http://localhost:3000`, // socket.io root
  "userId" , // any string is fine
  "userName", // any string is fine
   io, // socket.io object
   ioOption //socket.io#connect options
);

minaraiClient.on('connect', function(){
  console.log("#### MINARAI CONNECTED ####");
});

minaraiClient.on( "message", function( data ){
  console.log( data.scripts[1].payload );
});


minaraiClient.send( "hello" );

```

Currently , checkout the example 'test/conversation.js'.
See [Test and try](https://github.com/Nextremer/Minarai-Client#tesy-and-try) section.



# Build

after clone this repository and at the project root,,

```
npm install
gulp tsd
gulp tsc
```

# Tesy and Try


### Talk to Minarai via command line

make sure you are at the project root directory,
and done with Build part.

```
node examples/conversation.js --url <node-proxy url> --basicAuth=id:password
ex) node examples/conversation.js --url http://localhost:3000/minarai
```

#### options

| options | description |
| --- | --- |
| `--a` | show all response from Minarai |
| `--url` | socket.io root to connect |
| `--basicAuth` | basic authentication info with "id:password" format if needed |

