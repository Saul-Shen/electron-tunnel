const { app, BrowserWindow } = require('electron')
const path = require('path')
const events = require('./events/index.js')
const { registNativeEvent } = require('../../lib')

app.on('ready', () => {
  const win = new BrowserWindow()

  for (const k in events) {
    const eventName = k
    const fn = events[k]

    registNativeEvent(eventName, async params => {
      return await fn(params, app, win)
    })
  }

  win.loadURL(`file://${__dirname}/index.html`)

  win.webContents.openDevTools()

  win.on('closed', function() {
    win = null
    app.quit()
  })
})

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  app.quit()
})
