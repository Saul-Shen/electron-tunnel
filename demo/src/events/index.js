const { setFullScreen, quitFullScreen, asyncEvent } = require('./screen.js')

module.exports = {
  SET_FULL_SCREEN: setFullScreen,
  QUIT_FULL_SCREEN: quitFullScreen,
  ASYNC_EVENT: asyncEvent
}
