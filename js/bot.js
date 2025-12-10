// --- İSİM HAVUZU ---
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

        this.targetX = this.x;
        this.targetY = this.y;
        this.decisionTimer = 0;
    }

    update(player, foods, bots) {
        /* Hız dengesini bir türlü ayarlayamadığım için logaritmik bir formüle geçtim.*/
        let calculatedSpeed = 2.5 * Math.pow(35 / this.radius, 0.45);
        /* Büyük oyuncunun aşırı yavaş olmamasını sağlıyor */
        this.speed = Math.max(1.3, calculatedSpeed);

        if (this.decisionTimer > 0) this.decisionTimer--;

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

        if (closestEntity) {
            if (closestEntity.radius > this.radius * 1.1) {
                this.targetX = this.x - (closestEntity.x - this.x);
                this.targetY = this.y - (closestEntity.y - this.y);
                this.decisionTimer = 0;
            } else if (this.radius > closestEntity.radius * 1.1) {
                this.targetX = closestEntity.x;
                this.targetY = closestEntity.y;
                this.decisionTimer = 0;
            } else {
                closestEntity = null;
            }
        }

        if (!closestEntity && this.decisionTimer <= 0) {
            let closestFood = null;
            let minFoodDist = Infinity;
            
            for (const food of foods) {
                const dxF = food.x - this.x;
                const dyF = food.y - this.y;
                const distSq = dxF*dxF + dyF*dyF; 
                
                if (distSq < 1000 * 1000 && distSq < minFoodDist) {
                    minFoodDist = distSq;
                    closestFood = food;
                }
            }

            if (closestFood) {
                this.targetX = closestFood.x;
                this.targetY = closestFood.y;
                this.decisionTimer = 20;
            } else {
                this.targetX = Math.random() * this.worldWidth;
                this.targetY = Math.random() * this.worldHeight;
                this.decisionTimer = 60; 
            }
        }

        const moveDx = this.targetX - this.x;
        const moveDy = this.targetY - this.y;
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