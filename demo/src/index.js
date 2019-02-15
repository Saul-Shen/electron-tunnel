var { callNativeEvent } = require('../../lib')
var $setFullScreenBtn = document.querySelector('.set-full-screen')
var $quitFullScreenBtn = document.querySelector('.quit-full-screen')
var $print = document.querySelector('.print')

$setFullScreenBtn.addEventListener('click', function() {
  callNativeEvent('SET_FULL_SCREEN')
})

$quitFullScreenBtn.addEventListener('click', function() {
  callNativeEvent('QUIT_FULL_SCREEN')
})

$print.addEventListener('click', function() {
  callNativeEvent('ASYNC_EVENT', { word: 'hello world' }).then(msg => {
    console.log(msg)
  })
})
