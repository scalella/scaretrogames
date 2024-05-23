const canvas = document.getElementById('pingCanvas');
const context = canvas.getContext('2d');

// Dimensiones de la mesa
canvas.width = 1200; // ancho
canvas.height = 800; // alto

// Propiedades de las paletas
const paddleWidth = 10;
const paddleHeight = 100;
const paddleOffset = 30; // Desplazamiento de la paleta desde el borde

const player = {
    x: canvas.width - paddleWidth - paddleOffset,  // Posición despegada del lado derecho
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0  // Velocidad vertical
};

const computer = {
    x: paddleOffset,  // Posición despegada del lado izquierdo
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight-20,
    dy: 4  // Velocidad vertical
};

// Propiedades de la pelota
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 4,
    dx: 2,  // Velocidad horizontal
    dy: 2   // Velocidad vertical
};

// Propiedades del marcador
let playerScore = 0;
let computerScore = 0;

// Funciones para dibujar
function drawRect(x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.closePath();
    context.fill();
}

// Dibuja la red en el centro del canvas
function drawNet() {
    for (let i = 0; i < canvas.height; i += 15) {
        drawRect(canvas.width / 2 - 1, i, 2, 10, '#00ff44');
    }
}

// Dibuja el marcador
function drawScore() {
    context.fillStyle = '#00ff44';
    context.font = '32px Arial';
    context.fillText(playerScore, 3 * canvas.width / 4, 50);
    context.fillText(computerScore, canvas.width / 4, 50);
}

// Dibuja todo en el canvas
function draw() {
    drawRect(0, 0, canvas.width, canvas.height, '#000');
    drawNet();
    drawRect(player.x, player.y, player.width, player.height, '#00ff44');
    drawRect(computer.x, computer.y, computer.width, computer.height, '#00ff44');
    drawCircle(ball.x, ball.y, ball.radius, '#00ff44');
    drawScore();
}

// Actualiza las posiciones de los objetos del juego
function update() {
    // Mueve la pelota
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Colisión con las paredes (superior/inferior)
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    // Colisión con la paleta del jugador
    if (
        ball.x + ball.radius > player.x && 
        ball.x - ball.radius < player.x + player.width &&
        ball.y + ball.radius > player.y &&
        ball.y - ball.radius < player.y + player.height
    ) {
        let collidePoint = ball.y - (player.y + player.height / 2);
        collidePoint = collidePoint / (player.height / 2);
        let angleRad = (Math.PI / 4.7) * collidePoint;

        let direction = ball.x + ball.radius < canvas.width / 2 ? 1 : -1;
        ball.dx = direction * ball.speed * Math.cos(angleRad);
        ball.dy = ball.speed * Math.sin(angleRad);
        ball.speed += .15;
    }

    // Colisión con la paleta de la computadora
    if (
        ball.x + ball.radius > computer.x && 
        ball.x - ball.radius < computer.x + computer.width &&
        ball.y + ball.radius > computer.y &&
        ball.y - ball.radius < computer.y + computer.height
    ) {
        let collidePoint = ball.y - (computer.y + computer.height / 2);
        collidePoint = collidePoint / (computer.height / 2);
        let angleRad = (Math.PI / 4) * collidePoint;

        let direction = ball.x - (canvas.width / 2) > 0 ? 1 : -1;
        ball.dx = -direction * ball.speed * Math.cos(angleRad);
        ball.dy = ball.speed * Math.sin(angleRad);
        ball.speed += 1.91;
    }

    // Resetea la pelota y actualiza el marcador cuando toca la línea de fondo
    if (ball.x + ball.radius > canvas.width) {
        computerScore++;
        resetBall(player); // La pelota sale de la paleta del jugador
    } else if (ball.x - ball.radius < 0) {
        playerScore++;
        resetBall(computer); // La pelota sale de la paleta de la computadora
    }

    // Mueve la paleta del jugador
    player.y += player.dy;

    // Evita que la paleta del jugador salga de los límites
    if (player.y < 0) {
        player.y = 0;
    } else if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }

    // Mueve la paleta de la computadora
    if (ball.y < computer.y + computer.height / 2) {
        computer.y -= computer.dy;
    } else {
        computer.y += computer.dy;
    }

    // Evita que la paleta de la computadora salga de los límites
    if (computer.y < 0) {
        computer.y = 0;
    } else if (computer.y + computer.height > canvas.height) {
        computer.y = canvas.height - computer.height;
    }
}

// Resetea la pelota para salir desde la paleta del jugador que hizo el punto
function resetBall(paddle) {
    ball.speed = 4; // Resetea la velocidad de la pelota
    ball.x = paddle.x + (paddle === player ? -ball.radius : paddle.width + ball.radius);
    ball.y = paddle.y + paddle.height / 2;
    ball.dx = paddle === player ? -ball.speed : ball.speed;
    ball.dy = 0;
}

// Event listeners para el movimiento de la paleta del jugador
document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case 'ArrowUp':
            player.dy = -4;
            break;
        case 'ArrowDown':
            player.dy = 4;
            break;
    }
});

document.addEventListener('keyup', function(event) {
    switch(event.key) {
        case 'ArrowUp':
        case 'ArrowDown':
            player.dy = 0;
            break;
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'b' || event.key === 'B') {
        window.location.href = '../index.html'; 
    }
});

// Bucle del juego
function gameLoop() {
    update();
    draw();
}

setInterval(gameLoop, 1000 / 60);
