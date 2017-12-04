## electron-tunnel

### Usage
* `npm i electron-tunnel`

* create events

```javascript
//params: passed by callEvent; [app, win]: passed by registEvent;
function setFullScreen(params, app, win) {
  return win.setFullScreen(true);
}

//should return Promise when doing async things
function asyncEvent(params, app, win) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(params.word);
      resolve();
    }, 3000);
  });
}

module.exports = {
  'SET_FULL_SCREEN': setFullScreen,
  'ASYNC_EVENT': asyncEvent
};
```

* regist events in main progress

```javascript
const electron = require('electron');
const { app, BrowserWindow } = electron;
const events = require('./events/index.js');

const {registEvents} = require('electron-tunnel');

app.on('ready', () => {
  const win = new BrowserWindow();

  //监听web对原生事件的调用
  registEvents(events, [app, win]);

  win.loadURL(`file://${__dirname}/index.html`);

  win.webContents.openDevTools();

  win.on('closed', function() {
    win = null;
    app.quit();
  });
});

```

* call event in render progress

```javascript
const {callEvent} = require('electron-tunnel');
var $setFullScreenBtn = document.querySelector('.set-full-screen');
var $print = document.querySelector('.print');

$setFullScreenBtn.addEventListener('click', function() {
  callEvent('SET_FULL_SCREEN');
});

$print.addEventListener('click', function() {
  callEvent('ASYNC_EVENT', {word: 'hello world'}).then(() => {
    console.log('done');
  });
});
```



### API

#### `registEvents(events: Object, cusParams: Array)`

* `event`s: events object, key is the name called by  callEvent, value is the function

* `cusParams`: will be spreaded and pass to event function

#### `callEvent(eventName: String, params: Object)`

* `eventName`: the key of the events object

* `params`: will be passed to event function as the first parameter

* return Promise
