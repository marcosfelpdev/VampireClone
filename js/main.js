// =========================
// CANVAS
// =========================

const canvas =
    document.getElementById("game");

const ctx =
    canvas.getContext("2d");


canvas.width = 900;
canvas.height = 600;


// =========================
// TECLADO
// =========================

const keys = {};


window.addEventListener(
    "keydown",
    (e) => {

        keys[
            e.key.toLowerCase()
        ] = true;

    }
);


window.addEventListener(
    "keyup",
    (e) => {

        keys[
            e.key.toLowerCase()
        ] = false;

    }
);


// =========================
// JOGADOR
// =========================

const player =
    new Player(
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
// ESTADOS
// =========================

let choosingUpgrade = false;

let gameOver = false;


// =========================
// UPGRADES SORTEADOS
// =========================

let upgradeChoices = [];


// =========================
// LISTA DE UPGRADES
// =========================

const upgradePool = [

    {

        name: "Passos Rápidos",

        description:
            "Velocidade +0.4",

        apply: function () {

            player.speed += 0.4;

        }

    },


    {

        name: "Vitalidade",

        description:
            "Vida máxima +20",

        apply: function () {

            player.maxHealth += 20;

            player.health += 20;

            if (
                player.health >
                player.maxHealth
            ) {

                player.health =
                    player.maxHealth;

            }

        }

    },


    {

        name: "Recuperação",

        description:
            "Recupera 30 de vida",

        apply: function () {

            player.health += 30;


            if (
                player.health >
                player.maxHealth
            ) {

                player.health =
                    player.maxHealth;

            }

        }

    },


    {

        name: "Tiro Rápido",

        description:
            "Aumenta a cadência",

        apply: function () {

            shootDelay -= 3;


            if (
                shootDelay < 10
            ) {

                shootDelay = 10;

            }

        }

    },


    {

        name: "Munição Poderosa",

        description:
            "Dano do tiro +1",

        apply: function () {

            player.bulletDamage += 1;

        }

    },


    {

        name: "Projétil Veloz",

        description:
            "Velocidade do tiro +1",

        apply: function () {

            player.bulletSpeed += 1;

        }

    },


    {

        name: "Projétil Maior",

        description:
            "Tamanho do tiro +1",

        apply: function () {

            player.bulletSize += 1;

        }

    }

];


// =========================
// SORTEAR UPGRADES
// =========================

function generateUpgradeChoices() {

    upgradeChoices = [];


    // Criamos uma cópia do array
    const available =
        [...upgradePool];


    for (
        let i = 0;
        i < 3;
        i++
    ) {

        const randomIndex =
            Math.floor(
                Math.random() *
                available.length
            );


        upgradeChoices.push(
            available[randomIndex]
        );


        // Remove da lista temporária
        // para não repetir o upgrade
        available.splice(
            randomIndex,
            1
        );

    }

}


// =========================
// ESCOLHER UPGRADE
// =========================

function chooseUpgrade(option) {

    const index =
        option - 1;


    const upgrade =
        upgradeChoices[index];


    if (!upgrade) {

        return;

    }


    // Aplica o upgrade
    upgrade.apply();


    choosingUpgrade =
        false;


    upgradeChoices = [];


    // Próximo round
    round++;


    // Mais inimigos
    enemiesPerRound += 3;


    shootTimer = 0;


    startRound();

}


// =========================
// TECLAS DOS UPGRADES
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
// CRIAR INIMIGO
// =========================

function createEnemy() {

    const side =
        Math.floor(
            Math.random() * 4
        );


    let x;
    let y;


    // Cima
    if (side === 0) {

        x =
            Math.random() *
            canvas.width;

        y = -30;

    }


    // Direita
    else if (side === 1) {

        x =
            canvas.width + 30;

        y =
            Math.random() *
            canvas.height;

    }


    // Baixo
    else if (side === 2) {

        x =
            Math.random() *
            canvas.width;

        y =
            canvas.height + 30;

    }


    // Esquerda
    else {

        x = -30;

        y =
            Math.random() *
            canvas.height;

    }


    // =====================
    // VIDA DO INIMIGO
    // =====================

    const enemyHealth =
        3 +
        Math.floor(
            (round - 1) / 3
        );


    // =====================
    // VELOCIDADE
    // AUMENTA TODO ROUND
    // =====================

    const enemySpeed =
        1.5 +
        (round - 1) * 0.1;


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
// INIMIGO MAIS PRÓXIMO
// =========================

function getNearestEnemy() {

    let nearestEnemy =
        null;

    let nearestDistance =
        Infinity;


    enemies.forEach(
        enemy => {

            const dx =
                enemy.x -
                player.x;

            const dy =
                enemy.y -
                player.y;


            const distance =
                Math.hypot(
                    dx,
                    dy
                );


            if (
                distance <
                nearestDistance
            ) {

                nearestDistance =
                    distance;

                nearestEnemy =
                    enemy;

            }

        }
    );


    return nearestEnemy;

}


// =========================
// COLISÃO ENTRE INIMIGOS
// =========================

function resolveEnemyCollisions() {

    for (
        let i = 0;
        i < enemies.length;
        i++
    ) {

        for (
            let j = i + 1;
            j < enemies.length;
            j++
        ) {

            const enemyA =
                enemies[i];

            const enemyB =
                enemies[j];


            let dx =
                enemyB.x -
                enemyA.x;

            let dy =
                enemyB.y -
                enemyA.y;


            let distance =
                Math.hypot(
                    dx,
                    dy
                );


            const minimumDistance =
                enemyA.radius +
                enemyB.radius;


            // Caso estejam exatamente
            // na mesma posição
            if (distance === 0) {

                dx = 1;
                dy = 0;

                distance = 1;

            }


            if (
                distance <
                minimumDistance
            ) {

                // Quanto eles estão
                // sobrepostos
                const overlap =
                    minimumDistance -
                    distance;


                // Direção da separação
                const directionX =
                    dx / distance;

                const directionY =
                    dy / distance;


                // Cada inimigo anda
                // metade da distância
                const push =
                    overlap / 2;


                enemyA.x -=
                    directionX *
                    push;

                enemyA.y -=
                    directionY *
                    push;


                enemyB.x +=
                    directionX *
                    push;

                enemyB.y +=
                    directionY *
                    push;

            }

        }

    }

}


// =========================
// UPDATE
// =========================

function update() {

    if (gameOver) {

        return;

    }


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
    // MOVIMENTO DOS INIMIGOS
    // =====================

    enemies.forEach(
        enemy => {

            enemy.update(
                player
            );

        }
    );


    // =====================
    // SEPARAÇÃO DOS INIMIGOS
    // =====================

    resolveEnemyCollisions();


    // =====================
    // INIMIGO x JOGADOR
    // =====================

    for (
        const enemy
        of enemies
    ) {

        const dx =
            enemy.x -
            player.x;

        const dy =
            enemy.y -
            player.y;


        const distance =
            Math.hypot(
                dx,
                dy
            );


        if (
            distance <
            enemy.radius +
            player.radius
        ) {

            player.takeDamage(
                10
            );

        }

    }


    // =====================
    // TIRO AUTOMÁTICO
    // =====================

    shootTimer++;


    if (
        shootTimer >=
        shootDelay &&

        enemies.length > 0
    ) {

        const target =
            getNearestEnemy();


        if (target) {

            bullets.push(

                new Bullet(
                    player.x,
                    player.y,
                    target,

                    player.bulletSpeed,

                    player.bulletDamage,

                    player.bulletSize
                )

            );

        }


        shootTimer = 0;

    }


    // =====================
    // MOVIMENTO DOS TIROS
    // =====================

    bullets.forEach(
        bullet => {

            bullet.update();

        }
    );


    // =====================
    // TIRO x INIMIGO
    // =====================

    for (
        const bullet
        of bullets
    ) {

        // Se já acertou alguém,
        // não precisa testar novamente
        if (bullet.remove) {

            continue;

        }


        for (
            const enemy
            of enemies
        ) {

            const dx =
                bullet.x -
                enemy.x;

            const dy =
                bullet.y -
                enemy.y;


            const distance =
                Math.hypot(
                    dx,
                    dy
                );


            if (
                distance <
                bullet.radius +
                enemy.radius
            ) {

                enemy.health -=
                    bullet.damage;


                bullet.remove =
                    true;


                break;

            }

        }

    }


    // =====================
    // REMOVE INIMIGOS
    // =====================

    for (
        let i =
            enemies.length - 1;

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
        let i =
            bullets.length - 1;

        i >= 0;

        i--
    ) {

        const bullet =
            bullets[i];


        const outside =
            bullet.x <
            -bullet.radius ||

            bullet.x >
            canvas.width +
            bullet.radius ||

            bullet.y <
            -bullet.radius ||

            bullet.y >
            canvas.height +
            bullet.radius;


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

        bullets.length = 0;


        // Sorteia 3 novos upgrades
        generateUpgradeChoices();


        choosingUpgrade =
            true;

    }

}


// =========================
// DRAW
// =========================

function draw() {

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

    enemies.forEach(
        enemy => {

            enemy.draw(ctx);

        }
    );


    // =====================
    // TIROS
    // =====================

    bullets.forEach(
        bullet => {

            bullet.draw(ctx);

        }
    );


    // =====================
    // HUD
    // =====================

    ctx.fillStyle =
        "white";

    ctx.font =
        "20px Arial";

    ctx.textAlign =
        "left";


    ctx.fillText(
        "Round: " +
        round,
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
    // UPGRADES
    // =====================

    if (
        choosingUpgrade
    ) {

        ctx.fillStyle =
            "rgba(0, 0, 0, 0.80)";


        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        ctx.fillStyle =
            "white";


        ctx.textAlign =
            "center";


        ctx.font =
            "36px Arial";


        ctx.fillText(
            "Escolha um Upgrade",
            canvas.width / 2,
            120
        );


        ctx.font =
            "22px Arial";


        for (
            let i = 0;
            i < upgradeChoices.length;
            i++
        ) {

            const upgrade =
                upgradeChoices[i];


            const y =
                220 +
                i * 100;


            ctx.fillText(
                (i + 1) +
                " - " +
                upgrade.name,
                canvas.width / 2,
                y
            );


            ctx.font =
                "16px Arial";


            ctx.fillText(
                upgrade.description,
                canvas.width / 2,
                y + 30
            );


            ctx.font =
                "22px Arial";

        }


        ctx.font =
            "17px Arial";


        ctx.fillText(
            "Pressione 1, 2 ou 3",
            canvas.width / 2,
            530
        );

    }


    // =====================
    // GAME OVER
    // =====================

    if (gameOver) {

        ctx.fillStyle =
            "rgba(0, 0, 0, 0.80)";


        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        ctx.fillStyle =
            "white";


        ctx.textAlign =
            "center";


        ctx.font =
            "50px Arial";


        ctx.fillText(
            "GAME OVER",
            canvas.width / 2,
            canvas.height / 2
        );


        ctx.font =
            "22px Arial";


        ctx.fillText(
            "Round alcançado: " +
            round,
            canvas.width / 2,
            canvas.height / 2 + 50
        );

    }


    ctx.textAlign =
        "left";

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
// INÍCIO
// =========================

startRound();

gameLoop();