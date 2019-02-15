/**
 * 主进程中处理screen相关的事件
 */

//进入全屏
function setFullScreen(params, app, win) {
  return win.setFullScreen(true)
}

//退出全屏
function quitFullScreen(params, app, win) {
  return win.setFullScreen(false)
}

function asyncEvent(params) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`received ${params.word}`)
    }, 3000)
  })
}

module.exports = {
  setFullScreen,
  quitFullScreen,
  asyncEvent
}
