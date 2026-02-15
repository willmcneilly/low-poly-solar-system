import * as THREE from 'three';

export function createOrbitLines(bodies) {
  const orbitLines = [];
  const segments = 128;

  for (const body of bodies) {
    if (body.isSun) continue;

    // Planet orbit around sun
    const orbitRadius = body.prettyOrbitRadius;
    const points = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(
        Math.cos(theta) * orbitRadius,
        0,
        Math.sin(theta) * orbitRadius,
      ));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.15,
    });
    const line = new THREE.LineLoop(geometry, material);

    orbitLines.push({
      line,
      body,
      prettyOrbitRadius: body.prettyOrbitRadius,
      realOrbitRadius: body.realOrbitRadius,
    });

    // Moon orbit lines (parented to planet group)
    for (const moon of body.moons) {
      const moonPoints = [];
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        moonPoints.push(new THREE.Vector3(
          Math.cos(theta) * moon.orbitRadius,
          0,
          Math.sin(theta) * moon.orbitRadius,
        ));
      }
      const moonGeometry = new THREE.BufferGeometry().setFromPoints(moonPoints);
      const moonMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.1,
      });
      const moonLine = new THREE.LineLoop(moonGeometry, moonMaterial);
      body.group.add(moonLine);
    }
  }

  return orbitLines;
}

export function updateOrbitLines(orbitLines, scaleFactor) {
  const segments = 128;

  for (const orbit of orbitLines) {
    const radius = THREE.MathUtils.lerp(
      orbit.prettyOrbitRadius,
      orbit.realOrbitRadius,
      scaleFactor,
    );

    const positions = orbit.line.geometry.attributes.position.array;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = Math.sin(theta) * radius;
    }
    orbit.line.geometry.attributes.position.needsUpdate = true;
  }
}
