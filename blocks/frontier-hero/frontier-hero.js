/**
 * Frontier hero — poster-first raymarched shader plate.
 *
 * LCP is the authored poster image. If the engine has WebGL2 and the user
 * accepts motion, a raymarched gyroid lattice boots after first paint and
 * fades in over the poster. Pointer warps the field. Everything fails soft
 * back to the poster.
 *
 * Author shape (DA): one row, two cells — copy | poster image.
 * Optional config rows: "hue | 0–360", "preset | gyroid".
 *
 * Lab: Frontier (dogfood/LAB-FRONTIER.md).
 */

const FRAG = `#version 300 es
precision highp float;
out vec4 outColor;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uHue;

// Renderaissance brand ramp (linear-light values of the site palette).
const vec3 INK = vec3(0.012, 0.027, 0.114);    // #22315f cobalt ink
const vec3 COBALT = vec3(0.013, 0.048, 0.205); // #23407c navy fill
const vec3 TERRA = vec3(0.536, 0.087, 0.029);  // #c05433 terracotta
const vec3 PEACH = vec3(0.891, 0.592, 0.405);  // #f2c9a9 peach
const vec3 CHART = vec3(0.586, 0.797, 0.024);  // #c8e62f chartreuse
const vec3 CREAM = vec3(0.916, 0.859, 0.745);  // #f5eedf paper

// t in [0,1] walks ink -> cobalt -> terracotta -> peach.
vec3 ramp(float t) {
  t = clamp(t, 0.0, 1.0);
  vec3 a = mix(INK, COBALT, smoothstep(0.0, 0.35, t));
  vec3 b = mix(a, TERRA, smoothstep(0.35, 0.72, t));
  return mix(b, PEACH, smoothstep(0.72, 1.0, t));
}
float map(vec3 p) {
  float t = uTime * 0.2;
  p.xy += uMouse * 0.8;
  p += 0.38 * vec3(sin(p.z * 1.3 + t), sin(p.x * 1.15 - t), sin(p.y * 1.5 + t * 0.55));
  vec3 q = p * 1.55 + vec3(0.0, 0.0, t * 0.75);
  float g = abs(dot(sin(q), cos(q.zxy)));
  return g / 1.55 - 0.045;
}
void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / min(uRes.x, uRes.y);
  // uHue tilts the ramp warm (terracotta) or cool (cobalt) around the default.
  float tilt = (uHue - 40.0) / 360.0;
  vec3 ro = vec3(0.0, 0.0, 2.35);
  vec3 rd = normalize(vec3(uv, -1.45));
  float td = 0.0;
  bool hit = false;
  for (int i = 0; i < 64; i += 1) {
    float d = map(ro + rd * td);
    if (d < 0.002) { hit = true; break; }
    td += d * 0.85;
    if (td > 9.0) break;
  }
  vec3 fog = INK * 0.55;
  vec3 col = fog;
  if (hit) {
    vec3 p = ro + rd * td;
    vec2 e = vec2(0.002, 0.0);
    vec3 n = normalize(vec3(
      map(p + e.xyy) - map(p - e.xyy),
      map(p + e.yxy) - map(p - e.yxy),
      map(p + e.yyx) - map(p - e.yyx)));
    float dif = max(dot(n, normalize(vec3(0.5, 0.8, 0.6))), 0.0);
    float fre = pow(1.0 - max(dot(-rd, n), 0.0), 3.0);
    // slow band walks the brand ramp along the lattice
    float band = 0.5 + 0.5 * sin(p.z * 0.9 + td * 0.35 + uTime * 0.12);
    vec3 base = ramp(0.18 + 0.62 * band - tilt);
    col = base * (0.10 + 0.85 * dif) + CREAM * pow(dif, 6.0) * 0.18;
    // rim: peach glow with a chartreuse edge — the site's accent pair
    vec3 rim = mix(PEACH, CHART, smoothstep(0.55, 0.95, fre));
    col += fre * rim * 0.55;
    col = mix(col, fog, 1.0 - exp(-0.012 * td * td));
  }
  col *= 0.9;
  col *= 1.0 - 0.5 * dot(uv * 0.7, uv * 0.7);
  col = pow(max(col, vec3(0.0)), vec3(0.4545));
  outColor = vec4(col, 1.0);
}`;

