class GameObject {
    constructor(name, x, y, hp, attack, defense) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.hp = hp;
        this.attack = attack;
        this.defense = defense;
    }

    isAlive() {
        return this.hp > 0;
    }

    attackEnemy(enemy) {
        if (this.isAlive() && enemy.isAlive()) {
            const damage = Math.max(0, this.attack - enemy.defense);
            enemy.hp -= damage;
        }
    }
}

class Unit extends GameObject {
    constructor(name, x, y, hp, attack, defense) {
        super(name, x, y, hp, attack, defense);
    }

    move() {
        this.x += 1; // Move to the right
    }
}

class Soldier extends Unit {
    constructor(x, y) {
        super("Soldier", x, y, 100, 20, 10);
    }
}

class Archer extends Unit {
    constructor(x, y) {
        super("Archer", x, y, 80, 25, 5);
        this.arrowCooldown = 0;
        this.range = 220; // Set archer's range (in pixels)
    }
}

class Cavalry extends Unit {
    constructor(x, y) {
        super("Cavalry", x, y, 120, 15, 15);
    }
}

class Enemy extends GameObject {
    constructor(name, x, y, hp, attack, defense) {
        super(name, x, y, hp, attack, defense);
    }

    move() {
        this.x -= 1; // Move to the left
    }
}

class EnemySoldier extends Enemy {
    constructor(x, y) {
        super("Enemy Soldier", x, y, 100, 20, 10);
        this.goldValue = 50;
    }
}

class EnemyArcher extends Enemy {
    constructor(x, y) {
        super("Enemy Archer", x, y, 80, 25, 5);
        this.goldValue = 70;
        this.arrowCooldown = 0;
        this.range = 220;
    }
}

class EnemyCavalry extends Enemy {
    constructor(x, y) {
        super("Enemy Cavalry", x, y, 120, 15, 15);
        this.goldValue = 100;
    }
}

class Town {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.gold = 1000;
        this.units = [];
    }

    recruit(unitType) {
        if (this.gold >= 50) {
            let unit;
            switch (unitType) {
                case 'soldier':
                    unit = new Soldier(this.x, this.y);
                    break;
                case 'archer':
                    unit = new Archer(this.x, this.y);
                    break;
                case 'cavalry':
                    unit = new Cavalry(this.x, this.y);
                    break;
            }
            if (unit) {
                this.units.push(unit);
                this.gold -= 50;
            }
        }
    }
}

// Make units smaller and map wider
const UNIT_SIZE = 32;
const MAP_WIDTH = 2000; // much wider map
const MAP_HEIGHT = 400;

// Responsive canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size responsively
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.8;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Adjust town and enemy spawn positions
const town = new Town(50, MAP_HEIGHT / 2 - UNIT_SIZE / 2);
town.hp = 500; // Add HP to town
Town.prototype.isAlive = function() { return this.hp > 0; };

const enemyTown = new Town(MAP_WIDTH - 50 - UNIT_SIZE, MAP_HEIGHT / 2 - UNIT_SIZE / 2);
enemyTown.hp = 500;
enemyTown.gold = 1000;
Town.prototype.isEnemy = false;
enemyTown.isEnemy = true;

const enemies = [];
let enemySpawnInterval = 2000; // Spawn enemies every 2 seconds

// --- Camera movement variables ---
let cameraX = 0;
let isDragging = false;
let lastDragX = 0;
let dragStartCameraX = 0;

// --- Touch and mouse drag for camera movement ---
canvas.addEventListener("mousedown", (e) => {
    isDragging = true;
    lastDragX = e.clientX;
    dragStartCameraX = cameraX;
});
canvas.addEventListener("mousemove", (e) => {
    if (isDragging) {
        const dx = e.clientX - lastDragX;
        cameraX = Math.max(0, Math.min(MAP_WIDTH - canvas.width, dragStartCameraX - dx));
    }
});
canvas.addEventListener("mouseup", () => {
    isDragging = false;
});
canvas.addEventListener("mouseleave", () => {
    isDragging = false;
});

// Touch events for camera movement
canvas.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
        isDragging = true;
        lastDragX = e.touches[0].clientX;
        dragStartCameraX = cameraX;
    }
});
canvas.addEventListener("touchmove", (e) => {
    if (isDragging && e.touches.length === 1) {
        const dx = e.touches[0].clientX - lastDragX;
        cameraX = Math.max(0, Math.min(MAP_WIDTH - canvas.width, dragStartCameraX - dx));
    }
});
canvas.addEventListener("touchend", () => {
    isDragging = false;
});

