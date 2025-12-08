import Player from './player.js';

class Game {
    /* Javascript'te constructor tanımlamak için "constructor" yazmak gerekiyormuş. Diğer türlü bunu bir metod olarak kabul ediyor. C# ve C++ tan farklı. */
    constructor(){
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d'); 
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.worldWidth = 5000;
        this.worldHeight = 5000;

        this.isRunning = false;
        this.player = null;

        /* Kullanıcının seçtiği verileri oyuna aktarma */
        this.uiContainer = document.getElementById('uiContainer');
        this.playButton = document.getElementById('playButton');
        this.nicknameInput = document.getElementById('nickname');
        this.colorPicker = document.getElementById('colorPicker');

        this.playButton.addEventListener('click', () => this.startGame());

        /* Pencere boyutu değiştiğinde canvas'ın da boyutunu değiştirme */
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
    }

    startGame() {
        const name = this.nicknameInput.value;
        const color = this.colorPicker.value;

        /* İsim girilmemişse uyarı ver. Güzelleştirilebilir. */
        if (name.trim() === "") {
            alert("Lütfen bir isim giriniz!");
            return;
        }

        this.uiContainer.style.display = 'none';

        this.player = new Player(this.worldWidth / 2, this.worldHeight / 2, 20, color, name);

        this.isRunning = true;
        this.animate();
    }
    drawGrid(){
        const step = 50;
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

    animate() {
        if (!this.isRunning) return;

        /* Her seferinde ekranı temizliyoruz */
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();

        const camX = this.canvas.width / 2 - this.player.x;
        const camY = this.canvas.height / 2 - this.player.y;

        this.ctx.translate(camX, camY);

        this.drawGrid();

        this.player.update(this.canvas.width, this.canvas.height);
       
       this.player.x = Math.max(this.player.radius, Math.min(this.worldWidth - this.player.radius, this.player.x));
        this.player.y = Math.max(this.player.radius, Math.min(this.worldHeight - this.player.radius, this.player.y));
       
        this.player.draw(this.ctx);

        this.ctx.restore();

        /* Döngüye sokuyoruz */
        requestAnimationFrame(() => this.animate());
    }
}

const game = new Game();