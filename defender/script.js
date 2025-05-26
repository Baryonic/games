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
        this.type = "soldier";
    }
}

class Archer extends Unit {
    constructor(x, y) {
        super("Archer", x, y, 80, 25, 5);
        this.arrowCooldown = 0;
        this.range = 220; // Set archer's range (in pixels)
        this.type = "archer";
    }
}

class Cavalry extends Unit {
    constructor(x, y) {
        super("Cavalry", x, y, 120, 15, 15);
        this.type = "knight";
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
class Archery {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = UNIT_SIZE;
        this.height = UNIT_SIZE;
        this.spawnTimer = 0;
        this.active = true;
    }

    update() {
        this.spawnTimer++;
        if (this.spawnTimer >= 120) { // 2 seconds at 60fps
            town.units.push(new Archer(this.x + this.width, getRandomRowY()));
            this.spawnTimer = 0;
        }
    }

    draw(ctx) {
        if (archeryImg.complete && archeryImg.naturalWidth > 0) {
            ctx.drawImage(
                archeryImg,
                this.x - cameraX,
                this.y,
                this.width,
                this.height
            );
        } else {
            ctx.fillStyle = "#b8860b";
            ctx.fillRect(this.x - cameraX, this.y, this.width, this.height);
        }
        ctx.fillStyle = "black";
        ctx.font = "14px Arial";
        ctx.fillText(
            "Archery",
            this.x - cameraX + this.width / 2,
            this.y + this.height / 2 + 5
        );
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
        const costs = { soldier: 50, archer: 70, cavalry: 100 };
        if (this.gold < costs[unitType]) return;
        this.gold -= costs[unitType];
        let unit;
        if (unitType === "soldier") unit = new Soldier(this.x + UNIT_SIZE, getRandomRowY());
        if (unitType === "archer") unit = new Archer(this.x + UNIT_SIZE, getRandomRowY());
        if (unitType === "cavalry") unit = new Cavalry(this.x + UNIT_SIZE, getRandomRowY());
        this.units.push(unit);
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
Town.prototype.isAlive = function () { return this.hp > 0; };

let archery = null;

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

// --- Enemy spawn in random row ---
function spawnEnemy() {
    const enemyTypes = [EnemySoldier, EnemyArcher, EnemyCavalry];
    const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    const enemy = new enemyType(MAP_WIDTH - 50, getRandomRowY());
    enemies.push(enemy);
}

// --- Implement fighting logic between units ---
function handleCombat() {
    // Allied units logic
    for (let i = town.units.length - 1; i >= 0; i--) {
        const unit = town.units[i];

        // --- Treat enemy town as a valid enemy target ---
        // If close enough to enemy town, attack it as if it were a unit
        const closeToEnemyTown =
            unit.x + UNIT_SIZE > enemyTown.x && // right edge passes town's left edge
            unit.x < enemyTown.x + UNIT_SIZE && // left edge before town's right edge
            Math.abs(unit.y - enemyTown.y) < UNIT_SIZE;

        if (closeToEnemyTown && enemyTown.isAlive()) {
            if (unit instanceof Archer) {
                // Stop at the edge and shoot at the town
                unit.x = Math.min(unit.x, enemyTown.x - UNIT_SIZE); // Stop right before the town
                if (unit.arrowCooldown > 0) {
                    unit.arrowCooldown--;
                    continue;
                }
                // Only fire if no arrow already in flight from this archer to the town
                let alreadyFiring = arrows.some(
                    a => a.active && a.target === enemyTown && a.x === unit.x + UNIT_SIZE
                );
                if (!alreadyFiring) {
                    arrows.push(new Arrow(unit.x + UNIT_SIZE, unit.y + UNIT_SIZE / 2, enemyTown, unit.attack));
                    unit.arrowCooldown = 30;
                }
                continue;
            } else {
                // Melee/cavalry attack the town as if it were a unit
                unit.attackEnemy(enemyTown);
                if (enemyTown.isAlive()) {
                    // Town "fights back" (optional: adjust attack/defense as desired)
                    enemyTown.attackEnemy(unit);
                }
                // Remove unit if dead
                if (!unit.isAlive()) {
                    town.units.splice(i, 1);
                }
                continue;
            }
        }

        if (unit instanceof Archer) {
            if (unit.arrowCooldown > 0) {
                unit.arrowCooldown--;
                continue;
            }
            let targets = enemies.filter(
                enemy =>
                    Math.abs(unit.y - enemy.y) < ROW_HEIGHT * 1.5 &&
                    enemy.isAlive() &&
                    Math.abs(unit.x - enemy.x) <= unit.range
            );
            if (targets.length > 0) {
                let target = targets.reduce((a, b) => Math.abs(unit.x - a.x) < Math.abs(unit.x - b.x) ? a : b);
                let alreadyFiring = arrows.some(
                    a => a.active && a.x === unit.x + UNIT_SIZE && a.y === unit.y && a.target === target
                );
                if (!alreadyFiring) {
                    arrows.push(new Arrow(unit.x + UNIT_SIZE, unit.y + UNIT_SIZE / 2, target, unit.attack));
                    unit.arrowCooldown = 30;
                }
            } else {
                unit.move();
            }
        } else {
            let target = enemies.find(
                enemy =>
                    Math.abs(unit.y - enemy.y) < ROW_HEIGHT * 1.5 &&
                    Math.abs(unit.x - enemy.x) < UNIT_SIZE * 1.5
            );
            if (target) {
                if (Math.abs(unit.y - target.y) >= ROW_HEIGHT / 2) {
                    if (unit.y < target.y) unit.y += Math.min(4, target.y - unit.y);
                    else if (unit.y > target.y) unit.y -= Math.min(4, unit.y - target.y);
                } else {
                    unit.attackEnemy(target);
                    if (target.isAlive()) target.attackEnemy(unit);
                }
            } else {
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
            let targets = town.units.filter(
                unit =>
                    Math.abs(unit.y - enemy.y) < ROW_HEIGHT * 1.5 &&
                    unit.isAlive() &&
                    Math.abs(unit.x - enemy.x) <= enemy.range
            );
            if (targets.length > 0) {
                let target = targets.reduce((a, b) => Math.abs(enemy.x - a.x) < Math.abs(enemy.x - b.x) ? a : b);
                let alreadyFiring = arrows.some(
                    a => a.active && a.x === enemy.x && a.y === enemy.y + UNIT_SIZE / 2 && a.target === target && a.isEnemy
                );
                if (!alreadyFiring) {
                    arrows.push(new Arrow(enemy.x, enemy.y + UNIT_SIZE / 2, target, enemy.attack, true));
                    enemy.arrowCooldown = 30;
                }
            } else {
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

// Preload unit images
const unitImages = {
    soldier: new Image(),
    knight: new Image(),
    archer: new Image()
};
unitImages.soldier.src = "images/soldier.png";
unitImages.knight.src = "images/knight.png";
unitImages.archer.src = "images/archer.png";

// Preload enemy unit images
const enemyUnitImages = {
    soldier: new Image(),
    knight: new Image(),
    archer: new Image()
};
enemyUnitImages.soldier.src = "images/soldier_alien.png";
enemyUnitImages.knight.src = "images/knight_alien.png";
enemyUnitImages.archer.src = "images/archer_alien.png";

const archeryImg = new Image();
archeryImg.src = "images/archery.png";

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
        let img = null;
        if (unit.type === "soldier") img = unitImages.soldier;
        else if (unit.type === "archer") img = unitImages.archer;
        else if (unit.type === "knight") img = unitImages.knight;
        if (img && img.complete && img.naturalWidth > 0) {
            ctx.drawImage(img, unit.x - cameraX, unit.y, UNIT_SIZE, UNIT_SIZE);
        } else {
            ctx.fillStyle = "gray";
            ctx.fillRect(unit.x - cameraX, unit.y, UNIT_SIZE, UNIT_SIZE);
        }
        // Draw HP bar below unit
        const maxHp = unit instanceof Soldier ? 100 : unit instanceof Archer ? 80 : unit instanceof Cavalry ? 120 : 100;
        const barWidth = UNIT_SIZE;
        const barHeight = 6;
        const hpRatio = Math.max(0, unit.hp / maxHp);
        ctx.fillStyle = "#444";
        ctx.fillRect(unit.x - cameraX, unit.y + UNIT_SIZE - 8, barWidth, barHeight);
        ctx.fillStyle = "limegreen";
        ctx.fillRect(unit.x - cameraX, unit.y + UNIT_SIZE - 8, barWidth * hpRatio, barHeight);
        ctx.strokeStyle = "#222";
        ctx.strokeRect(unit.x - cameraX, unit.y + UNIT_SIZE - 8, barWidth, barHeight);
    }
    ctx.textAlign = "left";
}

function drawEnemies() {
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    for (const enemy of enemies) {
        let img = null;
        if (enemy instanceof EnemySoldier) img = enemyUnitImages.soldier;
        else if (enemy instanceof EnemyArcher) img = enemyUnitImages.archer;
        else if (enemy instanceof EnemyCavalry) img = enemyUnitImages.knight;
        if (img && img.complete && img.naturalWidth > 0) {
            // Draw mirrored (flipped horizontally) for left-moving units
            ctx.save();
            ctx.translate(enemy.x - cameraX + UNIT_SIZE / 2, enemy.y + UNIT_SIZE / 2);
            ctx.scale(-1, 1); // Mirror horizontally
            ctx.drawImage(
                img,
                -UNIT_SIZE / 2,
                -UNIT_SIZE / 2,
                UNIT_SIZE,
                UNIT_SIZE
            );
            ctx.restore();
        } else {
            ctx.fillStyle = "red";
            ctx.fillRect(enemy.x - cameraX, enemy.y, UNIT_SIZE, UNIT_SIZE);
        }
        // Draw HP bar below enemy
        const maxHp = enemy instanceof EnemySoldier ? 100 : enemy instanceof EnemyArcher ? 80 : enemy instanceof EnemyCavalry ? 120 : 100;
        const barWidth = UNIT_SIZE;
        const barHeight = 6;
        const hpRatio = Math.max(0, enemy.hp / maxHp);
        ctx.fillStyle = "#444";
        ctx.fillRect(enemy.x - cameraX, enemy.y + UNIT_SIZE - 8, barWidth, barHeight);
        ctx.fillStyle = "red";
        ctx.fillRect(enemy.x - cameraX, enemy.y + UNIT_SIZE - 8, barWidth * hpRatio, barHeight);
        ctx.strokeStyle = "#222";
        ctx.strokeRect(enemy.x - cameraX, enemy.y + UNIT_SIZE - 8, barWidth, barHeight);
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
        { label: "Cavalry (100)", type: "cavalry" },
        { label: "Archery (700)", type: "archery_building" }
    ];
    const btnWidth = 160, btnHeight = 60, spacing = 20;
    const y = canvas.height - btnHeight - 20;
    let x = 30;

    window.buyButtons = [];

    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    for (const btn of btns) {
        ctx.fillStyle = "#333";
        ctx.fillRect(x, y, btnWidth, btnHeight);
        ctx.fillStyle = "white";
        ctx.fillText(btn.label, x + btnWidth / 2, y + btnHeight / 2 + 8);
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
    drawEnemyTown();
    if (archery) {
        archery.update();
        archery.draw(ctx);
    }
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

canvas.addEventListener("click", function (e) {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    if (window.buyButtons) {
        for (const btn of window.buyButtons) {
            if (
                mx >= btn.x && mx <= btn.x + btn.w &&
                my >= btn.y && my <= btn.y + btn.h
            ) {
                if (btn.type === "archery_building") {
                    if (!archery && town.gold >= 700) {
                        town.gold -= 700;
                        archery = new Archery(town.x, town.y + UNIT_SIZE + 10);
                    }
                } else {
                    town.recruit(btn.type);
                }
                break;
            }
        }
    }
});

// Optional: Touch support for mobile
canvas.addEventListener("touchend", function (e) {
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
            if (btn.type === "archery_building") {
                if (!archery && town.gold >= 700) {
                    town.gold -= 700;
                    archery = new Archery(town.x, town.y + UNIT_SIZE + 10);
                }
            } else {
                town.recruit(btn.type);
            }
            break;
        }
    }
});