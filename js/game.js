import Player from './player.js';
import Food from './food.js';
import Bot from './bot.js';

class Game {
    constructor(){
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d'); 
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.worldWidth = 5000;
        this.worldHeight = 5000;

        this.isRunning = false;
        this.player = null;

        this.foods = [];
        this.foodCount = 500;

        this.bots = [];
        this.botCount = 20;

        this.uiContainer = document.getElementById('uiContainer');
        this.playButton = document.getElementById('playButton');
        this.nicknameInput = document.getElementById('nickname');
        this.colorPicker = document.getElementById('colorPicker');

        this.playButton.addEventListener('click', () => this.startGame());

        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });

        window.addEventListener('mousemove', (e) => {
            if (this.player) {
                this.player.mouse.x = e.clientX;
                this.player.mouse.y = e.clientY;
            }
        });

        const savedScore = localStorage.getItem('highScore') || 0;
        const highScoreEl = document.getElementById('highScore');
        if(highScoreEl) {
            highScoreEl.innerText = `En Yüksek Skor: ${savedScore}`;
            highScoreEl.style.display = 'block';
        }
        
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.finalScoreEl = document.getElementById('finalScore');
        this.newRecordMsg = document.getElementById('newRecordMsg');
        this.restartButton = document.getElementById('restartButton');
    
        this.restartButton.addEventListener('click', () => location.reload());
    }

    startGame() {
        const name = this.nicknameInput.value;
        const color = this.colorPicker.value;

        if (name.trim() === "") {
            alert("Lütfen bir isim giriniz!");
            return;
        }

        this.uiContainer.style.display = 'none';

        document.getElementById('leaderboard').style.display = 'block';
        
        document.getElementById('gameScore').style.display = 'block';

        this.player = new Player(this.worldWidth / 2, this.worldHeight / 2, 30, color, name);
        this.player.score = 0;
        
        this.foods = [];
        for (let i = 0; i < this.foodCount; i++) {
            this.foods.push(new Food(this.worldWidth, this.worldHeight));
        }

        this.bots = [];
        for(let i=0; i < this.botCount; i++) {
            this.bots.push(new Bot(this.worldWidth, this.worldHeight));
        }

        this.isRunning = true;
        this.animate();
    }

    drawGrid(){
        const step = 100;
        this.ctx.beginPath();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = '#2c2c2c';

        for (let x = 0; x <= this.worldWidth; x += step) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.worldHeight);
        }

        for (let y = 0; y <= this.worldHeight; y += step) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.worldWidth, y);
        }

        this.ctx.stroke();
    }

    checkCollisions() {
        for (let i = this.foods.length - 1; i >= 0; i--) {
            const food = this.foods[i];
            const dx = this.player.x - food.x;
            const dy = this.player.y - food.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < this.player.radius + food.radius) {
                this.foods.splice(i, 1);
                this.player.radius += 0.2;
                this.player.score += 10;
                this.foods.push(new Food(this.worldWidth, this.worldHeight));
            }
        }

        this.bots.forEach(bot => {
            for (let i = this.foods.length - 1; i >= 0; i--) {
                const food = this.foods[i];
                const dx = bot.x - food.x;
                const dy = bot.y - food.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < bot.radius + food.radius) {
                    this.foods.splice(i, 1);
                    bot.radius += 0.2;
                    this.foods.push(new Food(this.worldWidth, this.worldHeight));
                }
            }
        });

        for (let i = this.bots.length - 1; i >= 0; i--) {
            const bot = this.bots[i];
            const dx = this.player.x - bot.x;
            const dy = this.player.y - bot.y;
            const dist = Math.sqrt(dx*dx + dy*dy);

            if (dist < this.player.radius + bot.radius) {
                if (this.player.radius > bot.radius * 1.1) {
                    this.bots.splice(i, 1); 
                    this.player.radius += bot.radius * 0.2; 
                    this.player.score += 100; 
                    this.bots.push(new Bot(this.worldWidth, this.worldHeight));
                }
                else if (bot.radius > this.player.radius * 1.1) {
                    this.showGameOver();
                }
            }
        }

        for (let i = 0; i < this.bots.length; i++) {         
            for (let j = i+1; j < this.bots.length; j++) {
                const bot1 = this.bots[i];
                const bot2 = this.bots[j];

                const dx = bot1.x - bot2.x;
                const dy = bot1.y - bot2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < bot1.radius + bot2.radius) {
                    if (bot1.radius > bot2.radius * 1.1) {
                        bot1.radius += bot2.radius * 0.2; 
                        this.bots.splice(j, 1); 
                        this.bots.push(new Bot(this.worldWidth, this.worldHeight)); 
                        j--; 
                    }
                    else if (bot2.radius > bot1.radius * 1.1) {
                        bot2.radius += bot1.radius * 0.2; 
                        this.bots.splice(i, 1); 
                        this.bots.push(new Bot(this.worldWidth, this.worldHeight)); 
                        i--; 
                        break; 
                    }
                }
            }
        }
        if (this.player.score >= 15000) {
        this.showVictory();
        }
    }

    animate() {
        if (!this.isRunning) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();

       let scale = 1;
        const zoomStartRadius = 60; 
        const minZoom = 0.25;

        if (this.player.radius > zoomStartRadius) {
        let growthRatio = zoomStartRadius / this.player.radius;
        scale = Math.pow(growthRatio, 0.5);
        scale = Math.max(minZoom, scale);
        
        }

        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        
        // 2. Zoom işlemini uygula
        this.ctx.scale(scale, scale);
        
        this.ctx.translate(-this.player.x, -this.player.y);

        this.drawGrid();

        this.foods.forEach(food => food.draw(this.ctx));

        this.bots.forEach(bot => {
            bot.update(this.player, this.foods, this.bots);
            bot.draw(this.ctx); 
        });

        this.checkCollisions();

        this.updateLeaderboard();

        this.player.update(this.canvas.width, this.canvas.height);
        
        this.player.x = Math.max(this.player.radius, Math.min(this.worldWidth - this.player.radius, this.player.x));
        this.player.y = Math.max(this.player.radius, Math.min(this.worldHeight - this.player.radius, this.player.y));
        
        this.player.draw(this.ctx);

        this.ctx.restore();

        const scoreEl = document.getElementById('gameScore');
        if (scoreEl && this.player) {
            scoreEl.innerText = `Skor: ${Math.floor(this.player.score)}`;
        }
        
        requestAnimationFrame(() => this.animate());
    }

    updateLeaderboard() {
        const allEntities = [...this.bots];
        
        if (this.player) {
            allEntities.push(this.player);
        }

        allEntities.sort((a, b) => b.radius - a.radius);

        const top5 = allEntities.slice(0, 5);

        const listElement = document.getElementById('leaderboardList');
        listElement.innerHTML = '';

        top5.forEach((entity, index) => {
            const li = document.createElement('li');
            
            let displayName = entity.name.length > 10 ? entity.name.substring(0, 10) + '...' : entity.name;
            
            const score = Math.floor(entity.radius);

            li.innerHTML = `
                <span>${index + 1}. ${displayName}</span>
                <span>${score}</span>
            `;
            
            if (entity === this.player) {
                li.style.color = '#00ff00'; 
            }

            listElement.appendChild(li);
        });
    }
    showGameOver() {
    this.isRunning = false;
    
    const currentScore = Math.floor(this.player.score);
    const highScore = localStorage.getItem('highScore') || 0;
    
    this.gameOverScreen.style.display = 'block';
    this.finalScoreEl.innerText = `Skorunuz: ${currentScore}`;
    
    if (currentScore > parseInt(highScore)) {
        localStorage.setItem('highScore', currentScore);
        this.newRecordMsg.style.display = 'block';
    } else {
        this.newRecordMsg.style.display = 'none';
    }
    }

    showVictory() {
    this.isRunning = false;
    
    const currentScore = Math.floor(this.player.score);
    const highScore = localStorage.getItem('highScore') || 0;
    
    this.gameOverScreen.style.display = 'block';
    
    const titleEl = this.gameOverScreen.querySelector('h1');
    titleEl.innerText = "TEBRİKLER ŞAMPİYON!";
    titleEl.style.color = "#ffd700";
    
    this.gameOverScreen.style.border = "2px solid #ffd700";
    this.gameOverScreen.style.boxShadow = "0 0 50px rgba(255, 215, 0, 0.6)";

    this.finalScoreEl.innerText = `Skorunuz: ${currentScore}`;
    this.finalScoreEl.style.color = "#ffffff";

    if (currentScore > parseInt(highScore)) {
        localStorage.setItem('highScore', currentScore);
        this.newRecordMsg.style.display = 'block';
        this.newRecordMsg.innerText = "🏆 EFSANEVİ REKOR! 🏆";
    } else {
        this.newRecordMsg.style.display = 'none';
    }
}
}

const game = new Game();