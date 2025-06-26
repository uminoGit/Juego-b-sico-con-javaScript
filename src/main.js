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

// 4. Función para actualizar el texto de la puntuación en pantalla
function updateScore() {
    document.getElementById('score').textContent = 'puntuacion: ' + score;
}

// 5. Cargar la textura y crear los objetos principales cuando esté lista
const playerTexture = textureLoader.load(
    '../../assets/textures/nave.jpeg', // Ruta de la textura del jugador
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
            updateScore();
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
                }
                // Colisión
                if (checkCollision(player, obstacleManager.obstacles)) {
                    gameOver = true;
                    document.getElementById('score').textContent = '¡Game Over! Puntuación: ' + score;
                }
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