// --- Spawn allies in random rows ---
const ROWS = 6;
const ROW_HEIGHT = MAP_HEIGHT / ROWS;

function getRandomRowY() {
    return Math.floor(Math.random() * ROWS) * ROW_HEIGHT + (ROW_HEIGHT - UNIT_SIZE) / 2;
}

// Modify recruit to spawn in random row
Town.prototype.recruit = function(type) {
    const costs = { soldier: 50, archer: 70, cavalry: 100 };
    if (this.gold < costs[type]) return;
    this.gold -= costs[type];
    let unit;
    if (type === "soldier") unit = new Soldier(this.x + UNIT_SIZE, getRandomRowY());
    if (type === "archer") unit = new Archer(this.x + UNIT_SIZE, getRandomRowY());
    if (type === "cavalry") unit = new Cavalry(this.x + UNIT_SIZE, getRandomRowY());
    this.units.push(unit);
};

// --- Enemy spawn in random row ---
function spawnEnemy() {
    const enemyTypes = [EnemySoldier, EnemyArcher, EnemyCavalry];
    const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    const enemy = new enemyType(MAP_WIDTH - 50, getRandomRowY());
    enemies.push(enemy);
}

// --- Implement fighting logic between units ---
function handleCombat() {
    // Allied units logic (already present)
    for (let i = town.units.length - 1; i >= 0; i--) {
        const unit = town.units[i];
        // Check if unit is at the enemy town
        if (
            unit.x + UNIT_SIZE >= enemyTown.x &&
            Math.abs(unit.y - enemyTown.y) < UNIT_SIZE
        ) {
            if (unit instanceof Archer) {
                // Stop at the edge and shoot at the town
                unit.x = enemyTown.x - UNIT_SIZE; // Stop right before the town
                // Only shoot if cooldown is ready
                if (unit.arrowCooldown > 0) {
                    unit.arrowCooldown--;
                    continue;
                }
                // Only fire if no arrow already in flight from this archer to the town
                let alreadyFiring = arrows.some(a => a.active && a.x === unit.x + UNIT_SIZE && a.target === enemyTown);
                if (!alreadyFiring) {
                    arrows.push(new Arrow(unit.x + UNIT_SIZE, unit.y + UNIT_SIZE / 2, enemyTown, unit.attack));
                    unit.arrowCooldown = 30;
                }
                continue;
            } else {
                // Melee/cavalry attack the town and are removed
                enemyTown.hp -= unit.attack;
                town.units.splice(i, 1);
                continue;
            }
        }

        if (unit instanceof Archer) {
            // Reduce cooldown
            if (unit.arrowCooldown > 0) {
                unit.arrowCooldown--;
                continue;
            }
            // Find closest enemy in same row and within range
            let targets = enemies.filter(
                enemy =>
                    Math.abs(unit.y - enemy.y) < ROW_HEIGHT * 1.5 && // Allow adjacent rows
                    enemy.isAlive() &&
                    Math.abs(unit.x - enemy.x) <= unit.range
            );
            if (targets.length > 0) {
                // Closest enemy by x distance
                let target = targets.reduce((a, b) => Math.abs(unit.x - a.x) < Math.abs(unit.x - b.x) ? a : b);
                // Only fire if no arrow already in flight from this archer to this target
                let alreadyFiring = arrows.some(a => a.active && a.x === unit.x + UNIT_SIZE && a.y === unit.y && a.target === target);
                if (!alreadyFiring) {
                    arrows.push(new Arrow(unit.x + UNIT_SIZE, unit.y + UNIT_SIZE / 2, target, unit.attack));
                    unit.arrowCooldown = 30; // Fire every 30 frames (~0.5s at 60fps)
                }
            } else {
                // No enemy in range: advance
                unit.move();
            }
        } else {
            // Melee units attack if close
            let target = enemies.find(
                enemy =>
                    Math.abs(unit.y - enemy.y) < ROW_HEIGHT * 1.5 &&
                    Math.abs(unit.x - enemy.x) < UNIT_SIZE * 1.5
            );
            if (target) {
                // If not in the same row, move vertically toward the enemy
                if (Math.abs(unit.y - target.y) >= ROW_HEIGHT / 2) {
                    if (unit.y < target.y) unit.y += Math.min(4, target.y - unit.y);
                    else if (unit.y > target.y) unit.y -= Math.min(4, unit.y - target.y);
                } else {
                    // In the same row, attack
                    unit.attackEnemy(target);
                    if (target.isAlive()) target.attackEnemy(unit);
                }
            } else {
                // No enemy close, move forward
                unit.move();
            }
        }
    }

    // Enemy archers logic
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        // Check if enemy is at the player town
        if (
            enemy.x <= town.x + UNIT_SIZE &&
            Math.abs(enemy.y - town.y) < UNIT_SIZE
        ) {
            town.hp -= enemy.attack;
            enemies.splice(i, 1);
            continue;
        }

        if (enemy instanceof EnemyArcher) {
            if (enemy.arrowCooldown > 0) {
                enemy.arrowCooldown--;
                continue;
            }
            // Find closest allied unit in same row and within range
            let targets = town.units.filter(
                unit =>
                    Math.abs(unit.y - enemy.y) < ROW_HEIGHT * 1.5 && // Allow adjacent rows
                    unit.isAlive() &&
                    Math.abs(unit.x - enemy.x) <= enemy.range
            );
            if (targets.length > 0) {
                // Closest unit by x distance
                let target = targets.reduce((a, b) => Math.abs(enemy.x - a.x) < Math.abs(enemy.x - b.x) ? a : b);
                // Only fire if no arrow already in flight from this archer to this target
                let alreadyFiring = arrows.some(a => a.active && a.x === enemy.x && a.y === enemy.y + UNIT_SIZE / 2 && a.target === target && a.isEnemy);
                if (!alreadyFiring) {
                    arrows.push(new Arrow(enemy.x, enemy.y + UNIT_SIZE / 2, target, enemy.attack, true));
                    enemy.arrowCooldown = 30;
                }
            } else {
                // No unit in range: advance
                enemy.move();
            }
        }
    }

    // Remove dead units and enemies, grant gold
    town.units = town.units.filter(u => u.isAlive());
    for (let i = enemies.length - 1; i >= 0; i--) {
        if (!enemies[i].isAlive()) {
            if (typeof enemies[i].goldValue === "number") {
                town.gold += enemies[i].goldValue;
            }
            enemies.splice(i, 1);
        }
    }
}

