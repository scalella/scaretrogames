export class Board {
    constructor(context) {
        this.context = context;
        this.ROW = 30;
        this.COL = 10;
        this.SQ = 20;
        this.VACANT = "BLACK";
        this.grid = this.createBoard();
        this.drawBoard();
    }

    createBoard() {
        return Array.from({ length: this.ROW }, () => Array(this.COL).fill(this.VACANT));
    }

    drawSquare(x, y, color) {
        this.context.fillStyle = color;
        this.context.fillRect(x * this.SQ, y * this.SQ, this.SQ, this.SQ);

        this.context.strokeStyle = "BLACK";
        this.context.strokeRect(x * this.SQ, y * this.SQ, this.SQ, this.SQ);
    }

    drawBoard() {
        for (let r = 0; r < this.ROW; r++) {
            for (let c = 0; c < this.COL; c++) {
                this.drawSquare(c, r, this.grid[r][c]);
            }
        }
    }

    lockPiece(piece) {
        piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    let newY = piece.y + y;
                    let newX = piece.x + x;
                    if (newY < 0) {
                        // Game over
                        alert("Game Over");
                        piece.gameOver = true;
                    } else {
                        this.grid[newY][newX] = piece.color;
                    }
                }
            });
        });
        this.removeFullLines();
        this.drawBoard();
    }

    removeFullLines() {
        for (let y = 0; y < this.ROW; y++) {
            if (this.grid[y].every(value => value !== this.VACANT)) {
                this.grid.splice(y, 1);
                this.grid.unshift(Array(this.COL).fill(this.VACANT));
            }
        }
    }
}
