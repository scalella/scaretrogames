import { Tetris } from './tetris.js';

const canvas = document.getElementById('tetrisCanvas');
const tetris = new Tetris(canvas);

document.addEventListener('keydown', (event) => {
    tetris.handleKeyPress(event);
});

tetris.start();