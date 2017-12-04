var {callEvent} = require('../../dist/index.js');
var $setFullScreenBtn = document.querySelector('.set-full-screen');
var $quitFullScreenBtn = document.querySelector('.quit-full-screen');
var $print = document.querySelector('.print');

$setFullScreenBtn.addEventListener('click', function() {
  callEvent('SET_FULL_SCREEN');
});

$quitFullScreenBtn.addEventListener('click', function() {
  callEvent('QUIT_FULL_SCREEN');
});

$print.addEventListener('click', function() {
  callEvent('ASYNC_EVENT', {word: 'hello world'}).then(() => {
    console.log('done');
  });
});
