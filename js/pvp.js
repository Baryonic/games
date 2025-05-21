// Game configuration
const GAME_CONFIG = {
    FPS: 90,
    PADDLE_WIDTH: 10,
    PADDLE_HEIGHT: 60,
    BALL_SIZE: 10,
    PADDLE_SPEED: 5,
    INITIAL_BALL_SPEED: {
        X: 5,
        Y: -5
    },
    CANVAS_HEIGHT_RATIO: 0.6, // 60% of viewport height
    TEXT_CLEAR_INTERVAL: 10000 // 10 seconds in milliseconds
};

// Game state
let gameState = {
    canvas: null,
    ctx: null,
    fps: GAME_CONFIG.FPS,
    timeCounter: 0,
    timeSinceGoal: 0,
    winScore: 0,
    gameDifficulty: 1,
    winner: 0,
    p1TotalGoals: 0,
    p2TotalGoals: 0,
    isGameStarted: false,
    gameLoop: null,
    textClearInterval: null
};

// Player state
let players = {
    p1: {
        x: 0,
        y: 0,
        color: "red",
        score: 0,
        name: "player 1",
        controls: { up: false, down: false }
    },
    p2: {
        x: 0,
        y: 0,
        color: "blue",
        score: 0,
        name: "player 2",
        controls: { up: false, down: false }
    }
};

// Ball state
let ball = {
    x: 0,
    y: 0,
    size: GAME_CONFIG.BALL_SIZE,
    color: "white",
    speed: { x: 0, y: 0 },
    startX: 0,
    startY: 0
};

// UI elements
let ui = {
    goText: null,
    textEraser: null,
    goTextX: 0,
    goTextY: 50
};

function init() {
    console.log("Initializing game...");
    
    // Initialize canvas
    gameState.canvas = document.getElementById("canvas1");
    if (!gameState.canvas) {
        console.error("Canvas element not found!");
        return;
    }
    
    gameState.ctx = gameState.canvas.getContext("2d");
    if (!gameState.ctx) {
        console.error("Could not get canvas context!");
        return;
    }
    
    console.log("Canvas initialized:", gameState.canvas.width, gameState.canvas.height);
    
    // Set canvas dimensions
    resizeCanvas();
    
    // Add window resize listener
    window.addEventListener('resize', handleResize);
    
    // Initialize UI
    ui.goText = gameState.ctx;
    ui.textEraser = gameState.ctx;
    ui.goText.font = "20px Arial";
    
    // Set random win score
    gameState.winScore = Math.floor(Math.random() * 7) + 1;
    
    // Initialize paddle positions
    resetPaddlePositions();
    
    // Initialize ball
    resetBall();
    
    // Initialize total goals display
    document.getElementById("p1TotalGoals").innerHTML = `${players.p1.name}: ${gameState.p1TotalGoals}`;
    document.getElementById("p2TotalGoals").innerHTML = `${players.p2.name}: ${gameState.p2TotalGoals}`;
    
    // Start the game loop immediately
    startGameLoop();
    
    // Update info display
    document.getElementById("info1").innerHTML = "Win score is: " + gameState.winScore;
    document.getElementById("info3").innerHTML = "Ball horizontal speed is: " + GAME_CONFIG.INITIAL_BALL_SPEED.X;
    document.getElementById("info2").innerHTML = "Press H or click Start Game to release the ball";
    
    console.log("Game initialized successfully");
}

function resizeCanvas() {
    const canvas = gameState.canvas;
    const width = window.innerWidth;
    const height = window.innerHeight * GAME_CONFIG.CANVAS_HEIGHT_RATIO;
    
    console.log("Resizing canvas to:", width, height);
    
    // Set canvas size
    canvas.width = width;
    canvas.height = height;
    
    // Update UI positions
    ui.goTextX = width * 0.1;
    ui.goTextY = height * 0.2;
    
    // Reset game elements
    resetPaddlePositions();
    resetBall();
}

function handleResize() {
    resizeCanvas();
    drawWelcomeScreen();
}

