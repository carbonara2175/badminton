(function () {
  "use strict";

  const game = new BadmintonGame();
  const $ = (id) => document.getElementById(id);
  const names = [$('name-a'), $('name-b')];
  const scores = [$('score-a'), $('score-b')];
  const games = [$('games-a'), $('games-b')];
  const serves = [$('serve-a'), $('serve-b')];
  const addButtons = [$('add-a'), $('add-b')];

  function displayName(player) {
    return names[player].value.trim() || `PLAYER ${player === 0 ? 'A' : 'B'}`;
  }

  function render() {
    for (let player = 0; player < 2; player += 1) {
      scores[player].textContent = game.scores[player];
      games[player].textContent = game.games[player];
      serves[player].classList.toggle('active', game.server === player && !game.finished);
      addButtons[player].disabled = game.finished || game.server === null;
    }
    $('undo').disabled = game.history.length === 0;
  }

  function addPoint(player) {
    const result = game.point(player);
    render();
    if (result && result.matchWon) {
      $('winner-name').textContent = displayName(player);
      $('winner-modal').hidden = false;
    }
  }

  addButtons.forEach((button, player) => button.addEventListener('click', () => addPoint(player)));
  $('undo').addEventListener('click', () => { game.undo(); $('winner-modal').hidden = true; render(); });
  $('undo-finish').addEventListener('click', () => {
    game.undo();
    $('winner-modal').hidden = true;
    render();
  });

  $('reset-game').addEventListener('click', () => {
    if ((game.scores[0] || game.scores[1]) && !confirm('現在のゲームの得点を 0 - 0 に戻しますか？')) return;
    game.resetCurrentGame();
    render();
  });

  function resetMatch() {
    game.reset();
    $('winner-modal').hidden = true;
    $('serve-modal').hidden = false;
    render();
  }

  $('reset-match').addEventListener('click', () => {
    if (confirm('試合全体をリセットします。ゲーム数と得点をすべて戻しますか？')) resetMatch();
  });
  $('new-match').addEventListener('click', resetMatch);

  [0, 1].forEach((player) => {
    $(`start-${player === 0 ? 'a' : 'b'}`).addEventListener('click', () => {
      game.start(player);
      $('serve-modal').hidden = true;
      render();
    });
  });

  $('fullscreen').addEventListener('click', async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch (_) {
      alert('このブラウザではフルスクリーン表示を利用できません。');
    }
  });

  names.forEach((input, player) => input.addEventListener('input', () => {
    $(`start-${player === 0 ? 'a' : 'b'}`).textContent = displayName(player);
  }));

  render();
})();
