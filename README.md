## electron-tunnel

You don't need to distinguish main process & renderer process any more.<br>

After regist event in main process, you can call registed event in render process.

### Usage

- `npm i electron-tunnel`

- create events `events/index.js`

```javascript
//params: passed by callEvent; [app, win]: passed by registEvent;
function setFullScreen(params, app, win) {
  return win.setFullScreen(true)
}

//should return Promise when doing async things
function asyncEvent(params, app, win) {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(params.word)
      resolve()
    }, 3000)
  })
}

module.exports = {
  SET_FULL_SCREEN: setFullScreen,
  ASYNC_EVENT: asyncEvent
}
```

- regist events in main process

```javascript
const { app, BrowserWindow } = require('electron')
const path = require('path')
const events = require('./events/index.js')

app.on('ready', () => {
  const win = new BrowserWindow()

  // regist event
  const { registEvents } = require('../../lib/index.js')
  registEvents(events, [app, win])

  win.loadURL(`file://${__dirname}/index.html`)

  win.webContents.openDevTools()

  win.on('closed', function() {
    win = null
    app.quit()
  })
})
```

- call event in renderer process

```javascript
const { callEvent } = require('electron-tunnel')
var $setFullScreenBtn = document.querySelector('.set-full-screen')
var $print = document.querySelector('.print')

$setFullScreenBtn.addEventListener('click', function() {
  callEvent('SET_FULL_SCREEN')
})

$print.addEventListener('click', function() {
  callEvent('ASYNC_EVENT', { word: 'hello world' }).then(() => {
    console.log('done')
  })
})
```

### API

#### `registEvents(events: Object, cusParams: Array)`

- `event`s: events object, key is the name called by callEvent, value is the function

- `cusParams`: will be spreaded and pass to event function

#### `callEvent(eventName: String, params: Object)`

- `eventName`: the key of the events object

- `params`: will be passed to event function as the first parameter

- return Promise
