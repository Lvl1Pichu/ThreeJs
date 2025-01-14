import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);
scene.fog = new THREE.Fog(0x202020, 5, 50);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 15);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Plane (Ground)
const planeGeometry = new THREE.PlaneGeometry(50, 50);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0x2e8b57,
  roughness: 0.8,
  metalness: 0.2,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

// Forest (Trees)
const treeMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });

function addTree(x, z) {
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 2),
    treeMaterial
  );
  trunk.position.set(x, 1, z);

  const foliage = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 8),
    foliageMaterial
  );
  foliage.position.set(x, 3, z);

  scene.add(trunk, foliage);
}

for (let i = 0; i < 50; i++) {
  addTree(Math.random() * 50 - 25, Math.random() * 50 - 25);
}

// Walking Character
const characterMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700 });
const character = new THREE.Mesh(
  new THREE.BoxGeometry(0.5, 1, 0.5),
  characterMaterial
);
character.position.set(0, 0.5, 0);
scene.add(character);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xff8800, 1, 50);
pointLight.position.set(5, 10, 5);
scene.add(pointLight);

// Animation Loop
let walkDirection = 1;
function animate() {
  requestAnimationFrame(animate);

  // Character walking
  character.position.x += 0.05 * walkDirection;
  if (character.position.x > 20 || character.position.x < -20) {
    walkDirection *= -1; // Reverse direction
    character.scale.x *= -1; // Flip character
  }

  renderer.render(scene, camera);
}

// Resize Handling
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
