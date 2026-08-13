// Canvas
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 600;


// Teclado
const keys = {};

window.addEventListener("keydown", (e) => {

    keys[e.key.toLowerCase()] = true;

});

window.addEventListener("keyup", (e) => {

    keys[e.key.toLowerCase()] = false;

});


// Jogador
const player = new Player(
    canvas.width / 2,
    canvas.height / 2
);


// Inimigos
const enemies = [];


// Cria um inimigo
function createEnemy() {

    const side = Math.floor(Math.random() * 4);

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


    enemies.push(
        new Enemy(x, y)
    );

}


// Cria alguns inimigos inicialmente
createEnemy();
createEnemy();
createEnemy();


// Atualização
function update() {

    // Jogador
    player.update(keys, canvas);


    // Inimigos
    for (const enemy of enemies) {

        enemy.update(player);

    }

}


// Desenho
function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Inimigos
    for (const enemy of enemies) {

        enemy.draw(ctx);

    }


    // Jogador
    player.draw(ctx);

}


// Loop principal
function gameLoop() {

    update();

    draw();

    requestAnimationFrame(gameLoop);

}


gameLoop();