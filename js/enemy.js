class Enemy {

    constructor(x, y) {

        this.x = x;
        this.y = y;
        this.radius = 15;
        this.speed = 1.5;
        this.color = "#e74c3c";

    }

    update(player) {

        // Descobre a distância até o jogador
        const dx = player.x - this.x;
        const dy = player.y - this.y;

        const distance = Math.hypot(dx, dy);

        // Evita divisão por zero
        if (distance === 0)
            return;

        // Normaliza a direção
        const directionX = dx / distance;
        const directionY = dy / distance;

        // Move o inimigo em direção ao jogador
        this.x += directionX * this.speed;
        this.y += directionY * this.speed;

    }

    draw(ctx) {

        ctx.fillStyle = this.color;

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();

    }

}