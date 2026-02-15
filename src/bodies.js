import * as THREE from 'three';

// Realistic values (scaled down) and pretty values for display
// Distances in AU-ish units, sizes exaggerated for visibility
const PLANET_DATA = [
  {
    name: 'Mercury',
    color: 0xb5b5b5,
    prettyRadius: 0.4,
    realRadius: 0.38,
    prettyOrbitRadius: 8,
    realOrbitRadius: 3.9,
    orbitSpeed: 4.15,
    facts: {
      type: 'Terrestrial planet',
      diameter: '4,880 km',
      distFromSun: '57.9 million km',
      orbitalPeriod: '88 Earth days',
      dayLength: '59 Earth days',
      temperature: '-180 to 430 °C',
      funFact: 'Mercury has no atmosphere, so there is no wind or weather. Despite being closest to the Sun, it is not the hottest planet.',
    },
    moons: [],
  },
  {
    name: 'Venus',
    color: 0xe8cda0,
    prettyRadius: 0.6,
    realRadius: 0.95,
    prettyOrbitRadius: 13,
    realOrbitRadius: 7.2,
    orbitSpeed: 1.62,
    facts: {
      type: 'Terrestrial planet',
      diameter: '12,104 km',
      distFromSun: '108.2 million km',
      orbitalPeriod: '225 Earth days',
      dayLength: '243 Earth days',
      temperature: '462 °C (average)',
      funFact: 'Venus spins backwards compared to most planets, and its day is longer than its year. Its thick atmosphere traps heat, making it the hottest planet.',
    },
    moons: [],
  },
  {
    name: 'Earth',
    color: 0x4a90d9,
    prettyRadius: 0.65,
    realRadius: 1.0,
    prettyOrbitRadius: 18,
    realOrbitRadius: 10.0,
    orbitSpeed: 1.0,
    facts: {
      type: 'Terrestrial planet',
      diameter: '12,742 km',
      distFromSun: '149.6 million km',
      orbitalPeriod: '365.25 days',
      dayLength: '24 hours',
      temperature: '-88 to 58 °C',
      funFact: 'Earth is the only known planet to support life. About 71% of its surface is covered in water, earning it the nickname "the Blue Marble".',
    },
    moons: [
      {
        name: 'Moon', color: 0xcccccc, radius: 0.18, orbitRadius: 1.8, orbitSpeed: 13.0,
        facts: {
          type: 'Natural satellite',
          diameter: '3,474 km',
          distFromParent: '384,400 km',
          orbitalPeriod: '27.3 days',
          funFact: 'The Moon is slowly drifting away from Earth at about 3.8 cm per year. Its gravitational pull is responsible for our ocean tides.',
        },
      },
    ],
  },
  {
    name: 'Mars',
    color: 0xc1440e,
    prettyRadius: 0.45,
    realRadius: 0.53,
    prettyOrbitRadius: 23,
    realOrbitRadius: 15.2,
    orbitSpeed: 0.53,
    facts: {
      type: 'Terrestrial planet',
      diameter: '6,779 km',
      distFromSun: '227.9 million km',
      orbitalPeriod: '687 Earth days',
      dayLength: '24.6 hours',
      temperature: '-140 to 20 °C',
      funFact: 'Mars is home to Olympus Mons, the tallest volcano in the solar system at 21.9 km high — nearly 2.5 times the height of Everest.',
    },
    moons: [
      {
        name: 'Phobos', color: 0x999999, radius: 0.08, orbitRadius: 1.2, orbitSpeed: 30.0,
        facts: {
          type: 'Natural satellite',
          diameter: '22.4 km',
          distFromParent: '9,376 km',
          orbitalPeriod: '7.7 hours',
          funFact: 'Phobos orbits Mars faster than Mars rotates, so it rises in the west and sets in the east. It is slowly spiralling inward and will eventually break apart.',
        },
      },
      {
        name: 'Deimos', color: 0x888888, radius: 0.06, orbitRadius: 1.8, orbitSpeed: 10.0,
        facts: {
          type: 'Natural satellite',
          diameter: '12.4 km',
          distFromParent: '23,460 km',
          orbitalPeriod: '30.3 hours',
          funFact: 'Deimos is one of the smallest moons in the solar system. From the surface of Mars, it would appear as a bright star rather than a disc.',
        },
      },
    ],
  },
  {
    name: 'Jupiter',
    color: 0xc88b3a,
    prettyRadius: 1.8,
    realRadius: 11.2,
    prettyOrbitRadius: 32,
    realOrbitRadius: 52.0,
    orbitSpeed: 0.084,
    facts: {
      type: 'Gas giant',
      diameter: '139,820 km',
      distFromSun: '778.5 million km',
      orbitalPeriod: '11.86 Earth years',
      dayLength: '9.9 hours',
      temperature: '-110 °C (cloud top)',
      funFact: 'Jupiter\'s Great Red Spot is a storm larger than Earth that has been raging for at least 350 years. Jupiter has at least 95 known moons.',
    },
    moons: [
      {
        name: 'Io', color: 0xdddd44, radius: 0.15, orbitRadius: 3.0, orbitSpeed: 20.0,
        facts: {
          type: 'Natural satellite',
          diameter: '3,643 km',
          distFromParent: '421,700 km',
          orbitalPeriod: '1.77 days',
          funFact: 'Io is the most volcanically active body in the solar system, with over 400 active volcanoes driven by tidal heating from Jupiter\'s immense gravity.',
        },
      },
      {
        name: 'Europa', color: 0xccbbaa, radius: 0.13, orbitRadius: 3.8, orbitSpeed: 14.0,
        facts: {
          type: 'Natural satellite',
          diameter: '3,122 km',
          distFromParent: '671,034 km',
          orbitalPeriod: '3.55 days',
          funFact: 'Europa has a subsurface ocean beneath its icy crust that may contain more water than all of Earth\'s oceans combined — making it a prime candidate for extraterrestrial life.',
        },
      },
      {
        name: 'Ganymede', color: 0xaaaaaa, radius: 0.2, orbitRadius: 4.8, orbitSpeed: 8.0,
        facts: {
          type: 'Natural satellite',
          diameter: '5,268 km',
          distFromParent: '1,070,400 km',
          orbitalPeriod: '7.15 days',
          funFact: 'Ganymede is the largest moon in the solar system — even bigger than Mercury. It is the only moon known to have its own magnetic field.',
        },
      },
      {
        name: 'Callisto', color: 0x888899, radius: 0.18, orbitRadius: 5.8, orbitSpeed: 5.0,
        facts: {
          type: 'Natural satellite',
          diameter: '4,821 km',
          distFromParent: '1,882,700 km',
          orbitalPeriod: '16.69 days',
          funFact: 'Callisto is the most heavily cratered object in the solar system. Its surface has remained largely unchanged for over 4 billion years.',
        },
      },
    ],
  },
  {
    name: 'Saturn',
    color: 0xe8d191,
    prettyRadius: 1.5,
    realRadius: 9.45,
    prettyOrbitRadius: 44,
    realOrbitRadius: 95.0,
    orbitSpeed: 0.034,
    hasRings: true,
    facts: {
      type: 'Gas giant',
      diameter: '116,460 km',
      distFromSun: '1.43 billion km',
      orbitalPeriod: '29.46 Earth years',
      dayLength: '10.7 hours',
      temperature: '-140 °C (cloud top)',
      funFact: 'Saturn\'s rings are made of billions of chunks of ice and rock. Despite its enormous size, Saturn is less dense than water — it would float in a giant bathtub.',
    },
    moons: [
      {
        name: 'Titan', color: 0xddaa55, radius: 0.2, orbitRadius: 4.0, orbitSpeed: 6.0,
        facts: {
          type: 'Natural satellite',
          diameter: '5,150 km',
          distFromParent: '1,221,870 km',
          orbitalPeriod: '15.95 days',
          funFact: 'Titan is the only moon with a thick atmosphere and the only body besides Earth with stable surface lakes — though they\'re filled with liquid methane and ethane.',
        },
      },
    ],
  },
  {
    name: 'Uranus',
    color: 0x7ec8e3,
    prettyRadius: 1.1,
    realRadius: 4.0,
    prettyOrbitRadius: 56,
    realOrbitRadius: 192.0,
    orbitSpeed: 0.012,
    facts: {
      type: 'Ice giant',
      diameter: '50,724 km',
      distFromSun: '2.87 billion km',
      orbitalPeriod: '84 Earth years',
      dayLength: '17.2 hours',
      temperature: '-224 °C',
      funFact: 'Uranus rotates on its side, with an axial tilt of 98 degrees — likely caused by a collision with an Earth-sized object long ago. It also has faint rings.',
    },
    moons: [
      {
        name: 'Titania', color: 0xaabbcc, radius: 0.12, orbitRadius: 3.0, orbitSpeed: 8.0,
        facts: {
          type: 'Natural satellite',
          diameter: '1,578 km',
          distFromParent: '435,910 km',
          orbitalPeriod: '8.71 days',
          funFact: 'Titania is the largest moon of Uranus. It has enormous canyons and scarps stretching hundreds of kilometres, suggesting past geological activity.',
        },
      },
    ],
  },
  {
    name: 'Neptune',
    color: 0x3f54ba,
    prettyRadius: 1.05,
    realRadius: 3.88,
    prettyOrbitRadius: 68,
    realOrbitRadius: 300.0,
    orbitSpeed: 0.006,
    facts: {
      type: 'Ice giant',
      diameter: '49,528 km',
      distFromSun: '4.5 billion km',
      orbitalPeriod: '164.8 Earth years',
      dayLength: '16.1 hours',
      temperature: '-214 °C',
      funFact: 'Neptune has the strongest winds in the solar system, reaching speeds of 2,100 km/h. It was the first planet found by mathematical prediction rather than observation.',
    },
    moons: [
      {
        name: 'Triton', color: 0x99aacc, radius: 0.14, orbitRadius: 3.2, orbitSpeed: 7.0,
        facts: {
          type: 'Natural satellite',
          diameter: '2,707 km',
          distFromParent: '354,759 km',
          orbitalPeriod: '5.88 days (retrograde)',
          funFact: 'Triton orbits Neptune backwards, suggesting it was captured from the Kuiper Belt. It has active geysers that shoot nitrogen gas 8 km into the sky.',
        },
      },
    ],
  },
];