function resetPaddlePositions() {
    const canvasWidth = gameState.canvas.width;
    const canvasHeight = gameState.canvas.height;
    
    // Scale paddle height based on canvas height
    const paddleHeight = Math.min(GAME_CONFIG.PADDLE_HEIGHT, canvasHeight * 0.2);
    
    players.p1.x = 0;
    players.p1.y = (canvasHeight - paddleHeight) / 2;
    
    players.p2.x = canvasWidth - GAME_CONFIG.PADDLE_WIDTH;
    players.p2.y = (canvasHeight - paddleHeight) / 2;
    
    console.log("Paddle positions reset:", 
        "P1:", players.p1.x, players.p1.y,
        "P2:", players.p2.x, players.p2.y);
}

function drawWelcomeScreen() {
    console.log("Drawing welcome screen...");
    const ctx = gameState.ctx;
    const width = gameState.canvas.width;
    const height = gameState.canvas.height;
    
    // Clear canvas
    clearCanvas();
    
    // Draw welcome text
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "20px Arial";
    ctx.fillText("Welcome to Tennis PVP", width/2, height * 0.2);
    
    // Draw player controls
    ctx.textAlign = "left";
    ctx.fillStyle = players.p1.color;
    ctx.fillText("Player 1: 'W' 'S'", width * 0.1, height * 0.3);
    
    ctx.fillStyle = players.p2.color;
    ctx.fillText("Player 2: 'O' 'L'", width * 0.6, height * 0.3);
    
    // Draw start instructions
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Press H or click Start Game to begin", width/2, height * 0.4);
    ctx.fillText("Goals to win: " + gameState.winScore, width/2, height * 0.5);
    
    // Draw current scores
    ctx.fillStyle = players.p1.color;
    ctx.fillText(`${players.p1.name}: ${players.p1.score}`, width/2 - 100, height * 0.6);
    ctx.fillStyle = players.p2.color;
    ctx.fillText(`${players.p2.name}: ${players.p2.score}`, width/2 + 100, height * 0.6);
    
    // Draw total goals
    ctx.fillStyle = "white";
    ctx.fillText("Total Goals:", width/2, height * 0.7);
    ctx.fillStyle = players.p1.color;
    ctx.fillText(`${players.p1.name}: ${gameState.p1TotalGoals}`, width/2 - 100, height * 0.75);
    ctx.fillStyle = players.p2.color;
    ctx.fillText(`${players.p2.name}: ${gameState.p2TotalGoals}`, width/2 + 100, height * 0.75);
    
    console.log("Welcome screen drawn");
}

function startGameLoop() {
    // Clear any existing intervals
    if (gameState.gameLoop) {
        clearInterval(gameState.gameLoop);
    }
    if (gameState.textClearInterval) {
        clearInterval(gameState.textClearInterval);
    }
    
    // Set up periodic canvas clearing
    gameState.textClearInterval = setInterval(clearCanvas, GAME_CONFIG.TEXT_CLEAR_INTERVAL);
    
    // Start the main game loop
    gameState.gameLoop = setInterval(gameLoop, 1000 / gameState.fps);
}

function startGame() {
    if (!gameState.isGameStarted) {
        gameState.isGameStarted = true;
        gameState.gameDifficulty++;
        gameState.timeSinceGoal = 0;
        document.getElementById("info2").innerHTML = "Game started!";
        clearCanvas(); // Clear the welcome screen when game starts
    }
}

function gameLoop() {
    if (!gameState.isGameStarted) {
        drawWelcomeScreen();
    } else if (gameState.timeSinceGoal <= 100) {
        handleCountdown();
    } else {
        updateGame();
    }
    
    // Always update UI and handle paddle movement
    updatePaddles();
    gameState.timeCounter++;
    if (gameState.isGameStarted) {
        gameState.timeSinceGoal++;
    }
    updateUI();
}

function handleCountdown() {
    const ctx = gameState.ctx;
    const time = gameState.timeSinceGoal;
    
    if (time > 0 && time < 30) {
        ctx.fillStyle = "red";
        ctx.fillText("3", ui.goTextX, ui.goTextY);
    } else if (time === 30) {
        clearText();
    } else if (time > 30 && time < 60) {
        ctx.fillStyle = "orange";
        ctx.fillText("2", ui.goTextX, ui.goTextY);
    } else if (time === 60) {
        clearText();
    } else if (time > 60 && time < 90) {
        ctx.fillStyle = "yellow";
        ctx.fillText("1", ui.goTextX, ui.goTextY);
    } else if (time === 90) {
        clearText();
    } else if (time > 90 && time < 100) {
        ctx.fillStyle = "green";
        ctx.fillText("GO!!", ui.goTextX, ui.goTextY);
    } else if (time === 100) {
        clearText();
    }
}

