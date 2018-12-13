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

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  app.quit()
})