const SUN_DATA = {
  name: 'Sun',
  color: 0xffcc33,
  prettyRadius: 3.0,
  realRadius: 109.0, // relative to Earth
};

function createLowPolyMesh(radius, color, isSun = false) {
  const geometry = new THREE.IcosahedronGeometry(radius, 1);
  let material;
  if (isSun) {
    material = new THREE.MeshBasicMaterial({ color });
  } else {
    material = new THREE.MeshStandardMaterial({ color, flatShading: true });
  }
  return new THREE.Mesh(geometry, material);
}

function createRings(planetRadius) {
  const innerRadius = planetRadius * 1.4;
  const outerRadius = planetRadius * 2.3;
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 32);
  const material = new THREE.MeshStandardMaterial({
    color: 0xc2a868,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.6,
    flatShading: true,
  });
  const ring = new THREE.Mesh(geometry, material);
  ring.rotation.x = -Math.PI / 2.2;
  return ring;
}

export function createSolarSystem() {
  const solarSystem = new THREE.Group();
  const bodies = []; // track for animation

  // Sun
  const sunMesh = createLowPolyMesh(SUN_DATA.prettyRadius, SUN_DATA.color, true);
  solarSystem.add(sunMesh);
  bodies.push({
    name: SUN_DATA.name,
    mesh: sunMesh,
    group: null,
    isSun: true,
    prettyRadius: SUN_DATA.prettyRadius,
    realRadius: SUN_DATA.realRadius,
  });

  // Sun glow
  const glowGeometry = new THREE.IcosahedronGeometry(SUN_DATA.prettyRadius * 1.3, 1);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffcc33,
    transparent: true,
    opacity: 0.15,
  });
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  sunMesh.add(glow);

  // Planets
  for (const data of PLANET_DATA) {
    const planetGroup = new THREE.Group();
    const planetMesh = createLowPolyMesh(data.prettyRadius, data.color);
    planetGroup.add(planetMesh);

    if (data.hasRings) {
      const rings = createRings(data.prettyRadius);
      planetMesh.add(rings);
    }

    // Position planet at its orbit
    planetGroup.position.set(data.prettyOrbitRadius, 0, 0);
    solarSystem.add(planetGroup);

    const planetBody = {
      name: data.name,
      mesh: planetMesh,
      group: planetGroup,
      angle: Math.random() * Math.PI * 2, // random starting position
      orbitSpeed: data.orbitSpeed,
      prettyOrbitRadius: data.prettyOrbitRadius,
      realOrbitRadius: data.realOrbitRadius,
      prettyRadius: data.prettyRadius,
      realRadius: data.realRadius,
      hasRings: data.hasRings || false,
      facts: data.facts || null,
      moons: [],
    };

    // Moons
    for (const moonData of data.moons) {
      const moonMesh = createLowPolyMesh(moonData.radius, moonData.color);
      moonMesh.position.set(moonData.orbitRadius, 0, 0);
      planetGroup.add(moonMesh);

      planetBody.moons.push({
        name: moonData.name,
        mesh: moonMesh,
        angle: Math.random() * Math.PI * 2,
        orbitRadius: moonData.orbitRadius,
        orbitSpeed: moonData.orbitSpeed,
        radius: moonData.radius,
        facts: moonData.facts || null,
      });
    }

    bodies.push(planetBody);
  }

  return { solarSystem, bodies };
}
