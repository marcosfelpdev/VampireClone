const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 600;


// =========================
// TECLADO
// =========================

const keys = {};

window.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});


// =========================
// JOGADOR
// =========================

const player = new Player(
    canvas.width / 2,
    canvas.height / 2
);


// =========================
// INIMIGOS
// =========================

const enemies = [];

enemies.push(
    new Enemy(100, 100)
);

enemies.push(
    new Enemy(800, 100)
);

enemies.push(
    new Enemy(100, 500)
);


// =========================
// TIROS
// =========================

const bullets = [];

let shootTimer = 0;


// =========================
// ENCONTRAR INIMIGO MAIS PRÓXIMO
// =========================

function getNearestEnemy() {

    let nearestEnemy = null;

    let nearestDistance = Infinity;

    enemies.forEach(enemy => {

        const dx = enemy.x - player.x;
        const dy = enemy.y - player.y;

        const distance = Math.hypot(dx, dy);

        if (distance < nearestDistance) {

            nearestDistance = distance;

            nearestEnemy = enemy;
        }
    });

    return nearestEnemy;
}


// =========================
// ATUALIZAÇÃO DO JOGO
// =========================

function update() {

    // -------------------------
    // Atualiza jogador
    // -------------------------

    player.update(
        keys,
        canvas
    );


    // -------------------------
    // Atualiza inimigos
    // -------------------------

    enemies.forEach(enemy => {

        enemy.update(player);

    });


    // -------------------------
    // Tiro automático
    // -------------------------

    shootTimer++;

    if (shootTimer >= 30) {

        const target = getNearestEnemy();

        if (target) {

            bullets.push(
                new Bullet(
                    player.x,
                    player.y,
                    target
                )
            );
        }

        shootTimer = 0;
    }


    // -------------------------
    // Atualiza tiros
    // -------------------------

    bullets.forEach(bullet => {

        bullet.update();

    });


    // -------------------------
    // Colisão
    // tiro x inimigo
    // -------------------------

    bullets.forEach(bullet => {

        enemies.forEach(enemy => {

            const dx =
                bullet.x - enemy.x;

            const dy =
                bullet.y - enemy.y;

            const distance =
                Math.hypot(dx, dy);


            if (
                distance <
                bullet.radius + enemy.radius
            ) {

                enemy.health--;

                bullet.remove = true;

            }

        });

    });


    // -------------------------
    // Remove inimigos mortos
    // -------------------------

    for (
        let i = enemies.length - 1;
        i >= 0;
        i--
    ) {

        if (enemies[i].health <= 0) {

            enemies.splice(i, 1);

        }

    }


    // -------------------------
    // Remove tiros
    // -------------------------

    for (
        let i = bullets.length - 1;
        i >= 0;
        i--
    ) {

        const bullet = bullets[i];


        const outside =
            bullet.x < 0 ||
            bullet.x > canvas.width ||
            bullet.y < 0 ||
            bullet.y > canvas.height;


        if (
            bullet.remove ||
            outside
        ) {

            bullets.splice(i, 1);

        }

    }

}


// =========================
// DESENHO DO JOGO
// =========================

function draw() {

    // Limpa o Canvas
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Desenha jogador
    player.draw(ctx);


    // Desenha inimigos
    enemies.forEach(enemy => {

        enemy.draw(ctx);

    });


    // Desenha tiros
    bullets.forEach(bullet => {

        bullet.draw(ctx);

    });

}


// =========================
// GAME LOOP
// =========================

function gameLoop() {

    update();

    draw();

    requestAnimationFrame(
        gameLoop
    );

}


// =========================
// INICIA O JOGO
// =========================

gameLoop();