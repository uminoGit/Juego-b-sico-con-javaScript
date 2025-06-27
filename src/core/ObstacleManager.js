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
            const obstacle = new THREE.Mesh(geometry, material);
            obstacle.position.set(
                Math.random() * 6 - 3,
                5,
                0
            );
            this.scene.add(obstacle);
            this.obstacles.push(obstacle);
        } else if (this.level < 5) {
            geometry = new THREE.SphereGeometry(0.35, 16, 16);
            material = new THREE.MeshPhongMaterial({ color: 0xffa500, shininess: 80 });
            const obstacle = new THREE.Mesh(geometry, material);
            obstacle.position.set(
                Math.random() * 6 - 3,
                5,
                0
            );
            this.scene.add(obstacle);
            this.obstacles.push(obstacle);
        } else if (this.level < 8) {
            geometry = new THREE.ConeGeometry(0.3, 0.7, 16);
            material = new THREE.MeshPhongMaterial({ color: 0x00ffcc, shininess: 120 });
            const obstacle = new THREE.Mesh(geometry, material);
            obstacle.position.set(
                Math.random() * 6 - 3,
                5,
                0
            );
            this.scene.add(obstacle);
            this.obstacles.push(obstacle);
        } else if (this.level < 10) {
            geometry = new THREE.TorusGeometry(0.3, 0.13, 16, 32);
            material = new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random(), shininess: 200 });
            const obstacle = new THREE.Mesh(geometry, material);
            obstacle.position.set(
                Math.random() * 6 - 3,
                5,
                0
            );
            this.scene.add(obstacle);
            this.obstacles.push(obstacle);
        } else {
            // --- A partir de nivel 10: aparecen 2 o 3 obstáculos distintos y separados ---
            const shapes = [
                () => new THREE.Mesh(
                    new THREE.BoxGeometry(0.4, 0.4, 0.4),
                    new THREE.MeshPhongMaterial({ color: 0xff0000, shininess: 30 })
                ),
                () => new THREE.Mesh(
                    new THREE.SphereGeometry(0.28, 16, 16),
                    new THREE.MeshPhongMaterial({ color: 0xffa500, shininess: 80 })
                ),
                () => new THREE.Mesh(
                    new THREE.ConeGeometry(0.22, 0.5, 16),
                    new THREE.MeshPhongMaterial({ color: 0x00ffcc, shininess: 120 })
                ),
                () => new THREE.Mesh(
                    new THREE.TorusGeometry(0.22, 0.09, 16, 32),
                    new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random(), shininess: 200 })
                )
            ];
            // Elegir aleatoriamente 2 o 3 formas distintas
            const numShapes = Math.random() < 0.5 ? 2 : 3;
            const used = [];
            while (used.length < numShapes) {
                let idx = Math.floor(Math.random() * shapes.length);
                if (!used.includes(idx)) used.push(idx);
            }
            // Crear cada obstáculo por separado
            used.forEach(() => {
                const idx = used.pop();
                const mesh = shapes[idx]();
                mesh.position.set(
                    Math.random() * 6 - 3, // X aleatorio
                    5 + Math.random() * 0.5, // Y ligeramente variado
                    0
                );
                this.scene.add(mesh);
                this.obstacles.push(mesh);
            });
        }
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