## electron-tunnel

You don't need to distinguish main process & renderer process any more.<br>

After regist event in main process, you can call registed event in render process.

### Usage

- `npm i electron-tunnel`

- regist event in main process

```javascript
const { app, BrowserWindow } = require('electron')
const path = require('path')
const { registNativeEvent } = require('electron-tunnel')

app.on('ready', () => {
  const win = new BrowserWindow()

  registNativeEvent('ASYNC_EVENT', async params => {
    const res = await new Promise(resolve => {
      setTimeout(() => {
        resolve(`received ${params.word}`)
      }, 3000)
    })

    return res
  })

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
const { callNativeEvent } = require('electron-tunnel')
var $print = document.querySelector('.print')

$print.addEventListener('click', function() {
  callNativeEvent('ASYNC_EVENT', { word: 'hello world' }).then(res => {
    console.log(res)
  })
})
```

### API

#### `registNativeEvent(eventName: string, fn: (params: any) => Promise<any>)`

- `eventName`: string

- `fn`: native event

- `params` passed by callNativeEvent

#### `callNativeEvent(eventName: String, params: any)`

- `eventName`: string

- `params`: will be passed to event function
