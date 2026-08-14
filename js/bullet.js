class Bullet {

    constructor(
        x,
        y,
        target,
        speed,
        damage,
        radius
    ) {

        this.x = x;
        this.y = y;

        this.speed = speed;
        this.damage = damage;
        this.radius = radius;

        this.color = "#FFFFFF";

        this.remove = false;


        const dx =
            target.x - x;

        const dy =
            target.y - y;


        const distance =
            Math.hypot(dx, dy);


        this.directionX = 0;
        this.directionY = 0;


        if (distance > 0) {

            this.directionX =
                dx / distance;

            this.directionY =
                dy / distance;

        }

    }


    update() {

        this.x +=
            this.directionX *
            this.speed;

        this.y +=
            this.directionY *
            this.speed;

    }


    draw(ctx) {

        ctx.fillStyle =
            this.color;

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