function updateGame() {
    updateBall();
    checkCollisions();
    checkWinCondition();
}

function updateBall() {
    if (gameState.isGameStarted && players.p1.score < gameState.winScore && players.p2.score < gameState.winScore) {
        moveBall();
    }
}

function updatePaddles() {
    if (players.p1.controls.up) movePaddle(players.p1, -GAME_CONFIG.PADDLE_SPEED);
    if (players.p1.controls.down) movePaddle(players.p1, GAME_CONFIG.PADDLE_SPEED);
    if (players.p2.controls.up) movePaddle(players.p2, -GAME_CONFIG.PADDLE_SPEED);
    if (players.p2.controls.down) movePaddle(players.p2, GAME_CONFIG.PADDLE_SPEED);
}

function movePaddle(player, speed) {
    const canvasHeight = gameState.canvas.height;
    const newY = player.y + speed;
    
    if (newY >= 0 && newY + GAME_CONFIG.PADDLE_HEIGHT <= canvasHeight) {
        erasePaddle(player);
        player.y = newY;
        drawPaddle(player);
    }
}

function checkCollisions() {
    const canvasWidth = gameState.canvas.width;
    const canvasHeight = gameState.canvas.height;
    
    // Wall collisions
    if (ball.y >= canvasHeight - ball.size) ball.speed.y = -ball.speed.y;
    if (ball.y <= 0) ball.speed.y = -ball.speed.y;
    
    // Paddle collisions
    if (ball.x >= canvasWidth - (ball.size + GAME_CONFIG.PADDLE_WIDTH)) {
        if (checkPaddleCollision(players.p2)) {
            handlePaddleCollision(players.p2);
        } else {
            scorePoint(players.p1);
        }
    }
    
    if (ball.x <= GAME_CONFIG.PADDLE_WIDTH) {
        if (checkPaddleCollision(players.p1)) {
            handlePaddleCollision(players.p1);
        } else {
            scorePoint(players.p2);
        }
    }
}

function checkPaddleCollision(player) {
    return ball.y + ball.size >= player.y && ball.y <= player.y + GAME_CONFIG.PADDLE_HEIGHT;
}

function handlePaddleCollision(player) {
    ball.speed.x = -ball.speed.x;
    ball.speed.y = ((ball.y + ball.size/2) - (player.y + GAME_CONFIG.PADDLE_HEIGHT/2)) / 6;
}

function scorePoint(player) {
    player.score++;
    gameState.timeSinceGoal = 0;
    resetBall();
    updateScoreDisplay();
    
    // Update total goals
    if (player === players.p1) {
        gameState.p1TotalGoals++;
        document.getElementById("p1TotalGoals").innerHTML = `${players.p1.name}: ${gameState.p1TotalGoals}`;
    } else {
        gameState.p2TotalGoals++;
        document.getElementById("p2TotalGoals").innerHTML = `${players.p2.name}: ${gameState.p2TotalGoals}`;
    }
}

function checkWinCondition() {
    if (players.p1.score >= gameState.winScore) {
        handleWin(players.p1);
    } else if (players.p2.score >= gameState.winScore) {
        handleWin(players.p2);
    }
}

function handleWin(player) {
    gameState.winner = player === players.p1 ? 1 : 2;
    const ctx = gameState.ctx;
    const width = gameState.canvas.width;
    const height = gameState.canvas.height;
    
    // Clear canvas first
    clearCanvas();
    
    ctx.fillStyle = player.color;
    ctx.textAlign = "center";
    ctx.fillText(player.name + " Wins -- press T to restart the game", width/2, height * 0.4);
    ctx.fillText("press H to increase difficulty", width/2, height * 0.5);
    ctx.fillText(gameState.gameDifficulty, width/2, height * 0.6);
    ctx.fillText("Goals to win: " + gameState.winScore, width/2, height * 0.7);
    
    // Display total goals
    ctx.fillText("Total Goals:", width/2, height * 0.8);
    ctx.fillStyle = players.p1.color;
    ctx.fillText(`${players.p1.name}: ${gameState.p1TotalGoals}`, width/2 - 100, height * 0.85);
    ctx.fillStyle = players.p2.color;
    ctx.fillText(`${players.p2.name}: ${gameState.p2TotalGoals}`, width/2 + 100, height * 0.85);
    
    gameState.winner = 0;
}

