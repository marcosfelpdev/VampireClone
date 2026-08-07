class Player{

    constructor(x,y){

        this.x = x;
        this.y = y;

        this.radius = 20;

        this.speed = 4;

        this.color = "#00D9FF";

    }

    update(keys){

        if(keys["w"])
            this.y -= this.speed;

        if(keys["s"])
            this.y += this.speed;

        if(keys["a"])
            this.x -= this.speed;

        if(keys["d"])
            this.x += this.speed;

    }

    draw(ctx){

        ctx.fillStyle = this.color;

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI*2
        );

        ctx.fill();

    }

}