export default class Player {
 /* Javascript'te constructor tanımlamak için "constructor" yazmak gerekiyormuş. Diğer türlü bunu bir metod olarak kabul ediyor. C# ve C++ tan farklı. */
    constructor(x, y, radius, color, name) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.name = name;
        this.speed = 0;
        this.mouse = { x: 0, y: 0 };
        this.score = 0;
    }

    update(canvasWidth, canvasHeight) {
        /*Oyuncu ekranın ortasında kalacağı için haritanın ortasını baz alıyoruz ve fareye olan uzaklığını hesaplıyoruz. İlginç */
        const dx = this.mouse.x - (canvasWidth / 2);
        const dy = this.mouse.y - (canvasHeight / 2);
        /* Hız dengesini bir türlü ayarlayamadığım için logaritmik bir formüle geçtim.*/
        let calculatedSpeed = 2.5 * Math.pow(35 / this.radius, 0.45);
        /* Büyük oyuncunun aşırı yavaş olmamasını sağlıyor */
        this.speed = Math.max(1.3, calculatedSpeed);
        /* Fare ile oyuncu arasında oluşan açıyı hesaplama */ 
        const angle = Math.atan2(dy, dx);
        /* O açıya doğru belirlediğimiz hızla ilerleme */
        const velocityX = Math.cos(angle) * this.speed;
        const velocityY = Math.sin(angle) * this.speed;

        this.x += velocityX;
        this.y += velocityY;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
         /*  ctx.fillStyle = 'white';
        ctx.font = '14px Poppins';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.name, this.x, this.y); */

        let fontSize = Math.max(14, this.radius * 0.6);
        if(this.name.length > 8) fontSize *= 0.8;

        ctx.font = `800 ${fontSize}px 'Poppins'`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle'; // Düzeltildi

        ctx.lineWidth = Math.max(2, fontSize * 0.1); 
        ctx.strokeStyle = '#1a1a1a';
        ctx.strokeText(this.name, this.x, this.y);

        ctx.fillStyle = '#ffffff';
        ctx.fillText(this.name, this.x, this.y);
    }
}