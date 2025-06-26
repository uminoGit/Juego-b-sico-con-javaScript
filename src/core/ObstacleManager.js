// Clase que gestiona los obstáculos del juego
class ObstacleManager {
    /**
     * Crea el gestor de obstáculos y comienza a generarlos periódicamente.
     * @param {THREE.Scene} scene - La escena de Three.js
     */
    constructor(scene) {
        this.scene = scene;
        this.obstacles = [];
        setInterval(() => this.spawnObstacle(), 500); // Generar cada 0,5 segundos
    }

    /**
     * Crea un nuevo obstáculo y lo agrega a la escena.
     */
    spawnObstacle() {
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5); // Cubo rojo
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
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