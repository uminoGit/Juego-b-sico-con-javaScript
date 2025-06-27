// 1. Configuración inicial de la escena y la cámara
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222233); // Fondo oscuro para mejor contraste
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5; // Aleja la cámara para ver mejor
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Variables globales del juego
const textureLoader = new THREE.TextureLoader(); // Cargador de texturas
let player, obstacleManager, controls; // Instancias principales del juego
let score = 0; // Puntuación
let gameOver = false; // Estado del juego
let frameCount = 0; // Contador de frames para controlar la velocidad del puntaje
let level = 1; // Nivel actual
let obstaclesSpeed = 0.05; // Velocidad inicial de los obstáculos
let obstaclesInterval = 2000; // Intervalo inicial de aparición (ms)
let lives = 5; // Vidas del jugador
let invulnerable = false; // Estado de invulnerabilidad tras colisión

// 3. Función para detectar colisiones entre el jugador y los obstáculos
function checkCollision(player, obstacles) {
    for (let i = 0; i < obstacles.length; i++) {
        const obs = obstacles[i];
        const dx = player.mesh.position.x - obs.position.x;
        const dy = player.mesh.position.y - obs.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 0.5) { // Si están lo suficientemente cerca, hay colisión
            return true;
        }
    }
    return false;
}

// Nueva función para actualizar el nivel
function updateLevel() {
    // Sube de nivel cada 200 puntos
    if (score > 0 && score % 50 === 0) {
        level++;
        obstaclesSpeed += 0.015; // Obstáculos más rápidos
        obstaclesInterval = Math.max(600, obstaclesInterval - 200); // Menor intervalo, mínimo 600ms
        document.getElementById('score').textContent = `Nivel: ${level} | puntuacion: ${score}`;
        if (obstacleManager && obstacleManager.setDifficulty) {
            obstacleManager.setDifficulty(obstaclesSpeed, obstaclesInterval, level);
        }
        if (obstacleManager && obstacleManager.setLevel) {
            obstacleManager.setLevel(level);
        }
    }
}

// 4. Función para actualizar el texto de la puntuación en pantalla
function updateScore() {
    // Muestra las vidas como corazones
    const heart = '❤️';
    const hearts = heart.repeat(lives) + '♡'.repeat(Math.max(0, 5 - lives));
    document.getElementById('score').innerHTML = `Nivel: ${level} | puntuacion: ${score} | Vidas: <span style="font-size:1.2em">${hearts}</span>`;
}

// 5. Cargar la textura y crear los objetos principales cuando esté lista
const playerTexture = textureLoader.load(
    '../../assets/textures/nave.jpeg',
    () => {
        // Solo define la función para iniciar el juego, no la ejecutes automáticamente
        window.iniciarJuego = function() {
            player = new Player(scene, playerTexture); // Crear jugador
            player.mesh.scale.set(1.5, 1.5, 1.5); // Hacer el jugador más grande
            obstacleManager = new ObstacleManager(scene); // Crear gestor de obstáculos
            controls = initControls(); // Inicializar controles de teclado
            score = 0;
            gameOver = false;
            frameCount = 0;
            level = 1;
            obstaclesSpeed = 0.05;
            obstaclesInterval = 2000;
            lives = 5;
            invulnerable = false;
            updateScore();
            if (obstacleManager && obstacleManager.setDifficulty) {
                obstacleManager.setDifficulty(obstaclesSpeed, obstaclesInterval, level);
            }
            // 6. Bucle principal del juego
            function gameLoop() {
                if (gameOver) return; // Si el juego terminó, no seguir
                requestAnimationFrame(gameLoop); // Llamar de nuevo al siguiente frame
                player.update(controls); // Actualizar posición del jugador
                obstacleManager.update(); // Actualizar obstáculos
                renderer.render(scene, camera); // Dibujar la escena
                // Sumar puntos cada 10 frames (más lento)
                frameCount++;
                if (frameCount % 10 === 0) {
                    score++;
                    updateScore();
                    updateLevel();
                }
                // Colisión
                if (!invulnerable && checkCollision(player, obstacleManager.obstacles)) {
                    lives--;
                    updateScore();
                    if (lives <= 0) {
                        gameOver = true;
                        showGameOver();
                    } else {
                        invulnerable = true;
                        blinkPlayer();
                    }
                }
            }
            function blinkPlayer(duration = 1500) {
                let blink = true;
                const interval = setInterval(() => {
                    player.mesh.visible = blink;
                    blink = !blink;
                }, 150);
                setTimeout(() => {
                    clearInterval(interval);
                    player.mesh.visible = true;
                    invulnerable = false;
                }, duration);
            }
            gameLoop(); // Iniciar el bucle
        }
        // NO LLAMAR window.iniciarJuego() aquí
    },
    undefined,
    (err) => console.error("Error cargando textura:", err) // Manejo de error de carga
);

// 7. Ajustar el renderizado cuando se cambia el tamaño de la ventana
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function showGameOver() {
    // Crea la cubierta oscura
    let divEmergente = document.createElement("div");
    divEmergente.setAttribute('id', 'divGameOver');
    divEmergente.setAttribute('class','cubierta-emergente');
    divEmergente.style.position = 'fixed';
    divEmergente.style.top = '0';
    divEmergente.style.left = '0';
    document.body.appendChild(divEmergente);

    // Crea el mensaje y el botón
    let divMensaje = document.createElement('div');
    divMensaje.setAttribute('class', 'mensaje-emergente');
    divMensaje.style.transform = 'translate(-50%, -50%)';
    divMensaje.innerHTML = `<div style="margin-bottom: 30px;">¡Game Over!<br>Puntuación: ${score}<br>Nivel: ${level}</div>`;
    let btn = document.createElement('button');
    btn.textContent = 'Jugar de nuevo';
    btn.style.fontSize = '1.2em';
    btn.style.padding = '10px 30px';
    btn.style.borderRadius = '12px';
    btn.style.border = 'none';
    btn.style.background = '#105ce1';
    btn.style.color = '#fff';
    btn.style.cursor = 'pointer';
    btn.onclick = function() {
        document.body.removeChild(divEmergente);
        document.body.removeChild(divMensaje);
        window.iniciarJuego();
    };
    divMensaje.appendChild(btn);
    document.body.appendChild(divMensaje);
}