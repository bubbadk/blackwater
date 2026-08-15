/* Bootstrap: init the shell, register game scenes, boot the title screen. */
(function (GS) {
  'use strict';

  function start() {
    GS.Title.bind();
    GS.Scenes.register('game', { enter: GS.Game.enter, exit: GS.Game.exit });
    GS.Scenes.register('ending', { enter: function () {}, exit: function () {} });
    GS.Shell.init();
    GS.Scenes.boot('title');
    GS.Events.emit('ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})(window.GameShell = window.GameShell || {});
