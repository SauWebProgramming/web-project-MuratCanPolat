const botNames = [
    "Terminator", "Vortex", "Nebula", "Shadow", "ProGamer", "Zelda", 
    "Hercules", "Venom", "Spider", "Ghost", "Viper", "Matrix",
    "Zeus", "Hades", "Poseidon", "Helios", "Athena", "Ares", "Apollo",
    "Kratos", "Atreus", "Brok", "Sindri", "Mimir", "Thor", "Odin", "Loki",
    "Hermes", "Tyr","Baldur","Gaia","Cronos"
];

let availableNames = [...botNames];

export default class Bot {
    constructor(worldWidth, worldHeight) {
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        
        this.x = Math.random() * worldWidth;
        this.y = Math.random() * worldHeight;
        
        this.radius = 18 + Math.random() * 10; 
        this.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
        
        if (availableNames.length === 0) {
            availableNames = [...botNames];
        }

        const randomIndex = Math.floor(Math.random() * availableNames.length);

        this.name = availableNames[randomIndex];

        availableNames.splice(randomIndex, 1);

        this.speed = 0;
    }

    update(player, foods, bots) {
        this.speed = 500 / (this.radius * 2 + 120);

        let closestEntity = null;
        let minDist = Infinity;

        const dxP = player.x - this.x;
        const dyP = player.y - this.y;
        const distP = Math.sqrt(dxP*dxP + dyP*dyP);

        if (distP < 500) {
            closestEntity = player;
            minDist = distP;
        }

        if (bots) {
            for (const otherBot of bots) {
                if (otherBot === this) continue;
                const dxB = otherBot.x - this.x;
                const dyB = otherBot.y - this.y;
                const distB = Math.sqrt(dxB*dxB + dyB*dyB);
                if (distB < 500 && distB < minDist) {
                    minDist = distB;
                    closestEntity = otherBot;
                }
            }
        }

        let targetX = this.x;
        let targetY = this.y;

        if (closestEntity) {
            if (closestEntity.radius > this.radius * 1.1) {
                targetX = this.x - (closestEntity.x - this.x);
                targetY = this.y - (closestEntity.y - this.y);
            } else if (this.radius > closestEntity.radius * 1.1) {
                targetX = closestEntity.x;
                targetY = closestEntity.y;
            } else {
                closestEntity = null; 
            }
        }

        if (!closestEntity) {
            let closestFood = null;
            let minFoodDist = Infinity;
            for (const food of foods) {
                const dxF = food.x - this.x;
                const dyF = food.y - this.y;
                const distSq = dxF*dxF + dyF*dyF;
                if (distSq < minFoodDist) {
                    minFoodDist = distSq;
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

        let fontSize = Math.max(14, this.radius * 0.6); 
        
        if(this.name.length > 10) { fontSize *= 0.85; }

        ctx.font = `800 ${fontSize}px 'Poppins'`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.lineWidth = Math.max(2, fontSize * 0.1);
        ctx.strokeStyle = '#1a1a1a';
        ctx.strokeText(this.name, this.x, this.y);

        ctx.fillStyle = '#ffffff';
        ctx.fillText(this.name, this.x, this.y);
    }
}