export default class Food {
    constructor(worldWidth, worldHeight) {
        this.x = Math.random() * worldWidth;
        this.y = Math.random() * worldHeight;
        
        this.radius = 5;
        
        const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#F3FF33', '#00FFFF'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}