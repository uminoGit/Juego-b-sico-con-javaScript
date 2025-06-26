// Clase que representa al jugador
class Player {
    /**
     * Crea el jugador y lo agrega a la escena.
     * @param {THREE.Scene} scene - La escena de Three.js
     * @param {THREE.Texture} texture - Textura para el material del jugador
     */
    constructor(scene, texture) {
        // Material cartoon/realista con reflejos y brillo
        const material = new THREE.MeshPhongMaterial({
            map: texture, // Textura de la nave
            color: 0xffffff, // Color base
            shininess: 100, // Brillo
            specular: 0x222222 // Reflejo especular
        });
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.5, 0.5), // Cubo como base del jugador
            material
        );
        this.mesh.position.y = -2; // Posición inicial del jugador
        scene.add(this.mesh); // Agrega el jugador a la escena
        // Luz para resaltar el material Phong
        if (!scene.getObjectByName('playerLight')) {
            const light = new THREE.PointLight(0xffffff, 1, 100);
            light.position.set(0, 0, 5);
            light.name = 'playerLight';
            scene.add(light);
        }
    }

    /**
     * Actualiza la posición del jugador según los controles.
     * @param {Object} controls - Objeto con flags left/right/up/down
     */
    update(controls) {
        if (controls.left) this.mesh.position.x -= 0.1;
        if (controls.right) this.mesh.position.x += 0.1;
        if (controls.up) this.mesh.position.y += 0.1;
        if (controls.down) this.mesh.position.y -= 0.1;
        // Limitar movimiento a los bordes de la pantalla
        this.mesh.position.x = Math.max(-3, Math.min(3, this.mesh.position.x));
        this.mesh.position.y = Math.max(-4, Math.min(4, this.mesh.position.y));
    }
}

// Expone la clase Player al ámbito global
window.Player = Player;