const canvas = document.getElementById('arkanoidCanvas');
        const context = canvas.getContext('2d');

        // Configurar dimensiones del canvas
        canvas.width = 785; // Ancho
        canvas.height = 650; // Alto

        // Propiedades de la paleta
        const paddleWidth = 100;
        const paddleHeight = 10;
        const paddleOffset = 20; // Desplazamiento desde el borde inferior

        const paddle = {
            x: canvas.width / 2 - paddleWidth / 2,
            y: canvas.height - paddleHeight - paddleOffset,
            width: paddleWidth,
            height: paddleHeight,
            dx: 5 // Velocidad horizontal
        };

        // Propiedades de la pelota
        const ball = {
            x: canvas.width / 2,
            y: paddle.y - 10,
            radius: 10,
            speed: 4,
            dx: 4, // Velocidad horizontal
            dy: -4 // Velocidad vertical
        };

        // Propiedades de los ladrillos
        const brickRowCount = 6;
        const brickColumnCount = 18;
        const brickWidth = 30;
        const brickHeight = 18;
        const brickPadding = 11;
        const brickOffsetTop = 30;
        const brickOffsetLeft = 30;

        const bricks = [];
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }

        let score = 0;
        let lives = 3;

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

        function drawBricks() {
            for (let c = 0; c < brickColumnCount; c++) {
                for (let r = 0; r < brickRowCount; r++) {
                    if (bricks[c][r].status === 1) {
                        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                        bricks[c][r].x = brickX;
                        bricks[c][r].y = brickY;
                        drawRect(brickX, brickY, brickWidth, brickHeight, '#00ff44');
                    }
                }
            }
        }

        function drawScore() {
            context.fillStyle = 'F00ff44';
            context.font = '16px Arial';
            context.fillText(`Score: ${score}`, 8, 20);
        }

        function drawLives() {
            context.fillStyle = '#00ff44';
            context.font = '16px Arial';
            context.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
        }

        // Dibuja todo en el canvas
        function draw() {
            context.clearRect(0, 0, canvas.width, canvas.height);
            drawBricks();
            drawRect(paddle.x, paddle.y, paddle.width, paddle.height, '#00ff44');
            drawCircle(ball.x, ball.y, ball.radius, '#00ff44');
            drawScore();
            drawLives();
        }

        // Detección de colisiones
        function collisionDetection() {
            for (let c = 0; c < brickColumnCount; c++) {
                for (let r = 0; r < brickRowCount; r++) {
                    const brick = bricks[c][r];
                    if (brick.status === 1) {
                        if (
                            ball.x > brick.x &&
                            ball.x < brick.x + brickWidth &&
                            ball.y > brick.y &&
                            ball.y < brick.y + brickHeight
                        ) {
                            ball.dy *= -1;
                            brick.status = 0;
                            score++;
                            if (score === brickRowCount * brickColumnCount) {
                                alert('Congratulations, you win!');
                                document.location.reload();
                            }
                        }
                    }
                }
            }
        }

        // Actualiza las posiciones de los objetos del juego
        function update() {
            // Mueve la pelota
            ball.x += ball.dx;
            ball.y += ball.dy;

            // Colisión con las paredes (izquierda/derecha)
            if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
                ball.dx *= -1;
            }

            // Colisión con las paredes (superior)
            if (ball.y - ball.radius < 0) {
                ball.dy *= -1;
            }

            // Colisión con la paleta
            if (
                ball.x > paddle.x &&
                ball.x < paddle.x + paddle.width &&
                ball.y + ball.radius > paddle.y
            ) {
                ball.dy = -ball.speed;
            }

            // Colisión con el fondo
            if (ball.y + ball.radius > canvas.height) {
                lives--;
                if (lives === 0) {
                    alert('Game Over');
                    document.location.reload();
                } else {
                    ball.x = canvas.width / 2;
                    ball.y = paddle.y - 10;
                    ball.dx = 4;
                    ball.dy = -4;
                    paddle.x = canvas.width / 2 - paddleWidth / 2;
                }
            }

            // Mueve la paleta
            if (rightPressed && paddle.x < canvas.width - paddle.width) {
                paddle.x += paddle.dx;
            } else if (leftPressed && paddle.x > 0) {
                paddle.x -= paddle.dx;
            }

            collisionDetection();
        }

        // Event listeners para el movimiento de la paleta del jugador
        let rightPressed = false;
        let leftPressed = false;

        document.addEventListener('keydown', function(event) {
            if (event.key === 'Right' || event.key === 'ArrowRight') {
                rightPressed = true;
            } else if (event.key === 'Left' || event.key === 'ArrowLeft') {
                leftPressed = true;
            } else if (event.key === 'b' || event.key === 'B') {
                window.location.href = '../index.html'; 
            }
        });

        document.addEventListener('keyup', function(event) {
            if (event.key === 'Right' || event.key === 'ArrowRight') {
                rightPressed = false;
            } else if (event.key === 'Left' || event.key === 'ArrowLeft') {
                leftPressed = false;
            }
        });

        

        // Bucle del juego
        function gameLoop() {
            update();
            draw();
        }

        setInterval(gameLoop, 1000 / 60);