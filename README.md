# Inesh Agarwal — Creative Portfolio

A portfolio designed as an explorable digital world. One continuous environment — a room, a rupture, a universe, and a way back.

## 🌌 The Concept
Conventional design portfolios reduce work into isolated mockup cards. This project treats the portfolio itself as the primary interactive design artifact. You start in an intimate, cozy 2 AM room with a vinyl player, and as you scroll, the environment physically shatters and dissolves into a chaotic, infinite digital abyss where the project case studies reside.

## 🛠️ Features & Engineering

- **Hardware-Accelerated HTML5 Canvas Engine**: Custom scroll-driven 60 FPS pipeline bridging 2D DOM elements and WebGL.
- **Procedural Web Audio Synthesizer**: The soundtrack isn't just played; it is orchestrated procedurally in real-time. Features Brownian noise filter buffers (simulating needle friction), dynamic lowpass filters, and Ryoji Ikeda-style glitch ruptures seamlessly synced to your scroll depth.
- **3D WebGL Integration**: Utilizes custom Three.js shader materials and geometric physics for the monolithic structures and the pulsing core in the Digital Abyss.
- **Interactive Case Studies**: In-world, floating artifact viewers detailing UX Research, Wireframes, and UI Visual language, complete with external Figma prototypes.

## 💻 Tech Stack
- **Framework:** React 18 + TypeScript + Vite
- **Styling:** TailwindCSS
- **Animation:** Framer Motion, Lenis Smooth Scroll
- **3D / Graphics:** Three.js, React Three Fiber, HTML5 Canvas
- **Audio:** Native Web Audio API (`AudioContext`, `BiquadFilterNode`, `MediaElementAudioSourceNode`)

## 🚀 Getting Started

To run this project locally:

1. **Clone the repository**
   ```bash
   git clone https://github.com/IneshAg/Creative_Portfolio.git
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Start the development server**
   ```bash
   npm run dev
   ```
4. **Explore**  
   Open `http://localhost:5173` in your browser. Don't forget to click the Vinyl Player!

## 👤 Author
**Inesh Agarwal**
- Email: ineshag123@gmail.com
- LinkedIn: [inesh-agarwal](https://linkedin.com/in/inesh-agarwal)
- GitHub: [IneshAg](https://github.com/IneshAg)
