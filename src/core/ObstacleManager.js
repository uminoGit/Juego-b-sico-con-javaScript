// Clase que gestiona los obstáculos del juego
class ObstacleManager {
    /**
     * Crea el gestor de obstáculos y comienza a generarlos periódicamente.
     * @param {THREE.Scene} scene - La escena de Three.js
     */
    constructor(scene) {
        this.scene = scene;
        this.obstacles = [];
        this.level = 1; // Inicializa el nivel
        setInterval(() => this.spawnObstacle(), 500); // Generar cada 0,5 segundos
    }

    /**
     * Permite actualizar el nivel desde fuera
     */
    setLevel(level) {
        this.level = level;
    }

    /**
     * Crea un nuevo obstáculo y lo agrega a la escena.
     */
    spawnObstacle() {
        let geometry, material;
        // Cambia la forma y color según el nivel
        if (this.level < 3) {
            geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
            material = new THREE.MeshPhongMaterial({ color: 0xff0000, shininess: 30 });
        } else if (this.level < 5) {
            geometry = new THREE.SphereGeometry(0.35, 16, 16);
            material = new THREE.MeshPhongMaterial({ color: 0xffa500, shininess: 80 });
        } else if (this.level < 8) {
            geometry = new THREE.ConeGeometry(0.3, 0.7, 16);
            material = new THREE.MeshPhongMaterial({ color: 0x00ffcc, shininess: 120 });
        } else {
            geometry = new THREE.TorusGeometry(0.3, 0.13, 16, 32);
            material = new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random(), shininess: 200 });
        }
        const obstacle = new THREE.Mesh(geometry, material);
        obstacle.position.set(
            Math.random() * 6 - 3, // Posición X aleatoria entre -3 y 3
            5,                    // Aparece arriba de la pantalla
            0
        );
        this.scene.add(obstacle);
        this.obstacles.push(obstacle);
    }

    /**
     * Actualiza la posición de los obstáculos y elimina los que salen de la pantalla.
     */
    update() {
        this.obstacles.forEach((obstacle, index) => {
            obstacle.position.y -= 0.05; // Mueve hacia abajo
            if (obstacle.position.y < -5) { // Si sale de la pantalla
                this.scene.remove(obstacle);
                this.obstacles.splice(index, 1);
            }
        });
    }
}

// Expone la clase ObstacleManager al ámbito global
window.ObstacleManager = ObstacleManager;