function resetBall() {
    const canvasWidth = gameState.canvas.width;
    const canvasHeight = gameState.canvas.height;
    
    ball.startX = (canvasWidth - ball.size) / 2;
    ball.startY = (canvasHeight - ball.size) / 2;
    ball.x = ball.startX;
    ball.y = ball.startY;
    ball.speed.x = GAME_CONFIG.INITIAL_BALL_SPEED.X;
    ball.speed.y = GAME_CONFIG.INITIAL_BALL_SPEED.Y;
    
    console.log("Ball position reset:", ball.x, ball.y);
}

function moveBall() {
    eraseBall();
    ball.x += ball.speed.x;
    ball.y += ball.speed.y;
    drawBall();
}

function drawBall() {
    const ctx = gameState.ctx;
    ctx.fillStyle = ball.color;
    ctx.fillRect(ball.x, ball.y, ball.size, ball.size);
}

function eraseBall() {
    const ctx = gameState.ctx;
    ctx.fillStyle = "black";
    ctx.fillRect(ball.x, ball.y, ball.size, ball.size);
}

function drawPaddle(player) {
    const ctx = gameState.ctx;
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, GAME_CONFIG.PADDLE_WIDTH, GAME_CONFIG.PADDLE_HEIGHT);
}

function erasePaddle(player) {
    const ctx = gameState.ctx;
    ctx.fillStyle = "black";
    ctx.fillRect(player.x, player.y, GAME_CONFIG.PADDLE_WIDTH, GAME_CONFIG.PADDLE_HEIGHT);
}

function drawPaddles() {
    console.log("Drawing paddles at positions:", 
        "P1:", players.p1.x, players.p1.y,
        "P2:", players.p2.x, players.p2.y);
    drawPaddle(players.p1);
    drawPaddle(players.p2);
}

function clearText() {
    const ctx = gameState.ctx;
    ctx.fillStyle = "black";
    ctx.fillRect(ui.goTextX, ui.goTextY - 25, 630, 35);
}

function updateUI() {
    document.getElementById("timeCounter").innerHTML = gameState.timeCounter;
    document.getElementById("goalTimeCounter").innerHTML = gameState.timeSinceGoal;
}

function updateScoreDisplay() {
    document.getElementById("d3").innerHTML = players.p1.score;
    document.getElementById("d5").innerHTML = players.p2.score;
}

function resetGame() {
    document.getElementById("info2").innerHTML = "Game reset - Press H or click Start Game to begin";
    clearText();
    players.p1.score = 0;
    players.p2.score = 0;
    updateScoreDisplay();
    gameState.timeCounter = 0;
    gameState.timeSinceGoal = 0;
    gameState.isGameStarted = false;
    resetBall();
    drawWelcomeScreen(); // Show welcome screen again after reset
}

function updateColors() {
    players.p1.color = document.getElementById("color1Input").value;
    players.p2.color = document.getElementById("color2Input").value;
    players.p1.name = document.getElementById("p1NameInput").value;
    players.p2.name = document.getElementById("p2NameInput").value;
}

function clearCanvas() {
    const ctx = gameState.ctx;
    const width = gameState.canvas.width;
    const height = gameState.canvas.height;
    
    // Clear canvas with background color
    ctx.fillStyle = "#141";
    ctx.fillRect(0, 0, width, height);
    
    // Redraw paddles and ball
    drawPaddles();
    drawBall();
}

// Event Listeners
window.addEventListener('keypress', function(event) {
    const key = event.key.toLowerCase();
    
    switch(key) {
        case 'w': players.p1.controls.up = true; break;
        case 's': players.p1.controls.down = true; break;
        case 'o': players.p2.controls.up = true; break;
        case 'l': players.p2.controls.down = true; break;
        case 'g': drawPaddles(); break;
        case 'h': startGame(); break;
        case 't': resetGame(); break;
    }
}, false);

window.addEventListener('keyup', function(event) {
    const key = event.key.toLowerCase();
    
    switch(key) {
        case 'w': players.p1.controls.up = false; break;
        case 's': players.p1.controls.down = false; break;
        case 'o': players.p2.controls.up = false; break;
        case 'l': players.p2.controls.down = false; break;
    }
}, false);

// Initialize game when window loads
window.onload = init;




