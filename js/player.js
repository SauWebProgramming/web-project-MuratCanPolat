export default class Player {
    /* Javascript'te constructor tanımlamak için "constructor" yazmak gerekiyormuş. Diğer türlü bunu bir metod olarak kabul ediyor. C# ve C++ tan farklı. */
    constructor(x, y, radius, color, name) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.name = name;
        /*this.speed = 2;*/
        this.speed = 500 / (this.radius + 120);
        this.mouse = { x: 0, y: 0 };
    }


update(canvasWidth, canvasHeight){
        /*Oyuncu ekranın ortasında kalacağı için haritanın ortasını baz alıyoruz ve fareye olan uzaklığını hesaplıyoruz. İlginç */
        const dx = this.mouse.x - (canvasWidth / 2);
        const dy = this.mouse.y - (canvasHeight / 2);
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
        const fontSize = Math.max(12, this.radius / 1.5);

        ctx.fillStyle = 'white';
        ctx.font = `bold ${fontSize}px Poppins`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.name, this.x, this.y);
}
}