const VERT = `#version 300 es
void main() {
  vec2 p = vec2(float(uint(gl_VertexID * 2) & 2u), float(uint(gl_VertexID) & 2u));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function classifyCopy(copy) {
  let sawHeading = false;
  [...copy.children].forEach((el) => {
    if (el.tagName === 'H1' || el.tagName === 'H2') {
      sawHeading = true;
      return;
    }
    if (el.tagName === 'P') {
      el.classList.add(sawHeading ? 'fh-lede' : 'fh-eyebrow');
    }
  });
}

function readConfig(rows) {
  const config = { hue: 40, preset: 'gyroid' };
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) return;
    const key = cells[0].textContent.trim().toLowerCase();
    const value = cells[1].textContent.trim();
    if (key === 'hue' && !Number.isNaN(Number(value))) {
      config.hue = Math.max(0, Math.min(360, Number(value)));
    }
    if (key === 'preset') config.preset = value.toLowerCase();
  });
  return config;
}

function makeRenderer(canvas, hue) {
  const gl = canvas.getContext('webgl2', {
    antialias: false,
    alpha: false,
    powerPreference: 'high-performance',
  });
  if (!gl) return null;

  const compile = (type, src) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return null;
    return shader;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  const uni = {
    res: gl.getUniformLocation(prog, 'uRes'),
    time: gl.getUniformLocation(prog, 'uTime'),
    mouse: gl.getUniformLocation(prog, 'uMouse'),
    hue: gl.getUniformLocation(prog, 'uHue'),
  };

  const scale = () => Math.min(window.devicePixelRatio || 1, 1.5) * 0.66;
  const state = {
    mouse: [0, 0],
    target: [0, 0],
    running: false,
    raf: 0,
    onFirstFrame: null,
  };

  function resize() {
    const s = scale();
    const w = Math.round(canvas.clientWidth * s);
    const h = Math.round(canvas.clientHeight * s);
    if (w && h && (canvas.width !== w || canvas.height !== h)) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  }

  function draw(timeMs) {
    resize();
    state.mouse[0] += (state.target[0] - state.mouse[0]) * 0.06;
    state.mouse[1] += (state.target[1] - state.mouse[1]) * 0.06;
    gl.uniform2f(uni.res, canvas.width, canvas.height);
    gl.uniform1f(uni.time, timeMs * 0.001);
    gl.uniform2f(uni.mouse, state.mouse[0], state.mouse[1]);
    gl.uniform1f(uni.hue, hue);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function frame(timeMs) {
    if (!state.running) return;
    draw(timeMs);
    if (state.onFirstFrame) {
      state.onFirstFrame();
      state.onFirstFrame = null;
    }
    state.raf = window.requestAnimationFrame(frame);
  }

  return {
    state,
    start() {
      if (state.running) return;
      state.running = true;
      state.raf = window.requestAnimationFrame(frame);
    },
    stop() {
      state.running = false;
      window.cancelAnimationFrame(state.raf);
    },
    /** Dev helper: render one frame synchronously and return a PNG data URL. */
    capture(timeMs = 4200) {
      resize();
      draw(timeMs);
      return canvas.toDataURL('image/png');
    },
  };
}

function bootShader(stage, canvas, hue) {
  const renderer = makeRenderer(canvas, hue);
  if (!renderer) return;

  renderer.state.onFirstFrame = () => stage.classList.add('fh-live');
  canvas.frontierCapture = (t) => renderer.capture(t);

  stage.addEventListener('pointermove', (e) => {
    const rect = stage.getBoundingClientRect();
    renderer.state.target[0] = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    renderer.state.target[1] = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
  }, { passive: true });

  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) renderer.start();
    else renderer.stop();
  }, { threshold: 0.05 });
  io.observe(stage);
}

export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const cells = [...rows[0].children];
  const copyCell = cells[0] || rows[0];
  const artCell = cells[1] || null;
  const config = readConfig(rows.slice(1));

  classifyCopy(copyCell);

  const stage = document.createElement('div');
  stage.className = 'fh-stage';
  stage.style.setProperty('--frontier-hue', config.hue);

  const poster = artCell ? (artCell.querySelector('picture') || artCell.querySelector('img')) : null;
  if (poster) {
    const wrap = document.createElement('div');
    wrap.className = 'fh-poster';
    wrap.append(poster);
    stage.append(wrap);
  }

  const canvas = document.createElement('canvas');
  canvas.className = 'fh-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  stage.append(canvas);

  const copy = document.createElement('div');
  copy.className = 'fh-copy';
  copy.append(...copyCell.childNodes);
  stage.append(copy);

  const hud = document.createElement('div');
  hud.className = 'fh-hud';
  ['WebGL2 · GLSL ES 3.00', 'raymarched SDF', 'poster-first LCP'].forEach((label) => {
    const chip = document.createElement('span');
    chip.textContent = label;
    hud.append(chip);
  });
  stage.append(hud);

  block.textContent = '';
  block.append(stage);

  if (prefersReducedMotion()) return;
  // Boot after first paint so the poster owns LCP.
  window.requestAnimationFrame(() => {
    window.setTimeout(() => bootShader(stage, canvas, config.hue), 0);
  });
}
