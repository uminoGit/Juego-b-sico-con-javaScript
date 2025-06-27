// 1. Configuración inicial de la escena y la cámara
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222233); // Fondo oscuro para mejor contraste
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5; // Aleja la cámara para ver mejor
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- Animación de estrellas de fondo ---
let stars = [];
function createStars(scene, numStars = 120) {
    for (let i = 0; i < numStars; i++) {
        const geometry = new THREE.SphereGeometry(0.03 + Math.random() * 0.04, 6, 6);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: Math.random() * 0.7 + 0.3 });
        const star = new THREE.Mesh(geometry, material);
        // Distribuye las estrellas en un área más grande (más allá del área de juego)
        star.position.set(
            Math.random() * 16 - 8, // X entre -8 y 8
            Math.random() * 12 - 6, // Y entre -6 y 6
            -2 - Math.random() * 4 // Z entre -2 y -6
        );
        scene.add(star);
        stars.push(star);
    }
}

function updateStars() {
    for (let star of stars) {
        star.position.y -= 0.01 + Math.random() * 0.01;
        if (star.position.y < -7) {
            star.position.y = 7;
            star.position.x = Math.random() * 16 - 8;
        }
    }
}

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
let paused = false; // Estado de pausa

let blinkInterval = null; // Para controlar el parpadeo
let blinkTimeout = null;

// --- Bucle principal del juego (debe ser global para pausa/reanudar) ---
function gameLoop() {
    if (gameOver) return; // Si el juego terminó, no seguir
    if (paused) return; // Si está pausado, no seguir
    requestAnimationFrame(gameLoop); // Llamar de nuevo al siguiente frame
    player.update(controls); // Actualizar posición del jugador
    obstacleManager.update(); // Actualizar obstáculos
    updateStars(); // Animar estrellas en cada frame
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
    if (blinkInterval) clearInterval(blinkInterval);
    if (blinkTimeout) clearTimeout(blinkTimeout);
    blinkInterval = setInterval(() => {
        player.mesh.visible = blink;
        blink = !blink;
    }, 150);
    blinkTimeout = setTimeout(() => {
        clearInterval(blinkInterval);
        player.mesh.visible = true;
        invulnerable = false;
    }, duration);
}

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
    if (score > 0 && score % 20 === 0) {
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
            paused = false;
            updateScore();
            // Crear estrellas de fondo
            createStars(scene, 120); // Aumentar el número de estrellas
            if (obstacleManager && obstacleManager.setDifficulty) {
                obstacleManager.setDifficulty(obstaclesSpeed, obstaclesInterval, level);
            }
            playMusic(); // Inicia la música al iniciar el juego
            gameLoop(); // Iniciar el bucle
        }
        // NO LLAMAR window.iniciarJuego() aquí
    },
    undefined,
    (err) => console.error("Error cargando textura:", err) // Manejo de error de carga
);

// --- Música de fondo ---
function ensureBackgroundMusic() {
    let audio = document.getElementById('bg-music');
    if (!audio) {
        audio = document.createElement('audio');
        audio.id = 'bg-music';
        // Busca el primer archivo de música en assets/sounds
        const musicFiles = [
            'assets/sounds/583421__cyxnosa__fallen-down.mp3',
            'assets/sounds/music.ogg',
            'assets/sounds/music.wav'
        ];
        let found = false;
        for (let src of musicFiles) {
            const req = new XMLHttpRequest();
            req.open('HEAD', src, false);
            req.send();
            if (req.status !== 404) {
                audio.src = src;
                found = true;
                break;
            }
        }
        if (!found) {
            audio.src = 'assets/sounds/music.mp3'; // fallback
        }
        audio.loop = true;
        audio.volume = 0.5;
        audio.style.display = 'none';
        document.body.appendChild(audio);
    }
    return audio;
}

function playMusic() {
    const audio = ensureBackgroundMusic();
    audio.play().catch(()=>{});
}
function pauseMusic() {
    const audio = ensureBackgroundMusic();
    audio.pause();
}
function stopMusic() {
    const audio = ensureBackgroundMusic();
    audio.pause();
    audio.currentTime = 0;
}

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

let pauseMenuOpen = false;
// Nueva variable global para controlar el estado del menú de pausa

