import * as THREE from 'three';

const FONT_SIZE = 44;
const PADDING_X = 32;
const PADDING_Y = 20;
const BORDER_RADIUS = 18;
const BORDER_WIDTH = 3;

// All active label canvases for animation
const labelCanvases = [];

function createTextTexture(text) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  ctx.font = `700 ${FONT_SIZE}px system-ui, sans-serif`;
  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;

  const pillW = textWidth + PADDING_X * 2;
  const pillH = FONT_SIZE + PADDING_Y * 2;
  // Extra margin for glow bleed
  const glowMargin = 24;
  canvas.width = THREE.MathUtils.ceilPowerOfTwo(pillW + BORDER_WIDTH * 2 + glowMargin * 2);
  canvas.height = THREE.MathUtils.ceilPowerOfTwo(pillH + BORDER_WIDTH * 2 + glowMargin * 2);

  // Store drawing params for animation redraws
  const params = { pillW, pillH, text };

  drawLabel(ctx, canvas, params, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.premultiplyAlpha = false;
  texture.colorSpace = THREE.SRGBColorSpace;

  labelCanvases.push({ canvas, ctx, params, texture });

  return { texture, aspect: canvas.width / canvas.height };
}

function drawLabel(ctx, canvas, params, pulseT) {
  const { pillW, pillH, text } = params;
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const x = cx - pillW / 2;
  const y = cy - pillH / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Pill path
  ctx.beginPath();
  ctx.roundRect(x, y, pillW, pillH, BORDER_RADIUS);

  // Fill
  ctx.fillStyle = '#080A1A';
  ctx.fill();

  // Pulsing border — muted blue-grey to vivid electric blue
  const r = Math.round(60 + (20 - 60) * pulseT);
  const g = Math.round(100 + (120 - 100) * pulseT);
  const b = Math.round(200 + (255 - 200) * pulseT);
  const a = (0.5 + 0.5 * pulseT).toFixed(2);
  const borderColor = `rgba(${r},${g},${b},${a})`;

  // Glow — shadow behind the border stroke
  ctx.shadowColor = `rgba(30, 100, 255, ${(0.6 * pulseT).toFixed(2)})`;
  ctx.shadowBlur = 12 + 10 * pulseT;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = BORDER_WIDTH;
  ctx.stroke();

  // Reset shadow so it doesn't affect text
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  // Text
  ctx.font = `700 ${FONT_SIZE}px system-ui, sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, cx, cy);
}

function createLabel(name, yOffset) {
  const { texture, aspect } = createTextTexture(name);
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
  });
  const sprite = new THREE.Sprite(material);
  const height = 0.8;
  sprite.scale.set(height * aspect, height, 1);
  sprite.position.y = yOffset;
  return sprite;
}

export function updateLabels(time) {
  // Smooth sine pulse: 0 → 1 → 0 over ~3 seconds
  const pulseT = (Math.sin(time * 2.0) + 1) / 2;

  for (const entry of labelCanvases) {
    drawLabel(entry.ctx, entry.canvas, entry.params, pulseT);
    entry.texture.needsUpdate = true;
  }
}

export function createLabels(bodies) {
  const labels = [];

  for (const body of bodies) {
    const yOffset = body.isSun
      ? body.prettyRadius + 1.0
      : body.prettyRadius + 0.6;

    const label = createLabel(body.name, yOffset);

    if (body.isSun) {
      body.mesh.add(label);
    } else {
      body.mesh.add(label);
    }

    labels.push({ label, body, baseYOffset: yOffset });

    // Moon labels
    if (body.moons) {
      for (const moon of body.moons) {
        const moonYOffset = moon.radius + 0.4;
        const moonLabel = createLabel(moon.name, moonYOffset);
        moonLabel.scale.multiplyScalar(0.6);
        moon.mesh.add(moonLabel);
        labels.push({ label: moonLabel, body: moon, baseYOffset: moonYOffset });
      }
    }
  }

  return labels;
}
