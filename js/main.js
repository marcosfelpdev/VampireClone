// =========================
// CANVAS
// =========================

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
// ARRAYS
// =========================

const enemies = [];
const bullets = [];


// =========================
// TIRO
// =========================

let shootTimer = 0;
let shootDelay = 30;


// =========================
// ROUNDS
// =========================

let round = 1;
let enemiesPerRound = 5;


// =========================
// ESTADOS DO JOGO
// =========================

let choosingUpgrade = false;
let gameOver = false;


// =========================
// CRIAR INIMIGO
// =========================

function createEnemy() {

    const side = Math.floor(
        Math.random() * 4
    );

    let x;
    let y;


    // Cima
    if (side === 0) {

        x = Math.random() * canvas.width;
        y = -30;

    }

    // Direita
    else if (side === 1) {

        x = canvas.width + 30;
        y = Math.random() * canvas.height;

    }

    // Baixo
    else if (side === 2) {

        x = Math.random() * canvas.width;
        y = canvas.height + 30;

    }

    // Esquerda
    else {

        x = -30;
        y = Math.random() * canvas.height;

    }


    // Vida aumenta a cada 3 rounds
    const enemyHealth =
        3 +
        Math.floor(
            (round - 1) / 3
        );


    // Velocidade aumenta um pouco
    // a cada round
    const enemySpeed =
        1.5 +
        (round - 1) * 0.05;


    enemies.push(
        new Enemy(
            x,
            y,
            enemyHealth,
            enemySpeed
        )
    );
}


// =========================
// INICIAR ROUND
// =========================

function startRound() {

    for (
        let i = 0;
        i < enemiesPerRound;
        i++
    ) {

        createEnemy();

    }

}


// =========================
// ENCONTRAR INIMIGO MAIS PRÓXIMO
// =========================

function getNearestEnemy() {

    let nearestEnemy = null;
    let nearestDistance = Infinity;


    enemies.forEach(enemy => {

        const dx =
            enemy.x - player.x;

        const dy =
            enemy.y - player.y;


        const distance =
            Math.hypot(dx, dy);


        if (
            distance <
            nearestDistance
        ) {

            nearestDistance =
                distance;

            nearestEnemy =
                enemy;

        }

    });


    return nearestEnemy;
}


// =========================
// ESCOLHER UPGRADE
// =========================

function chooseUpgrade(option) {

    // =====================
    // OPÇÃO 1
    // VELOCIDADE
    // =====================

    if (option === 1) {

        player.speed += 0.5;

    }


    // =====================
    // OPÇÃO 2
    // VIDA
    // =====================

    else if (option === 2) {

        player.maxHealth += 20;

        player.health += 20;


        // Evita ultrapassar
        // a vida máxima
        if (
            player.health >
            player.maxHealth
        ) {

            player.health =
                player.maxHealth;

        }

    }


    // =====================
    // OPÇÃO 3
    // CADÊNCIA
    // =====================

    else if (option === 3) {

        shootDelay -= 3;


        // Limite mínimo
        // da velocidade de disparo
        if (shootDelay < 10) {

            shootDelay = 10;

        }

    }


    // Sai da tela de upgrade
    choosingUpgrade = false;


    // Avança o round
    round++;


    // Aumenta quantidade
    // de inimigos
    enemiesPerRound += 3;


    // Reinicia o contador
    // de tiro
    shootTimer = 0;


    // Começa próxima horda
    startRound();

}


// =========================
// EVENTO DAS OPÇÕES
// DE UPGRADE
// =========================

window.addEventListener(
    "keydown",
    (e) => {

        if (!choosingUpgrade) {
            return;
        }


        if (e.key === "1") {

            chooseUpgrade(1);

        }

        else if (e.key === "2") {

            chooseUpgrade(2);

        }

        else if (e.key === "3") {

            chooseUpgrade(3);

        }

    }
);


// =========================
// UPDATE
// =========================

