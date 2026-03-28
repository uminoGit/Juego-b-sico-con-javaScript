# DodgeCube 🎮

Juego de evasión en 3D desarrollado con Three.js y JavaScript vanilla. Controlas una nave que debe esquivar obstáculos que caen desde la parte superior de la pantalla, con dificultad progresiva y múltiples tipos de enemigos.

🎮 **[Jugar ahora](#)** ← *(agrega tu link de GitHub Pages aquí)*

---

## 🖼️ Screenshot

![DodgeCube gameplay](screenshots/gameplay.png)

---

## ✨ Características

- 🌌 **Escena 3D completa** con Three.js y WebGL
- ⭐ **120 estrellas** con efecto parallax de fondo
- 📈 **10+ niveles** con dificultad progresiva
- 🔷 **4 tipos de obstáculos** — cubos, esferas, conos y toroides
- ❤️ **Sistema de vidas** con invulnerabilidad temporal tras colisión
- 🎵 **Audio** — música de fondo y efectos de sonido
- ⌨️ **Controles** — WASD o flechas del teclado

---

## 🕹️ Cómo jugar

- Mueve la nave con **WASD** o las **flechas del teclado**
- Esquiva los obstáculos que caen
- Cada colisión resta 1 vida — tienes **5 vidas**
- La puntuación aumenta automáticamente con el tiempo
- La dificultad sube cada 20 puntos

---

## 📊 Sistema de niveles

| Nivel | Obstáculo | Color | Cambio |
|-------|-----------|-------|--------|
| 1-2 | Cubos | 🔴 Rojo | Base |
| 3-4 | Esferas | 🟠 Naranja | +velocidad |
| 5-7 | Conos | 🔵 Cian | +spawn rate |
| 8-9 | Toroides | ⚪ Blanco | formas complejas |
| 10+ | Todos | Variados | múltiples simultáneos |

---

## 🛠️ Tech Stack

- **Three.js** — renderizado 3D con WebGL
- **JavaScript Vanilla** — lógica del juego
- **HTML5 Audio** — música y efectos de sonido
- **CSS** — interfaz de usuario

---

## 📁 Estructura del proyecto

```
DodgeCube/
├── index.html
├── assets/
│   ├── sounds/
│   └── textures/
└── src/
    ├── main.js
    ├── entities/
    │   └── player.js
    ├── core/
    │   └── ObstacleManager.js
    └── utils/
        └── controls.js
```

---

## 🚀 Instalación

```bash
git clone https://github.com/uminoGit/Juego-b-sico-con-javaScript.git
cd Juego-b-sico-con-javaScript
```

Abre `index.html` en tu navegador — no requiere servidor ni dependencias.

---

## 👤 Autor

**uminoGit** — [GitHub](https://github.com/uminoGit)