// --- Arrow class and arrow array ---
class Arrow {
    constructor(x, y, target, damage, isEnemy = false) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.damage = damage;
        this.speed = 8;
        this.active = true;
        this.isEnemy = isEnemy; // true if fired by enemy
    }

    move() {
        if (!this.target.isAlive()) {
            this.active = false;
            return;
        }
        // Target center
        const tx = this.target.x;
        const ty = this.target.y + UNIT_SIZE / 2;
        // Direction vector
        const dx = tx - this.x;
        const dy = ty - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.speed) {
            this.x = tx;
            this.y = ty;
        } else {
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }
        // Check collision
        if (
            Math.abs(this.x - tx) < 8 &&
            Math.abs(this.y - ty) < UNIT_SIZE / 2
        ) {
            this.target.hp -= this.damage;
            this.active = false;
        }
    }
}

const arrows = [];

// --- Move and draw arrows ---
function updateArrows() {
    for (const arrow of arrows) {
        if (arrow.active) arrow.move();
    }
    // Remove inactive arrows
    for (let i = arrows.length - 1; i >= 0; i--) {
        if (!arrows[i].active) arrows.splice(i, 1);
    }
}

function drawArrows() {
    for (const arrow of arrows) {
        ctx.fillStyle = arrow.isEnemy ? "purple" : "brown";
        ctx.fillRect(arrow.x - cameraX, arrow.y - 2, 12, 4);
    }
}

// --- Drawing functions ---
const grassImg = new Image();
grassImg.src = "images/landscape01.png";

