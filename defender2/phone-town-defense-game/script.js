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
    }
}

class EnemyArcher extends Enemy {
    constructor(x, y) {
        super("Enemy Archer", x, y, 80, 25, 5);
    }
}

class EnemyCavalry extends Enemy {
    constructor(x, y) {
        super("Enemy Cavalry", x, y, 120, 15, 15);
    }
}

class Town {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.gold = 100;
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

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const town = new Town(50, canvas.height / 2);
const enemies = [];
let enemySpawnInterval = 2000; // Spawn enemies every 2 seconds

function spawnEnemy() {
    const enemyTypes = [EnemySoldier, EnemyArcher, EnemyCavalry];
    const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    const enemy = new enemyType(canvas.width - 50, Math.random() * canvas.height);
    enemies.push(enemy);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw town
    ctx.fillStyle = "white";
    ctx.fillRect(town.x, town.y, 50, 50);
    ctx.fillText("Town", town.x + 5, town.y + 25);

    // Update and draw units
    for (const unit of town.units) {
        unit.move();
        ctx.fillRect(unit.x, unit.y, 50, 50);
        ctx.fillText(unit.name, unit.x + 5, unit.y + 25);
    }

    // Update and draw enemies
    for (const enemy of enemies) {
        enemy.move();
        ctx.fillRect(enemy.x, enemy.y, 50, 50);
        ctx.fillText(enemy.name, enemy.x + 5, enemy.y + 25);
        
        // Check if enemy reaches the town
        if (enemy.x <= town.x + 50) {
            // Attack the town
            town.hp -= enemy.attack;
            if (!town.isAlive()) {
                alert("Game Over! The town has been destroyed.");
                document.location.reload();
            }
        }
    }

    requestAnimationFrame(gameLoop);
}

setInterval(spawnEnemy, enemySpawnInterval);
gameLoop();