const assert = require('node:assert/strict');
const BadmintonGame = require('./game');

function score(game, player, times) { for (let i = 0; i < times; i += 1) game.point(player); }

{
  const game = new BadmintonGame();
  game.start(0);
  score(game, 0, 21);
  assert.deepEqual(game.games, [1, 0]);
  assert.deepEqual(game.scores, [0, 0]);
  assert.equal(game.server, 0);
}

{
  const game = new BadmintonGame();
  game.start(0);
  score(game, 0, 20); score(game, 1, 20);
  game.point(0); game.point(1); game.point(1); game.point(1);
  assert.deepEqual(game.games, [0, 1], 'two clear points win after deuce');
  assert.equal(game.undo(), true);
  assert.deepEqual(game.games, [0, 0], 'undo restores a game-winning point');
  assert.deepEqual(game.scores, [21, 22]);
}

{
  const game = new BadmintonGame();
  game.start(1);
  for (let i = 0; i < 29; i += 1) { game.point(0); game.point(1); }
  game.point(0);
  assert.deepEqual(game.games, [1, 0], 'point 30 wins at 29-all');
  score(game, 0, 21);
  assert.equal(game.finished, true);
  assert.deepEqual(game.games, [2, 0]);
  assert.equal(game.point(1), null, 'scoring is locked after match');
}

console.log('All scoring tests passed.');
