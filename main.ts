import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


let currentProgress = 0; // Progress along the path (0 to 1)
const pathSpeed = 0.002;

const keys = {}; // To track keypresses

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xff8800, 1, 50);
pointLight.position.set(5, 10, 5);
scene.add(pointLight);

// Character
let character = createHiker();
character.position.set(0, 0.5, 0);
scene.add(character);

// Path
const pathPoints = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(10, 0, -10),
  new THREE.Vector3(20, 0, 0),
  new THREE.Vector3(30, 0, 10), // Forest to Winter
  new THREE.Vector3(50, 0, 10),
  new THREE.Vector3(70, 0, 0),
  new THREE.Vector3(90, 0, -10), // Winter to Fireplace
  new THREE.Vector3(110, 0, 0),
];
const path = new THREE.CatmullRomCurve3(pathPoints);

const pathGeometry = new THREE.TubeGeometry(path, 200, 0.2, 8, false);
const pathMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700 });
const pathMesh = new THREE.Mesh(pathGeometry, pathMaterial);
scene.add(pathMesh);

// Environment Creation Functions
function createForestEnvironment() {
  const planeGeometry = new THREE.PlaneGeometry(50, 50);
  const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0x2e8b57,
    roughness: 0.8,
    metalness: 0.2,
  });

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.set(0, 0, 0);
  scene.add(plane);

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
}

function createHiker(): THREE.Group {
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700 });
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const armMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
  
    // Body
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.5), bodyMaterial);
    body.position.y = 1;
  
    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.5), headMaterial);
    head.position.y = 2.2;
  
    // Legs
    const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1), legMaterial);
    const rightLeg = leftLeg.clone();
    leftLeg.position.set(-0.25, 0.5, 0);
    rightLeg.position.set(0.25, 0.5, 0);
  
    // Arms
    const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1), armMaterial);
    const rightArm = leftArm.clone();
    leftArm.rotation.z = Math.PI / 4;
    rightArm.rotation.z = -Math.PI / 4;
    leftArm.position.set(-0.7, 1.2, 0);
    rightArm.position.set(0.7, 1.2, 0);
  
    // Grouping all parts
    const hiker = new THREE.Group();
    hiker.add(body, head, leftLeg, rightLeg, leftArm, rightArm);
    hiker.position.set(0, 0.5, 0);

    return hiker;
}

function createWinterEnvironment() {
  const planeGeometry = new THREE.PlaneGeometry(50, 50);
  const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.set(50, 0, 0);
  scene.add(plane);

  const treeMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
  const snowMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

  function addSnowyTree(x, z) {
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.2, 2),
      treeMaterial
    );
    trunk.position.set(x + 50, 1, z);

    const foliage = new THREE.Mesh(
      new THREE.ConeGeometry(1, 2, 8),
      snowMaterial
    );
    foliage.position.set(x + 50, 3, z);

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
  plane.position.set(100, 0, 0);
  scene.add(plane);

  const fireplace = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 3),
    new THREE.MeshStandardMaterial({ color: 0xff4500 })
  );
  fireplace.position.set(100, 1.5, 0);
  scene.add(fireplace);

  const logs = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 3),
    new THREE.MeshStandardMaterial({ color: 0x8b4513 })
  );
  logs.rotation.z = Math.PI / 2;
  logs.position.set(100, 0.5, -3);
  scene.add(logs);

  // Add a directional light near the fireplace
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(110, 10, 10); // Position it above and to the side
  directionalLight.target.position.set(100, 0, 5); // Aim at the fireplace
  scene.add(directionalLight);

  // Add a helper light for the model
  const helperLight = new THREE.PointLight(0xffffff, 1, 50);
  helperLight.position.set(100, 5, 5); // Position near the model
  scene.add(helperLight);

  // Load the 3D model
  const loader = new FBXLoader();
  loader.load(
    "./source/untitled.fbx", // Path to your FBX file
    (fbx) => {
      fbx.scale.set(0.02, 0.02, 0.02); // Adjust the scale if needed
      fbx.position.set(100, 0, 5); // Position the model near the fireplace
      fbx.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      scene.add(fbx);
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (error) => {
      console.error("An error occurred while loading the model:", error);
    }
  );
}

// Create all environments
createForestEnvironment();
createWinterEnvironment();
createFireplaceEnvironment();

// Character Movement
function moveCharacter() {
  if (keys["ArrowUp"]) currentProgress += pathSpeed;
  if (keys["ArrowDown"]) currentProgress -= pathSpeed;

  currentProgress = THREE.MathUtils.clamp(currentProgress, 0, 1);

  const position = path.getPointAt(currentProgress);
  const tangent = path.getTangentAt(currentProgress);

  character.position.copy(position);
  character.lookAt(position.clone().add(tangent));

  // Adjust camera to follow character and stay at a fixed offset
  const relativeCameraOffset = new THREE.Vector3(0, 5, -10);
  const cameraOffset = relativeCameraOffset.applyMatrix4(character.matrixWorld);

  camera.position.lerp(cameraOffset, 0.1);
  camera.lookAt(currentProgress < 1 ? path.getPointAt(currentProgress + 0.01) : path.getPointAt(1));
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  moveCharacter();
  renderer.render(scene, camera);
}

// Event Listeners
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener("keydown", (event) => {
  keys[event.key] = true;
});

window.addEventListener("keyup", (event) => {
  keys[event.key] = false;
});

// Initialize
animate();
