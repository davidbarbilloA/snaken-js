const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;

//guardarse en el almacemaniento local
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const changeFoodPosition = () => {
    //pasando de un valor aleatorio de 0 a 20 como posición de la comida
    foodX = Math.floor(Math.random() * 20) + 1;
    foodY = Math.floor(Math.random() * 20) + 1;
};

const handleGameOver = () => {
    //borrar el cronómetro y recargar la página al terminar el juego
    clearInterval(setIntervalId);
    alert("¡Game Over! Presiona OK para continuar...")
    location.reload();
}

const changeDirection = (e) => {
    //canbia el valor de la velocidad segun la tecla presionada
    if(e.key ==="ArrowUp" && velocityY != 1){
        velocityX = 0;
        velocityY = -1;
    }else if(e.key ==="ArrowDown" && velocityY != -1){
        velocityX = 0;
        velocityY = 1;
    }else if(e.key ==="ArrowLeft" && velocityX != 1){
        velocityX = -1;
        velocityY = 0;
    }else if(e.key ==="ArrowRight" && velocityX != -1){
        velocityX = 1; 
        velocityY = 0;
    }
}

controls.forEach(key => {
    //llamar a changedirection en cada clic de tecla y pasar el valor del conjunto de datos clave como un objeto
    key.addEventListener("click", () => changeDirection({ key: key.dataset.key }));
})

const initGame = () => {
    if(gameOver) return handleGameOver();
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    //chequeo si la serpíente toco la comida
    if(snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]); // empuja la posicion de la comida al cuerpo de la serpiente
        score++; //incremiento del score de 1

        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        //desplazando hacia adelante los valores de los elementos en el cuerpo de la serpiente uno por uno.
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];//configura el primer elemento del cuerpo de la serpiente a la posición actual de la serpiente

    //actualizando la posición de la cabeza de la serpiente según la velocidad actual
    snakeX += velocityX;
    snakeY += velocityY;

    //Comprobando si la cabeza de la serpiente está fuera de la pared, si es así, la configuración del juego ha terminado.
    if(snakeX <= 0 || snakeX > 20 || snakeY <= 0 || snakeY > 20) {
        gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        //agrega un div para cada parte del cuerpo de la serpiente 
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        //comprueba si la cabeza de la serpiente golpeo el cuerpo, si es asi, actiova el gameOver
        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && i !== 0 && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }

    playBoard.innerHTML = htmlMarkup;
};

changeFoodPosition();
setIntervalId = setInterval(initGame, 125);
document.addEventListener("keydown", changeDirection);