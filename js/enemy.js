class Enemy {

    constructor(x, y) {

        this.x = x;
        this.y = y;

        this.radius = 15;
        this.speed = 1.5;
        this.color = "#FF4444";

        this.health = 3;
    }

    update(player) {

        const dx = player.x - this.x;
        const dy = player.y - this.y;

        const distance = Math.hypot(dx, dy);

        if (distance > 0) {

            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }
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