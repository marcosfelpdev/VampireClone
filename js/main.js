// Canvas
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 600;

// Teclado
const keys = {};

window.addEventListener("keydown",(e)=>{

    keys[e.key.toLowerCase()] = true;

});

window.addEventListener("keyup",(e)=>{

    keys[e.key.toLowerCase()] = false;

});

// Jogador
const player = new Player(
    canvas.width/2,
    canvas.height/2
);

// Atualização
function update(){

    player.update(keys);

}

// Desenho
function draw(){

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    player.draw(ctx);

}

// Loop
function gameLoop(){

    update();

    draw();

    requestAnimationFrame(gameLoop);

}

gameLoop();