function showPauseMenu() {
    if (document.getElementById('divPause')) return; // Evita duplicados
    pauseMenuOpen = true;
    let divEmergente = document.createElement("div");
    divEmergente.setAttribute('id', 'divPause');
    divEmergente.setAttribute('class','cubierta-emergente');
    divEmergente.style.position = 'fixed';
    divEmergente.style.top = '0';
    divEmergente.style.left = '0';
    divEmergente.style.width = '100vw';
    divEmergente.style.height = '100vh';
    divEmergente.style.background = 'rgba(20, 24, 40, 0.85)';
    divEmergente.style.zIndex = '1000';
    document.body.appendChild(divEmergente);

    let divMensaje = document.createElement('div');
    divMensaje.setAttribute('class', 'mensaje-emergente');
    divMensaje.style.position = 'fixed';
    divMensaje.style.top = '50%';
    divMensaje.style.left = '50%';
    divMensaje.style.transform = 'translate(-50%, -50%)';
    divMensaje.style.background = 'linear-gradient(135deg, #23243a 80%, #2e3a5a 100%)';
    divMensaje.style.borderRadius = '22px';
    divMensaje.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.37)';
    divMensaje.style.padding = '40px 36px 32px 36px';
    divMensaje.style.textAlign = 'center';
    divMensaje.style.color = '#fff';
    divMensaje.style.minWidth = '320px';
    divMensaje.style.border = '2px solid #3a4a7a';
    divMensaje.style.zIndex = '1001';
    divMensaje.innerHTML = `<div style="margin-bottom: 32px; font-size:1.6em; font-weight:600; letter-spacing:1px;">⏸️ Juego en pausa</div>`;
    // Botón Reanudar
    let btn = document.createElement('button');
    btn.textContent = '▶ Reanudar';
    btn.style.fontSize = '1.15em';
    btn.style.padding = '12px 32px';
    btn.style.borderRadius = '14px';
    btn.style.border = 'none';
    btn.style.background = 'linear-gradient(90deg, #105ce1 60%, #1e90ff 100%)';
    btn.style.color = '#fff';
    btn.style.cursor = 'pointer';
    btn.style.margin = '0 10px';
    btn.style.boxShadow = '0 2px 8px rgba(16,92,225,0.15)';
    btn.onmouseover = function() { btn.style.background = '#1e90ff'; };
    btn.onmouseleave = function() { btn.style.background = 'linear-gradient(90deg, #105ce1 60%, #1e90ff 100%)'; };
    btn.onclick = function() {
        paused = false;
        pauseMenuOpen = false;
        document.body.removeChild(divEmergente);
        // divMensaje ya es hijo de divEmergente, se elimina junto con él
        playMusic(); // Reanuda la música
        requestAnimationFrame(gameLoop); // Ahora gameLoop es global
    };
    divMensaje.appendChild(btn);
    // Botón Reiniciar (refresca la pantalla)
    let btnRestart = document.createElement('button');
    btnRestart.textContent = '🔄 Reiniciar';
    btnRestart.style.fontSize = '1.15em';
    btnRestart.style.padding = '12px 32px';
    btnRestart.style.borderRadius = '14px';
    btnRestart.style.border = 'none';
    btnRestart.style.background = 'linear-gradient(90deg, #e11010 60%, #ff4d4d 100%)';
    btnRestart.style.color = '#fff';
    btnRestart.style.cursor = 'pointer';
    btnRestart.style.margin = '0 10px';
    btnRestart.style.boxShadow = '0 2px 8px rgba(225,16,16,0.15)';
    btnRestart.onmouseover = function() { btnRestart.style.background = '#ff4d4d'; };
    btnRestart.onmouseleave = function() { btnRestart.style.background = 'linear-gradient(90deg, #e11010 60%, #ff4d4d 100%)'; };
    btnRestart.onclick = function() {
        stopMusic();
        location.reload();
    };
    divMensaje.appendChild(btnRestart);
    divEmergente.appendChild(divMensaje); // <--- Cambia aquí: el mensaje es hijo de la cubierta
}

// Manejo de eventos de teclado
// Ahora Escape alterna pausa/reanudar
document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && !gameOver) {
        if (!paused && !pauseMenuOpen) {
            paused = true;
            pauseMenuOpen = true;
            showPauseMenu();
        } else if (paused && pauseMenuOpen) {
            // Si el menú de pausa está abierto, cerrar y reanudar
            paused = false;
            pauseMenuOpen = false;
            const divEmergente = document.getElementById('divPause');
            const divMensaje = document.querySelector('.mensaje-emergente');
            if (divEmergente) document.body.removeChild(divEmergente);
            if (divMensaje) document.body.removeChild(divMensaje);
            requestAnimationFrame(gameLoop);
        }
    }
});