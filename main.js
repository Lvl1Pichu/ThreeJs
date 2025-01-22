import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";

// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  90, // Increased FOV
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 10, -20); // Adjusted initial position

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // Set pixel ratio
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows
document.body.appendChild(renderer.domElement);

// Post-Processing
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const fxaaPass = new ShaderPass(FXAAShader);
fxaaPass.uniforms.resolution.value.set(1 / (window.innerWidth * window.devicePixelRatio), 1 / (window.innerHeight * window.devicePixelRatio)); // Adjusted resolution
composer.addPass(fxaaPass);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024; // Higher resolution shadows
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
scene.add(directionalLight);

// Path
// let pathMesh; // To store the path model
// const pathLoader = new GLTFLoader();
// pathLoader.load(
//   './source/path/path.glb', // Replace with your GLB path file
//   (gltf) => {
//     pathMesh = gltf.scene;
//     pathMesh.scale.set(1, 1, 1); // Adjust scale as needed
//     pathMesh.position.set(0, -0.5, 0); // Adjust position to align with the ground
//     pathMesh.traverse((child) => {
//       if (child.isMesh) {
//         child.castShadow = true;
//         child.receiveShadow = true;
//       }
//     });
//     scene.add(pathMesh);
//   },
//   undefined,
//   (error) => {
//     console.error('Error loading path model:', error);
//   }
// );

// Character
let character;
const characterLoader = new GLTFLoader();
characterLoader.load(
  './source/Hiker/hiker.glb',
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.01, 0.01, 0.01); // Adjust scale as needed

    // Adjust the character's Y position so its feet are on the ground
    const box = new THREE.Box3().setFromObject(model);
    const height = box.max.y - box.min.y; // Calculate the character's height
    model.position.set(0, height / 2, 0); // Move the character up by half its height

    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    scene.add(model);
    character = model;
  },
  undefined,
  (error) => {
    console.error('Error loading character model:', error);
  }
);

// Environments
function createForestEnvironment() {
  const planeGeometry = new THREE.PlaneGeometry(50, 50);
  const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0x2e8b57,
    roughness: 0.8,
    metalness: 0.2,
  });

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.set(0, -0.5, 0); // Ground plane is at y = 0
  plane.receiveShadow = true; // Enable shadow receiving
  scene.add(plane);

  const treeMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
  const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });

  function addTree(x, z) {
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 2),
      treeMaterial
    );
    trunk.position.set(x, 1, z);
    trunk.castShadow = true; // Enable shadow casting

    const foliage = new THREE.Mesh(
      new THREE.ConeGeometry(1, 2, 8),
      foliageMaterial
    );
    foliage.position.set(x, 3, z);
    foliage.castShadow = true; // Enable shadow casting

    scene.add(trunk, foliage);
  }

  for (let i = 0; i < 50; i++) {
    addTree(Math.random() * 50 - 25, Math.random() * 50 - 25);
  }
}

function createWinterEnvironment() {
  const planeGeometry = new THREE.PlaneGeometry(50, 50);
  const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.set(50, 0, 0); // Ground plane is at y = 0
  plane.receiveShadow = true; // Enable shadow receiving
  scene.add(plane);

  const treeMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
  const snowMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

  function addSnowyTree(x, z) {
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 2),
      treeMaterial
    );
    trunk.position.set(x + 50, 1, z);
    trunk.castShadow = true; // Enable shadow casting

    const foliage = new THREE.Mesh(
      new THREE.ConeGeometry(1, 2, 8),
      snowMaterial
    );
    foliage.position.set(x + 50, 3, z);
    foliage.castShadow = true; // Enable shadow casting

    scene.add(trunk, foliage);
  }

  for (let i = 0; i < 50; i++) {
    addSnowyTree(Math.random() * 50 - 25, Math.random() * 50 - 25);
  }
}

function createFireplaceEnvironment() {
  const planeGeometry = new THREE.PlaneGeometry(50, 50);
  const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x3b1f1f });

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.set(100, -1, 0); // Ground plane is at y = 0
  plane.receiveShadow = true; // Enable shadow receiving
  scene.add(plane);

  const fireplace = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 3),
    new THREE.MeshStandardMaterial({ color: 0xff4500 })
  );
  fireplace.position.set(100, 1.5, 0);
  fireplace.castShadow = true; // Enable shadow casting
  scene.add(fireplace);

  const logs = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 3),
    new THREE.MeshStandardMaterial({ color: 0x8b4513 })
  );
  logs.rotation.z = Math.PI / 2;
  logs.position.set(100, 0.5, -3);
  logs.castShadow = true; // Enable shadow casting
  scene.add(logs);
}

// Create all environments
createForestEnvironment();
createWinterEnvironment();
createFireplaceEnvironment();

// Character Movement
let currentProgress = 0; // Progress along the path (0 to 1)
const pathSpeed = 0.0001;
const freeMovementSpeed = 0.1; // Speed for free movement
let isFollowingPath = false; // Toggle for path following

const keys = {}; // To track keypresses

function moveCharacter() {
  if (keys["ArrowUp"]) {
    if (isFollowingPath) {
      currentProgress += pathSpeed;
    } else {
      character.position.z -= freeMovementSpeed;
    }
  }
  if (keys["ArrowDown"]) {
    if (isFollowingPath) {
      currentProgress -= pathSpeed;
    } else {
      character.position.z += freeMovementSpeed;
    }
  }
  if (keys["ArrowLeft"]) {
    character.position.x -= freeMovementSpeed;
  }
  if (keys["ArrowRight"]) {
    character.position.x += freeMovementSpeed;
  }

  currentProgress = THREE.MathUtils.clamp(currentProgress, 0, 1);

  if (isFollowingPath && pathMesh) {
    const position = pathMesh.position.clone(); // Use the path's position
    const tangent = new THREE.Vector3(1, 0, 0); // Adjust tangent based on path orientation
    character.position.copy(position);
    character.lookAt(position.clone().add(tangent));
  }

  // Adjust camera to follow character and stay at a fixed offset
  const relativeCameraOffset = new THREE.Vector3(0, 10, -40); // Increased distance
  const cameraOffset = relativeCameraOffset.applyMatrix4(character.matrixWorld);

  camera.position.lerp(cameraOffset, 0.05); // Smoother follow
  camera.lookAt(character.position);
}

// Toggle path following
window.addEventListener("keydown", (event) => {
  if (event.key === "p") { // Press 'P' to toggle path following
    isFollowingPath = !isFollowingPath;
  }
  keys[event.key] = true;
});

window.addEventListener("keyup", (event) => {
  keys[event.key] = false;
});

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  moveCharacter();
  composer.render();
}

// Event Listeners
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize
animate();