const electron = require('electron');
const { app, BrowserWindow } = electron;
const events = require('./events/index.js');
const path = require('path');

const {registEvents} = require('../../dist/index.js');

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

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  app.quit();
});