function drawField() {
    if (grassImg.complete && grassImg.naturalWidth > 0) {
        // Draw the visible part of the stretched background
        ctx.drawImage(
            grassImg,
            cameraX * (grassImg.naturalWidth / MAP_WIDTH), // source x in image
            0,
            canvas.width * (grassImg.naturalWidth / MAP_WIDTH), // source width in image
            grassImg.naturalHeight, // source height in image
            0,
            0,
            canvas.width,
            canvas.height
        );
    } else {
        ctx.fillStyle = "#4caf50";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function drawTown() {
    ctx.fillStyle = "#888";
    ctx.fillRect(town.x - cameraX, town.y, UNIT_SIZE, UNIT_SIZE);
    ctx.fillStyle = "black";
    ctx.fillText("HP: " + town.hp, town.x - cameraX, town.y - 10);
}

function drawEnemyTown() {
    ctx.fillStyle = "#a33";
    ctx.fillRect(enemyTown.x - cameraX, enemyTown.y, UNIT_SIZE, UNIT_SIZE);
    ctx.fillStyle = "black";
    ctx.fillText("HP: " + enemyTown.hp, enemyTown.x - cameraX, enemyTown.y - 10);
}

function drawUnits() {
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    for (const unit of town.units) {
        ctx.fillStyle = unit instanceof Archer ? "orange" : unit instanceof Cavalry ? "blue" : "gray";
        ctx.fillRect(unit.x - cameraX, unit.y, UNIT_SIZE, UNIT_SIZE);
        ctx.fillStyle = "black";
        // Draw name
        ctx.fillText(
            unit.name,
            unit.x - cameraX + UNIT_SIZE / 2,
            unit.y + UNIT_SIZE / 2
        );
        // Draw HP below name
        ctx.fillStyle = "green";
        ctx.fillText(
            "HP: " + unit.hp,
            unit.x - cameraX + UNIT_SIZE / 2,
            unit.y + UNIT_SIZE / 2 + 16
        );
    }
    ctx.textAlign = "left";
}

function drawEnemies() {
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    for (const enemy of enemies) {
        ctx.fillStyle = "red";
        ctx.fillRect(enemy.x - cameraX, enemy.y, UNIT_SIZE, UNIT_SIZE);
        ctx.fillStyle = "black";
        // Draw name
        ctx.fillText(
            enemy.name,
            enemy.x - cameraX + UNIT_SIZE / 2,
            enemy.y + UNIT_SIZE / 2
        );
        // Draw HP below name
        ctx.fillStyle = "green";
        ctx.fillText(
            "HP: " + enemy.hp,
            enemy.x - cameraX + UNIT_SIZE / 2,
            enemy.y + UNIT_SIZE / 2 + 16
        );
    }
    ctx.textAlign = "left";
}

function drawGold() {
    ctx.fillStyle = "yellow";
    ctx.font = "20px Arial";
    ctx.fillText("Gold: " + town.gold, 20, 30);
}

function drawBuyMenu() {
    const btns = [
        { label: "Soldier (50)", type: "soldier" },
        { label: "Archer (70)", type: "archer" },
        { label: "Cavalry (100)", type: "cavalry" }
    ];
    const btnWidth = 120, btnHeight = 40, spacing = 10;
    const y = canvas.height - btnHeight - 10;
    let x = 20;

    // Store button hitboxes for click detection
    window.buyButtons = [];

    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    for (const btn of btns) {
        ctx.fillStyle = "#333";
        ctx.fillRect(x, y, btnWidth, btnHeight);
        ctx.fillStyle = "white";
        ctx.fillText(btn.label, x + btnWidth / 2, y + btnHeight / 2 + 6);
        window.buyButtons.push({ x, y, w: btnWidth, h: btnHeight, type: btn.type });
        x += btnWidth + spacing;
    }
    ctx.textAlign = "left";
}

function updatePositions() {
    // Move units and enemies
    for (const unit of town.units) {
        if (!(unit instanceof Archer)) unit.move();
        // Archers move in handleCombat if no enemy in range
    }
    for (const enemy of enemies) {
        enemy.move();
    }
}

// --- In gameLoop, call updateArrows and drawArrows ---
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawField();
    drawTown();
    drawEnemyTown(); // <-- Add this line
    drawUnits();
    drawEnemies();
    drawGold();
    drawBuyMenu();
    handleCombat();
    updateArrows();
    drawArrows();
    updatePositions();

    // Game over
    if (!town.isAlive()) {
        ctx.fillStyle = "red";
        ctx.font = "40px Arial";
        ctx.fillText("Game Over! The town has been destroyed.", 50, canvas.height / 2);
        return;
    }

    requestAnimationFrame(gameLoop);
}

setInterval(spawnEnemy, enemySpawnInterval);
gameLoop();

canvas.addEventListener("click", function(e) {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    if (window.buyButtons) {
        for (const btn of window.buyButtons) {
            if (
                mx >= btn.x && mx <= btn.x + btn.w &&
                my >= btn.y && my <= btn.y + btn.h
            ) {
                town.recruit(btn.type);
                break;
            }
        }
    }
});

// Optional: Touch support for mobile
canvas.addEventListener("touchend", function(e) {
    if (!window.buyButtons) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.changedTouches[0];
    const mx = touch.clientX - rect.left;
    const my = touch.clientY - rect.top;
    for (const btn of window.buyButtons) {
        if (
            mx >= btn.x && mx <= btn.x + btn.w &&
            my >= btn.y && my <= btn.y + btn.h
        ) {
            town.recruit(btn.type);
            break;
        }
    }
});