// Función para inicializar los controles del jugador
function initControls() {
    const keys = {};
    // Detecta cuando se presionan las teclas izquierda/derecha/arriba/abajo
    document.addEventListener('keydown', (e) => {
        if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.left = true;
        if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.right = true;
        if (e.code === 'KeyW' || e.code === 'ArrowUp') keys.up = true;
        if (e.code === 'KeyS' || e.code === 'ArrowDown') keys.down = true;
    });
    // Detecta cuando se sueltan las teclas izquierda/derecha/arriba/abajo
    document.addEventListener('keyup', (e) => {
        if (e.code === 'KeyA' || e.code === 'ArrowLeft') keys.left = false;
        if (e.code === 'KeyD' || e.code === 'ArrowRight') keys.right = false;
        if (e.code === 'KeyW' || e.code === 'ArrowUp') keys.up = false;
        if (e.code === 'KeyS' || e.code === 'ArrowDown') keys.down = false;
    });
    return keys; // Devuelve el objeto de controles

    // En controls.js
    document.addEventListener('mousemove', (e) => {
  player.mesh.position.x = (e.clientX / window.innerWidth) * 6 - 3;
});

}

// Expone la función initControls al ámbito global
window.initControls = initControls;