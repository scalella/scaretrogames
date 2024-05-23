import { Piece } from './piece.js';
import { Board } from './board.js';

export class Tetris {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.board = new Board(this.context);
        this.piece = new Piece(this.board);
        this.score = 0;
        this.gameOver = false;
        this.dropStart = Date.now();
    }

    start() {
        this.update();
    }

    update() {
        let now = Date.now();
        let delta = now - this.dropStart;
        if (delta > 1000) {
            this.piece.moveDown();
            this.dropStart = Date.now();
        }
        if (!this.gameOver) {
            requestAnimationFrame(this.update.bind(this));
        }
    }

    handleKeyPress(event) {
        if (this.gameOver) return;
        if (event.keyCode === 37) {
            this.piece.moveLeft();
            this.dropStart = Date.now();
        } else if (event.keyCode === 38) {
            this.piece.rotate();
            this.dropStart = Date.now();
        } else if (event.keyCode === 39) {
            this.piece.moveRight();
            this.dropStart = Date.now();
        } else if (event.keyCode === 40) {
            this.piece.moveDown();
        } else if (event.keyCode === 66) {
            window.location.href = '../index.html'; 
        }
    }
}
