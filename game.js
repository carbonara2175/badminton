(function (global) {
  "use strict";

  class BadmintonGame {
    constructor() { this.reset(); }

    reset() {
      this.scores = [0, 0];
      this.games = [0, 0];
      this.server = null;
      this.finished = false;
      this.history = [];
    }

    start(server) {
      if (server !== 0 && server !== 1) throw new Error("Invalid server");
      this.server = server;
    }

    point(player) {
      if (this.finished || (player !== 0 && player !== 1)) return null;
      this.history.push(this.snapshot());
      this.scores[player] += 1;
      this.server = player;

      if (this.isGameWon(player)) {
        this.games[player] += 1;
        this.finished = this.games[player] === 2;
        this.scores = [0, 0];
        return { gameWon: true, matchWon: this.finished, winner: player };
      }
      return { gameWon: false, matchWon: false, winner: null };
    }

    isGameWon(player) {
      const mine = this.scores[player];
      const theirs = this.scores[1 - player];
      return mine === 30 || (mine >= 21 && mine - theirs >= 2);
    }

    undo() {
      const previous = this.history.pop();
      if (!previous) return false;
      this.restore(previous);
      return true;
    }

    resetCurrentGame() {
      this.scores = [0, 0];
      this.history = [];
    }

    snapshot() {
      return { scores: [...this.scores], games: [...this.games], server: this.server, finished: this.finished };
    }

    restore(state) {
      this.scores = [...state.scores];
      this.games = [...state.games];
      this.server = state.server;
      this.finished = state.finished;
    }
  }

  global.BadmintonGame = BadmintonGame;
  if (typeof module !== "undefined" && module.exports) module.exports = BadmintonGame;
})(typeof window !== "undefined" ? window : globalThis);
