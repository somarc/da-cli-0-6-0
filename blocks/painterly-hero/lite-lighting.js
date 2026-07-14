/**
 * Renderaissance cutout lighting (depth: lit)
 * Tarot-derived WebGL2 contract — soft wrap, candle key, cool ambient.
 * Progressive: call only when maps exist; dispose on failure.
 */

const VERT = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 frag;

uniform sampler2D uDiffuse;
uniform sampler2D uNormal;
uniform sampler2D uRough;
uniform sampler2D uHeight;

uniform vec2  uMouse;
uniform float uHasMouse;
uniform float uParallax;
uniform float uLightZ;
uniform float uNormalStr;
uniform float uSpecStr;
uniform float uDiffuseAmt;
uniform float uAmbientAmt;
uniform vec3  uLightColor;
uniform vec3  uAmbientColor;
uniform float uMotion;

void main() {
  vec2 uv = vUv;

  float h0 = texture(uHeight, uv).r;
  if (uMotion > 0.5 && uHasMouse > 0.5) {
    vec2 viewOff = (uMouse - vec2(0.5)) * 2.0;
    uv = clamp(uv - viewOff * (h0 * uParallax), 0.001, 0.999);
  }

  vec4 diff = texture(uDiffuse, uv);
  float a = diff.a;
  // Cream-plate path: treat near-paper as full alpha (opaque plate on paper)
  if (a < 0.004) a = 1.0;

  vec3 albedo = diff.rgb;
  float rough = texture(uRough, uv).r;
  float h = texture(uHeight, uv).r;

  vec3 nRaw = texture(uNormal, uv).xyz * 2.0 - 1.0;
  nRaw.xy *= uNormalStr;
  vec3 N = normalize(vec3(nRaw.xy, max(nRaw.z, 0.08)));

  vec3 V = vec3(0.0, 0.0, 1.0);
  float ambRelief = 0.74 + 0.26 * max(N.z, 0.0);
  vec3 col = albedo * uAmbientColor * uAmbientAmt * ambRelief;

  vec2 lightUv = (uHasMouse > 0.5) ? uMouse : vec2(0.44, 0.66);
  vec3 L = normalize(vec3(lightUv.x - uv.x, lightUv.y - uv.y, uLightZ));
  float ndl = max(dot(N, L), 0.0);
  float wrap = ndl * 0.8 + 0.2;
  col += albedo * uLightColor * (wrap * uDiffuseAmt);

  vec3 H = normalize(L + V);
  float shininess = mix(52.0, 6.0, clamp(rough, 0.0, 1.0));
  float spec = pow(max(dot(N, H), 0.0), shininess);
  spec *= (1.0 - rough * 0.85) * uSpecStr;
  spec *= 0.82 + 0.34 * h;
  col += uLightColor * spec;

  float rim = pow(1.0 - max(dot(N, V), 0.0), 2.4);
  float side = 1.0 - abs(L.z);
  col += uLightColor * rim * side * 0.1 * (1.0 - rough * 0.5);

  col = clamp(col, 0.0, 1.0);
  frag = vec4(col, 1.0);
}`;

/**
 * Helix serves responsive `?width=750` for LCP imgs. Sampling those into
 * WebGL looks pixelated when the canvas is larger — prefer width=2000.
 */
function bestMediaUrl(src) {
  if (!src) return src;
  try {
    const u = new URL(src, window.location.href);
    if (u.searchParams.has('width') || /media_\w+\./.test(u.pathname)) {
      u.searchParams.set('width', '2000');
      if (!u.searchParams.has('format')) u.searchParams.set('format', 'webply');
      u.searchParams.set('optimize', 'medium');
    }
    return u.href;
  } catch {
    return src;
  }
}

/** Prefer largest picture source, else bump the img URL. */
function bestSrcFromImg(imgEl) {
  if (!imgEl) return '';
  const pic = imgEl.closest('picture');
  let best = imgEl.currentSrc || imgEl.src || '';
  let bestW = 0;
  if (pic) {
    pic.querySelectorAll('source[srcset]').forEach((source) => {
      source.srcset.split(',').forEach((part) => {
        const url = part.trim().split(/\s+/)[0];
        const m = part.match(/width=(\d+)/) || part.match(/\s(\d+)w/);
        const w = m ? parseInt(m[1], 10) : 0;
        if (url && w >= bestW) {
          bestW = w;
          best = url;
        }
      });
    });
  }
  return bestMediaUrl(best);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const el = new Image();
    el.decoding = 'async';
    el.crossOrigin = 'anonymous';
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error(`Failed to load ${src}`));
    el.src = src;
  });
}

/**
 * @param {HTMLImageElement} imgEl LCP diffuse image
 * @param {{ normal: string, rough: string, height: string }} maps
 */
async function enhance(imgEl, maps) {
  if (!imgEl || !maps?.normal) return null;
  if (!('WebGL2RenderingContext' in window)) return null;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mount = imgEl.closest('.ph-layer') || imgEl.parentElement;
  if (!mount) return null;

  const canvas = document.createElement('canvas');
  canvas.className = 'ph-lit-canvas';
  canvas.setAttribute('aria-hidden', 'true');

  const gl = canvas.getContext('webgl2', {
    alpha: true,
    premultipliedAlpha: true,
    antialias: true,
  });
  if (!gl) return null;

  const compile = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      gl.deleteShader(s);
      return null;
    }
    return s;
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

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1, 3, -1, -1, 3,
  ]), gl.STATIC_DRAW);

  const loc = gl.getAttribLocation(prog, 'aPos');
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const U = {};
  [
    'uDiffuse', 'uNormal', 'uRough', 'uHeight',
    'uMouse', 'uHasMouse', 'uParallax', 'uLightZ', 'uNormalStr',
    'uSpecStr', 'uDiffuseAmt', 'uAmbientAmt', 'uLightColor', 'uAmbientColor',
    'uMotion',
  ].forEach((n) => { U[n] = gl.getUniformLocation(prog, n); });

  gl.uniform1i(U.uDiffuse, 0);
  gl.uniform1i(U.uNormal, 1);
  gl.uniform1i(U.uRough, 2);
  gl.uniform1i(U.uHeight, 3);
  // Candle key + cool ambient (Tarot)
  gl.uniform3f(U.uLightColor, 1.0, 0.92, 0.78);
  gl.uniform3f(U.uAmbientColor, 0.92, 0.90, 0.86);
  gl.uniform1f(U.uAmbientAmt, 0.62);
  gl.uniform1f(U.uDiffuseAmt, 0.48);
  gl.uniform1f(U.uSpecStr, 0.22);
  gl.uniform1f(U.uNormalStr, 1.05);
  gl.uniform1f(U.uLightZ, 0.58);
  gl.uniform1f(U.uParallax, reduce ? 0.0 : 0.0026);
  gl.uniform1f(U.uMotion, reduce ? 0.0 : 1.0);
  gl.uniform1f(U.uHasMouse, 0.0);
  gl.uniform2f(U.uMouse, 0.44, 0.66);

  const anisoExt = gl.getExtension('EXT_texture_filter_anisotropic')
    || gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic');
  const maxAniso = anisoExt
    ? Math.min(8, gl.getParameter(anisoExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT))
    : 0;

  const makeTex = (unit) => {
    const t = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    if (anisoExt && maxAniso > 1) {
      gl.texParameterf(gl.TEXTURE_2D, anisoExt.TEXTURE_MAX_ANISOTROPY_EXT, maxAniso);
    }
    return t;
  };

  const texDiffuse = makeTex(0);
  const texNormal = makeTex(1);
  const texRough = makeTex(2);
  const texHeight = makeTex(3);

  const upload = (tex, unit, image, internalFormat, format) => {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, format, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    if (anisoExt && maxAniso > 1) {
      gl.texParameterf(gl.TEXTURE_2D, anisoExt.TEXTURE_MAX_ANISOTROPY_EXT, maxAniso);
    }
  };

  // Always reload at width=2000 — never sample the 750px LCP img into GL
  try {
    const diffuseUrl = bestSrcFromImg(imgEl);
    const [diffuseImg, normal, rough, height] = await Promise.all([
      loadImage(diffuseUrl),
      loadImage(bestMediaUrl(maps.normal)),
      loadImage(bestMediaUrl(maps.rough)),
      loadImage(bestMediaUrl(maps.height)),
    ]);
    upload(texDiffuse, 0, diffuseImg, gl.RGBA, gl.RGBA);
    upload(texNormal, 1, normal, gl.RGB, gl.RGB);
    upload(texRough, 2, rough, gl.RGB, gl.RGB);
    upload(texHeight, 3, height, gl.RGB, gl.RGB);
  } catch {
    return null;
  }

  mount.appendChild(canvas);
  mount.classList.add('is-webgl');
  imgEl.setAttribute('aria-hidden', 'true');

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  let needsDraw = true;
  let disposed = false;
  const mouse = { x: 0.44, y: 0.66 };
  let hasMouse = false;

  function resize() {
    const w0 = canvas.offsetWidth || mount.clientWidth;
    const h0 = canvas.offsetHeight || mount.clientHeight;
    if (w0 < 2 || h0 < 2) return;
    // Match device pixels; cap buffer so mid-tier GPUs stay calm
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const maxEdge = 2048;
    let w = Math.max(1, Math.round(w0 * dpr));
    let h = Math.max(1, Math.round(h0 * dpr));
    if (w > maxEdge || h > maxEdge) {
      const s = maxEdge / Math.max(w, h);
      w = Math.max(1, Math.round(w * s));
      h = Math.max(1, Math.round(h * s));
    }
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      needsDraw = true;
    }
  }

  function draw() {
    resize();
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(U.uMouse, mouse.x, mouse.y);
    gl.uniform1f(U.uHasMouse, hasMouse ? 1.0 : 0.0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texDiffuse);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texNormal);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, texRough);
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, texHeight);
    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function frame() {
    if (disposed) return;
    if (needsDraw) {
      needsDraw = false;
      draw();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  const onPointer = (e) => {
    if (reduce || disposed) return;
    const r = canvas.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;
    const x = (e.clientX - r.left) / r.width;
    const y = 1.0 - (e.clientY - r.top) / r.height;
    mouse.x = Math.min(1.4, Math.max(-0.4, x));
    mouse.y = Math.min(1.4, Math.max(-0.4, y));
    hasMouse = true;
    needsDraw = true;
  };

  if (!reduce) {
    window.addEventListener('mousemove', onPointer, { passive: true });
  }

  window.addEventListener('resize', () => {
    if (!disposed) needsDraw = true;
  }, { passive: true });

  return {
    dispose() {
      disposed = true;
      window.removeEventListener('mousemove', onPointer);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      mount.classList.remove('is-webgl');
      imgEl.removeAttribute('aria-hidden');
    },
  };
}

export default enhance;
