export class Piece {
    constructor(board) {
        this.board = board;
        this.x = 3;
        this.y = -2;
        this.tetrominoes = this.createTetrominoes();
        this.color = this.randomColor();
        this.shape = this.tetrominoes[Math.floor(Math.random() * this.tetrominoes.length)];
        this.gameOver = false;
    }

    createTetrominoes() {
        return [
            [[1, 1, 1], [0, 1, 0]], // T
            [[1, 1], [1, 1]],       // O
            [[1, 1, 0], [0, 1, 1]], // S
            [[0, 1, 1], [1, 1, 0]], // Z
            [[1, 1, 1, 1]],         // I
            [[1, 0, 0], [1, 1, 1]], // J
            [[0, 0, 1], [1, 1, 1]]  // L
        ];
    }

    randomColor() {
        const colors = ["#00ff44", "#00ff55", "#00ff66", "#00ff77", "#00ff88", "#00ff99", "#00ff33"];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    draw() {
        this.fill(this.color);
    }

    unDraw() {
        this.fill(this.board.VACANT);
    }

    fill(color) {
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    this.board.drawSquare(this.x + x, this.y + y, color);
                }
            });
        });
    }

    moveDown() {
        if (!this.collision(0, 1)) {
            this.unDraw();
            this.y++;
            this.draw();
        } else {
            this.board.lockPiece(this);
            if (!this.gameOver) {
                this.reset();
            }
        }
    }

    moveRight() {
        if (!this.collision(1, 0)) {
            this.unDraw();
            this.x++;
            this.draw();
        }
    }

    moveLeft() {
        if (!this.collision(-1, 0)) {
            this.unDraw();
            this.x--;
            this.draw();
        }
    }

    rotate() {
        let nextPattern = this.shape[0].map((val, index) =>
            this.shape.map(row => row[index]).reverse()
        );
        let kick = 0;

        if (this.collision(0, 0, nextPattern)) {
            if (this.x > this.board.COL / 2) {
                kick = -1;
            } else {
                kick = 1;
            }
        }

        if (!this.collision(kick, 0, nextPattern)) {
            this.unDraw();
            this.x += kick;
            this.shape = nextPattern;
            this.draw();
        }
    }

    collision(xOffset, yOffset, newShape = this.shape) {
        for (let y = 0; y < newShape.length; y++) {
            for (let x = 0; x < newShape[y].length; x++) {
                if (!newShape[y][x]) continue;

                let newX = this.x + x + xOffset;
                let newY = this.y + y + yOffset;

                if (newX < 0 || newX >= this.board.COL || newY >= this.board.ROW) {
                    return true;
                }
                if (newY < 0) continue;
                if (this.board.grid[newY][newX] !== this.board.VACANT) {
                    return true;
                }
            }
        }
        return false;
    }

    reset() {
        this.x = 3;
        this.y = -2;
        this.color = this.randomColor();
        this.shape = this.tetrominoes[Math.floor(Math.random() * this.tetrominoes.length)];
    }
}
