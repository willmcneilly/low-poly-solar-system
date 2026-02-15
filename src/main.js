import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createSolarSystem } from './bodies.js';
import { createOrbitLines, updateOrbitLines } from './orbits.js';
import { createLabels, updateLabels } from './labels.js';
import { createUI } from './ui.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0e0a1a);
scene.fog = new THREE.FogExp2(0x0e0a1a, 0.0012);

// Camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  2000,
);
camera.position.set(30, 25, 40);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 5;
controls.maxDistance = 500;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xffffee, 2, 500);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// Diamond-shaped star texture for low-poly feel
function createDiamondTexture() {
  const size = 32;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const half = size / 2;
  ctx.beginPath();
  ctx.moveTo(half, 0);
  ctx.lineTo(size, half);
  ctx.lineTo(half, size);
  ctx.lineTo(0, half);
  ctx.closePath();
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  const texture = new THREE.CanvasTexture(canvas);
  texture.premultiplyAlpha = false;
  return texture;
}
const starTexture = createDiamondTexture();

// Starfield — two layers for depth
function createStarLayer(count, minR, maxR, size, color, opacity) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = minR + Math.random() * (maxR - minR);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color,
    size,
    map: starTexture,
    sizeAttenuation: true,
    transparent: true,
    opacity,
    alphaTest: 0.01,
  });
  // Exempt from fog so distant stars don't vanish
  material.fog = false;
  return new THREE.Points(geometry, material);
}

// Bright nearby stars
scene.add(createStarLayer(600, 200, 500, 1.2, 0xffffff, 0.9));
// Soft distant stars — larger, dimmer, slightly blue-purple
scene.add(createStarLayer(800, 500, 900, 2.5, 0xbbbbff, 0.3));
// Faint dust — very large, very dim, gives that hazy glow
scene.add(createStarLayer(300, 300, 800, 5.0, 0x8866aa, 0.08));

// Solar system
const { solarSystem, bodies } = createSolarSystem();
scene.add(solarSystem);

// Orbit lines
const orbitLines = createOrbitLines(bodies);
for (const orbit of orbitLines) {
  scene.add(orbit.line);
}

// Labels
createLabels(bodies);

// UI
const uiState = createUI();

// Raycasting for planet selection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Collect all clickable meshes mapped to their body
const clickTargets = [];
for (const body of bodies) {
  if (body.isSun) continue;
  clickTargets.push({ mesh: body.mesh, body, isMoon: false });
  for (const moon of body.moons) {
    clickTargets.push({ mesh: moon.mesh, body: moon, isMoon: true, parentBody: body });
  }
}

renderer.domElement.addEventListener('pointermove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const meshes = clickTargets.map((t) => t.mesh);
  const intersects = raycaster.intersectObjects(meshes, false);
  renderer.domElement.style.cursor = intersects.length > 0 ? 'pointer' : '';
});

renderer.domElement.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const meshes = clickTargets.map((t) => t.mesh);
  const intersects = raycaster.intersectObjects(meshes, false);

  if (intersects.length > 0) {
    const hit = clickTargets.find((t) => t.mesh === intersects[0].object);
    if (hit) {
      // Follow the parent planet (or the planet itself)
      const followBody = hit.isMoon ? hit.parentBody : hit.body;
      uiState.follow(followBody);
      controls.enabled = false;
      // Show info for whichever body was actually clicked
      uiState.showInfo(hit.body.name, hit.body.facts);
    }
  } else if (uiState.followTarget) {
    uiState.exitFollow();
  }
});

// Build flat navigation list: Mercury, Venus, Earth, Moon, Mars, Phobos, Deimos, ...
const navList = [];
for (const body of bodies) {
  if (body.isSun) continue;
  navList.push({ name: body.name, facts: body.facts, body, parentBody: null });
  for (const moon of body.moons) {
    navList.push({ name: moon.name, facts: moon.facts, body: moon, parentBody: body });
  }
}
uiState._navList = navList;

// Restore orbit controls when exiting follow mode
uiState._onExitFollow = () => {
  controls.enabled = true;
};

// Handle arrow navigation — update follow camera target
uiState._onNavigate = (entry) => {
  controls.enabled = false;
};

// Vectors reused each frame for follow camera
const _followCamPos = new THREE.Vector3();
const _followLookAt = new THREE.Vector3();
const _sunOrigin = new THREE.Vector3(0, 0, 0);

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const scaleFactor = uiState.scaleFactor;
  const timeScale = uiState.paused ? 0 : uiState.timeScale;

  for (const body of bodies) {
    if (body.isSun) {
      // Update sun size based on scale
      const sunRadius = THREE.MathUtils.lerp(body.prettyRadius, body.realRadius, scaleFactor);
      body.mesh.scale.setScalar(sunRadius / body.prettyRadius);
      continue;
    }

    // Update planet angle
    const angleDelta = body.orbitSpeed * timeScale * delta * 0.5;
    body.angle += angleDelta;

    // Track Earth days
    if (body.name === 'Earth') {
      uiState.updateDate(angleDelta);
    }

    // Interpolate orbit radius
    const orbitRadius = THREE.MathUtils.lerp(
      body.prettyOrbitRadius,
      body.realOrbitRadius,
      scaleFactor,
    );

    // Position planet group
    body.group.position.x = Math.cos(body.angle) * orbitRadius;
    body.group.position.z = Math.sin(body.angle) * orbitRadius;

    // Update planet size based on scale
    const planetRadius = THREE.MathUtils.lerp(body.prettyRadius, body.realRadius, scaleFactor);
    body.mesh.scale.setScalar(planetRadius / body.prettyRadius);

    // Update rings if present
    // (rings scale with the mesh since they're children)

    // Update moons
    for (const moon of body.moons) {
      moon.angle += moon.orbitSpeed * timeScale * delta * 0.5;
      moon.mesh.position.x = Math.cos(moon.angle) * moon.orbitRadius;
      moon.mesh.position.z = Math.sin(moon.angle) * moon.orbitRadius;
    }
  }

  // Update orbit line geometry
  updateOrbitLines(orbitLines, scaleFactor);
  updateLabels(clock.elapsedTime);

  // Follow camera mode
  if (uiState.followTarget) {
    const body = uiState.followTarget;
    const planetPos = body.group.position;

    // Ease the transition in
    uiState.followTransition = Math.min(uiState.followTransition + delta * 2.0, 1.0);
    const t = uiState.followTransition;
    const smooth = t * t * (3 - 2 * t); // smoothstep

    // Camera sits behind the planet (away from sun), slightly above
    const currentRadius = THREE.MathUtils.lerp(
      body.prettyRadius, body.realRadius, scaleFactor,
    );
    const dir = planetPos.clone().normalize();
    const behindOffset = currentRadius * 3 + 2;
    const heightOffset = currentRadius * 1.5 + 1;

    _followCamPos.copy(planetPos).addScaledVector(dir, behindOffset);
    _followCamPos.y += heightOffset;

    camera.position.lerp(_followCamPos, smooth);

    // Look toward the sun
    _followLookAt.copy(_sunOrigin);
    controls.target.lerp(_followLookAt, smooth);
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();
