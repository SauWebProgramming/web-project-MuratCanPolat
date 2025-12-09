export default class Bot {
    constructor(worldWidth, worldHeight) {
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.x = Math.random() * worldWidth;
        this.y = Math.random() * worldHeight;
        
        /* Botlar farklı büyüklüklerde başlasın */
        this.radius = 15 + Math.random() * 20; 
        
        this.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
        
        const botNames = [
        "Terminator", "Vortex", "Nebula", "Shadow", "ProGamer", 
        "NoobMaster", "AgarKing", "Zelda", "Goku", "Piccolo", 
        "Venom", "Spider", "Ghost", "Viper", "Matrix",
        "Soap", "Yasuo", "Slayer", "Titan", "Monster"
    ];
    this.name = botNames[Math.floor(Math.random() * botNames.length)];
    }

    update(player, foods) {
        // Hız formülü
        this.speed = 500 / (this.radius + 120);
        
        let targetX = this.x;
        let targetY = this.y;
        
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distToPlayer = Math.sqrt(dx*dx + dy*dy);
        
        if (distToPlayer < 400) {
            if (player.radius > this.radius * 1.1) {
                targetX = this.x - dx;
                targetY = this.y - dy;
            } else if (this.radius > player.radius * 1.1) {
                targetX = player.x;
                targetY = player.y;
            }
        } else {
            let closestFood = null;
            let minDist = Infinity;
            for (const food of foods) {
                const fDx = food.x - this.x;
                const fDy = food.y - this.y;
                const dist = fDx*fDx + fDy*fDy; 
                
                if (dist < minDist) {
                    minDist = dist;
                    closestFood = food;
                }
            }

            if (closestFood) {
                targetX = closestFood.x;
                targetY = closestFood.y;
            }
        }

        const moveDx = targetX - this.x;
        const moveDy = targetY - this.y;
        const angle = Math.atan2(moveDy, moveDx);
        
        this.x += Math.cos(angle) * this.speed;
        this.y += Math.sin(angle) * this.speed;

        this.x = Math.max(this.radius, Math.min(this.worldWidth - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(this.worldHeight - this.radius, this.y));
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();

        const fontSize = Math.max(12, this.radius / 1.5);
        ctx.fillStyle = 'white';
        ctx.font = `bold ${fontSize}px Poppins`;
        ctx.textAlign = 'center';
        ctx.fillText(this.name, this.x, this.y);
    }
}