function update() {

    // =====================
    // GAME OVER
    // =====================

    if (gameOver) {
        return;
    }


    // =====================
    // TELA DE UPGRADE
    // =====================

    if (choosingUpgrade) {
        return;
    }


    // =====================
    // JOGADOR
    // =====================

    player.update(
        keys,
        canvas
    );


    // =====================
    // INIMIGOS
    // =====================

    enemies.forEach(enemy => {

        enemy.update(player);

    });


    // =====================
    // COLISÃO
    // INIMIGO x JOGADOR
    // =====================

    for (const enemy of enemies) {

        const dx =
            enemy.x - player.x;

        const dy =
            enemy.y - player.y;


        const distance =
            Math.hypot(dx, dy);


        if (
            distance <
            enemy.radius +
            player.radius
        ) {

            player.takeDamage(10);

        }

    }


    // =====================
    // TIRO AUTOMÁTICO
    // =====================

    shootTimer++;


    if (
        shootTimer >= shootDelay &&
        enemies.length > 0
    ) {

        const target =
            getNearestEnemy();


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


    // =====================
    // ATUALIZA TIROS
    // =====================

    bullets.forEach(bullet => {

        bullet.update();

    });


    // =====================
    // COLISÃO
    // TIRO x INIMIGO
    // =====================

    for (const bullet of bullets) {

        for (const enemy of enemies) {

            const dx =
                bullet.x - enemy.x;

            const dy =
                bullet.y - enemy.y;


            const distance =
                Math.hypot(dx, dy);


            if (
                distance <
                bullet.radius +
                enemy.radius
            ) {

                enemy.health--;

                bullet.remove = true;

                break;

            }

        }

    }


    // =====================
    // REMOVE INIMIGOS MORTOS
    // =====================

    for (
        let i = enemies.length - 1;
        i >= 0;
        i--
    ) {

        if (
            enemies[i].health <= 0
        ) {

            enemies.splice(
                i,
                1
            );

        }

    }


    // =====================
    // REMOVE TIROS
    // =====================

    for (
        let i = bullets.length - 1;
        i >= 0;
        i--
    ) {

        const bullet =
            bullets[i];


        const outside =
            bullet.x < 0 ||
            bullet.x > canvas.width ||
            bullet.y < 0 ||
            bullet.y > canvas.height;


        if (
            bullet.remove ||
            outside
        ) {

            bullets.splice(
                i,
                1
            );

        }

    }


    // =====================
    // GAME OVER
    // =====================

    if (
        player.health <= 0
    ) {

        gameOver = true;

        return;

    }


    // =====================
    // FIM DO ROUND
    // =====================

    if (
        enemies.length === 0
    ) {

        // Remove tiros que ainda
        // estavam voando
        bullets.length = 0;

        choosingUpgrade = true;

    }

}


// =========================
// DRAW
// =========================

function draw() {

    // =====================
    // LIMPA CANVAS
    // =====================

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // =====================
    // JOGADOR
    // =====================

    player.draw(ctx);


    // =====================
    // INIMIGOS
    // =====================

    enemies.forEach(enemy => {

        enemy.draw(ctx);

    });


    // =====================
    // TIROS
    // =====================

    bullets.forEach(bullet => {

        bullet.draw(ctx);

    });


    // =====================
    // HUD
    // =====================

    ctx.fillStyle = "white";

    ctx.font = "20px Arial";

    ctx.textAlign = "left";


    ctx.fillText(
        "Round: " + round,
        20,
        30
    );


    ctx.fillText(
        "Inimigos: " +
        enemies.length,
        20,
        60
    );


    ctx.fillText(
        "Vida: " +
        player.health +
        " / " +
        player.maxHealth,
        20,
        90
    );


    // =====================
    // TELA DE UPGRADE
    // =====================

    if (choosingUpgrade) {

        // Fundo escuro
        ctx.fillStyle =
            "rgba(0, 0, 0, 0.75)";


        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        // Título
        ctx.fillStyle = "white";

        ctx.textAlign = "center";

        ctx.font = "36px Arial";


        ctx.fillText(
            "Escolha um Upgrade",
            canvas.width / 2,
            150
        );


        // =================
        // OPÇÃO 1
        // =================

        ctx.font = "24px Arial";


        ctx.fillText(
            "1 - Velocidade +0.5",
            canvas.width / 2,
            240
        );


        // =================
        // OPÇÃO 2
        // =================

        ctx.fillText(
            "2 - Vida Máxima +20",
            canvas.width / 2,
            310
        );


        // =================
        // OPÇÃO 3
        // =================

        ctx.fillText(
            "3 - Cadência de Tiro",
            canvas.width / 2,
            380
        );


        // Instrução
        ctx.font = "18px Arial";


        ctx.fillText(
            "Pressione 1, 2 ou 3",
            canvas.width / 2,
            460
        );

    }


    // =====================
    // GAME OVER
    // =====================

    if (gameOver) {

        ctx.fillStyle =
            "rgba(0, 0, 0, 0.75)";


        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        ctx.fillStyle = "white";

        ctx.textAlign = "center";

        ctx.font = "50px Arial";


        ctx.fillText(
            "GAME OVER",
            canvas.width / 2,
            canvas.height / 2
        );


        ctx.font = "22px Arial";


        ctx.fillText(
            "Round alcançado: " +
            round,
            canvas.width / 2,
            canvas.height / 2 + 50
        );

    }


    // Volta para o alinhamento padrão
    ctx.textAlign = "left";

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
// INÍCIO DO JOGO
// =========================

startRound();

gameLoop();