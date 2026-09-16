// Traînée fluide WebGL — Navier-Stokes simplifié (même famille que neonikala.com)
// Adapté du news-bot de ce portfolio : palette neon blue/pink/cyan, splats plus fins.
(function () {
  "use strict";

  var isTouchDevice = window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(hover: none)").matches ||
    ("ontouchstart" in window) ||
    (navigator.maxTouchPoints > 0);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (isTouchDevice) return;

  const DEFAULTS = {
    simResolution:       96,
    dyeResolution:       512,
    densityDissipation:  3.2,
    velocityDissipation: 1.8,
    pressure:            0.75,
    pressureIterations:  18,
    curl:                4,
    splatRadius:         0.09,
    splatForce:          1600,
    opacity:             0.88,
    canvasOpacity:       0.42,
  };

  // Palette neonikala : neon blue, pink, cyan
  const PALETTE = [
    { r: 0.47, g: 0.67, b: 1.0  },   // #78AAFF
    { r: 0.60, g: 0.75, b: 1.0  },   // bleu clair
    { r: 1.0,  g: 0.55, b: 0.78 },   // #FF8CC8
    { r: 0.90, g: 0.45, b: 0.72 },   // rose foncé
    { r: 0.47, g: 1.0,  b: 0.82 },   // #78FFD2
    { r: 0.55, g: 0.90, b: 0.95 },   // cyan clair
  ];

  const baseVertexShaderSource = `
    precision highp float;
    attribute vec2 aPosition;
    varying vec2 vUv, vL, vR, vT, vB;
    uniform vec2 texelSize;
    void main () {
      vUv = aPosition * 0.5 + 0.5;
      vL = vUv - vec2(texelSize.x, 0.0);
      vR = vUv + vec2(texelSize.x, 0.0);
      vT = vUv + vec2(0.0, texelSize.y);
      vB = vUv - vec2(0.0, texelSize.y);
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `;
  const clearShaderSource = `
    precision mediump float; precision mediump sampler2D;
    varying highp vec2 vUv; uniform sampler2D uTexture; uniform float value;
    void main () { gl_FragColor = value * texture2D(uTexture, vUv); }
  `;
  const splatShaderSource = `
    precision highp float; precision highp sampler2D;
    varying vec2 vUv; uniform sampler2D uTarget; uniform float aspectRatio;
    uniform vec3 color; uniform vec2 point; uniform float radius;
    void main () {
      vec2 p = vUv - point.xy; p.x *= aspectRatio;
      vec3 splat = exp(-dot(p,p)/radius)*color;
      gl_FragColor = vec4(texture2D(uTarget,vUv).xyz + splat, 1.0);
    }
  `;
  const advectionShaderSource = `
    precision highp float; precision highp sampler2D;
    varying vec2 vUv; uniform sampler2D uVelocity, uSource;
    uniform vec2 texelSize; uniform float dt, dissipation;
    void main () {
      vec2 coord = vUv - dt * texture2D(uVelocity,vUv).xy * texelSize;
      gl_FragColor = texture2D(uSource,coord) / (1.0 + dissipation*dt);
    }
  `;
  const divergenceShaderSource = `
    precision mediump float; precision mediump sampler2D;
    varying highp vec2 vUv,vL,vR,vT,vB; uniform sampler2D uVelocity;
    void main () {
      float L=texture2D(uVelocity,vL).x, R=texture2D(uVelocity,vR).x,
            T=texture2D(uVelocity,vT).y, B=texture2D(uVelocity,vB).y;
      vec2 C=texture2D(uVelocity,vUv).xy;
      if(vL.x<0.0)L=-C.x; if(vR.x>1.0)R=-C.x;
      if(vT.y>1.0)T=-C.y; if(vB.y<0.0)B=-C.y;
      gl_FragColor=vec4(0.5*(R-L+T-B),0,0,1);
    }
  `;
  const curlShaderSource = `
    precision mediump float; precision mediump sampler2D;
    varying highp vec2 vUv,vL,vR,vT,vB; uniform sampler2D uVelocity;
    void main () {
      float L=texture2D(uVelocity,vL).y, R=texture2D(uVelocity,vR).y,
            T=texture2D(uVelocity,vT).x, B=texture2D(uVelocity,vB).x;
      gl_FragColor=vec4(0.5*(R-L-T+B),0,0,1);
    }
  `;
  const vorticityShaderSource = `
    precision highp float; precision highp sampler2D;
    varying vec2 vUv,vL,vR,vT,vB; uniform sampler2D uVelocity,uCurl;
    uniform float curl,dt;
    void main () {
      float L=texture2D(uCurl,vL).x, R=texture2D(uCurl,vR).x,
            T=texture2D(uCurl,vT).x, B=texture2D(uCurl,vB).x,
            C=texture2D(uCurl,vUv).x;
      vec2 force=0.5*vec2(abs(T)-abs(B),abs(R)-abs(L));
      force/=length(force)+0.0001; force*=curl*C; force.y*=-1.0;
      gl_FragColor=vec4(texture2D(uVelocity,vUv).xy+force*dt,0,1);
    }
  `;
  const pressureShaderSource = `
    precision mediump float; precision mediump sampler2D;
    varying highp vec2 vUv,vL,vR,vT,vB;
    uniform sampler2D uPressure,uDivergence;
    void main () {
      float L=texture2D(uPressure,vL).x, R=texture2D(uPressure,vR).x,
            T=texture2D(uPressure,vT).x, B=texture2D(uPressure,vB).x,
            div=texture2D(uDivergence,vUv).x;
      gl_FragColor=vec4((L+R+B+T-div)*0.25,0,0,1);
    }
  `;
  const gradientSubtractShaderSource = `
    precision mediump float; precision mediump sampler2D;
    varying highp vec2 vUv,vL,vR,vT,vB;
    uniform sampler2D uPressure,uVelocity;
    void main () {
      float L=texture2D(uPressure,vL).x, R=texture2D(uPressure,vR).x,
            T=texture2D(uPressure,vT).x, B=texture2D(uPressure,vB).x;
      vec2 vel=texture2D(uVelocity,vUv).xy-vec2(R-L,T-B);
      gl_FragColor=vec4(vel,0,1);
    }
  `;
  const displayShaderSource = `
    precision highp float; precision highp sampler2D;
    varying vec2 vUv,vL,vR,vT,vB; uniform sampler2D uTexture;
    uniform vec2 texelSize; uniform float opacity;
    void main () {
      vec3 c=texture2D(uTexture,vUv).rgb;
      float m=max(c.r,max(c.g,c.b)); if(m>1.0)c/=m;
      vec3 lc=texture2D(uTexture,vL).rgb, rc=texture2D(uTexture,vR).rgb,
           tc=texture2D(uTexture,vT).rgb, bc=texture2D(uTexture,vB).rgb;
      float dx=length(rc)-length(lc), dy=length(tc)-length(bc);
      vec3 n=normalize(vec3(dx,dy,length(texelSize)));
      c*=clamp(dot(n,vec3(0,0,1))+0.7,0.7,1.0);
      gl_FragColor=vec4(c, max(c.r,max(c.g,c.b))*opacity);
    }
  `;

  function supportedFormat(gl, internalFormat, format, type) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    gl.deleteFramebuffer(fbo); gl.deleteTexture(tex);
    return ok;
  }

  function init() {
    const canvas = document.createElement("canvas");
    canvas.id = "fluid-trail";
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:999997;";
    canvas.style.opacity = String(DEFAULTS.canvasOpacity);
    document.body.insertBefore(canvas, document.body.firstChild);

    const params = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };
    let gl = canvas.getContext("webgl2", params);
    const isWebGL2 = !!gl;
    if (!gl) gl = canvas.getContext("webgl", params) || canvas.getContext("experimental-webgl", params);
    if (!gl) return;

    let texType, ext;
    if (isWebGL2) {
      gl.getExtension("EXT_color_buffer_float");
      const linFilt = gl.getExtension("OES_texture_float_linear");
      texType = gl.HALF_FLOAT;
      ext = {
        texType,
        supportLinearFiltering: !!linFilt,
        formatRGBA: supportedFormat(gl, gl.RGBA16F, gl.RGBA, texType) ? { internalFormat: gl.RGBA16F, format: gl.RGBA } : { internalFormat: gl.RGBA, format: gl.RGBA },
        formatRG:   supportedFormat(gl, gl.RG16F,   gl.RG,   texType) ? { internalFormat: gl.RG16F,   format: gl.RG   } : { internalFormat: gl.RGBA, format: gl.RGBA },
        formatR:    supportedFormat(gl, gl.R16F,    gl.RED,  texType) ? { internalFormat: gl.R16F,    format: gl.RED  } : { internalFormat: gl.RGBA, format: gl.RGBA },
      };
    } else {
      const hf = gl.getExtension("OES_texture_half_float");
      const linFilt = gl.getExtension("OES_texture_half_float_linear");
      texType = hf ? hf.HALF_FLOAT_OES : gl.UNSIGNED_BYTE;
      ext = { texType, supportLinearFiltering: !!linFilt, formatRGBA: { internalFormat: gl.RGBA, format: gl.RGBA }, formatRG: { internalFormat: gl.RGBA, format: gl.RGBA }, formatR: { internalFormat: gl.RGBA, format: gl.RGBA } };
    }

    gl.clearColor(0, 0, 0, 0);
    run(canvas, gl, ext);
  }

  function run(canvas, gl, ext) {
    const cfg = DEFAULTS;
    let dye, velocity, divergenceFBO, curlFBO, pressureFBO;
    const progs = {};
    let displayProg;
    let blit;
    let ptr = { x: 0, y: 0, dx: 0, dy: 0, moved: false, set: false };
    let animId = null;
    let lastT = Date.now();
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const aspect = () => canvas.width / canvas.height;
    const corrX = (d) => aspect() < 1 ? d * aspect() : d;
    const corrY = (d) => aspect() > 1 ? d / aspect() : d;
    const corrR = (r) => aspect() > 1 ? r * aspect() : r;

    function compile(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s); return s;
    }
    function mkProg(vs, fs) {
      const p = gl.createProgram();
      gl.attachShader(p, compile(gl.VERTEX_SHADER, vs));
      gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(p);
      const uniforms = {};
      const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < n; i++) { const name = gl.getActiveUniform(p, i).name; uniforms[name] = gl.getUniformLocation(p, name); }
      return { program: p, uniforms };
    }
    function use(p) { gl.useProgram(p.program); }

    function mkFBO(w, h, iFmt, fmt, type, filter) {
      gl.activeTexture(gl.TEXTURE0);
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, iFmt, w, h, 0, fmt, type, null);
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.viewport(0, 0, w, h); gl.clear(gl.COLOR_BUFFER_BIT);
      return { tex, fbo, width: w, height: h, texelSizeX: 1/w, texelSizeY: 1/h,
        attach(id) { gl.activeTexture(gl.TEXTURE0+id); gl.bindTexture(gl.TEXTURE_2D, tex); return id; } };
    }
    function mkDouble(w, h, iFmt, fmt, type, filter) {
      let a = mkFBO(w,h,iFmt,fmt,type,filter), b = mkFBO(w,h,iFmt,fmt,type,filter);
      return { width:w, height:h, texelSizeX:a.texelSizeX, texelSizeY:a.texelSizeY,
        get read(){return a;}, get write(){return b;}, swap(){const t=a;a=b;b=t;} };
    }

    function initBlit() {
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,-1,1,1,1,1,-1]), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0,1,2,0,2,3]), gl.STATIC_DRAW);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(0);
      blit = (t) => {
        if (!t) { gl.viewport(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight); gl.bindFramebuffer(gl.FRAMEBUFFER, null); }
        else { gl.viewport(0,0,t.width,t.height); gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo); }
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      };
    }

    function getRes(r) {
      let asp = gl.drawingBufferWidth / gl.drawingBufferHeight;
      if (asp < 1) asp = 1/asp;
      const mn = Math.round(r), mx = Math.round(r*asp);
      return gl.drawingBufferWidth > gl.drawingBufferHeight ? { width:mx, height:mn } : { width:mn, height:mx };
    }

    function initFBOs() {
      const sR = getRes(cfg.simResolution), dR = getRes(cfg.dyeResolution);
      const tt = ext.texType, filt = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
      dye      = mkDouble(dR.width, dR.height, ext.formatRGBA.internalFormat, ext.formatRGBA.format, tt, filt);
      velocity = mkDouble(sR.width, sR.height, ext.formatRG.internalFormat,   ext.formatRG.format,   tt, filt);
      divergenceFBO = mkFBO(sR.width, sR.height, ext.formatR.internalFormat, ext.formatR.format, tt, gl.NEAREST);
      curlFBO       = mkFBO(sR.width, sR.height, ext.formatR.internalFormat, ext.formatR.format, tt, gl.NEAREST);
      pressureFBO   = mkDouble(sR.width, sR.height, ext.formatR.internalFormat, ext.formatR.format, tt, gl.NEAREST);
    }

    function splat(x, y, dx, dy, color) {
      use(progs.splat);
      gl.uniform1i(progs.splat.uniforms.uTarget, velocity.read.attach(0));
      gl.uniform1f(progs.splat.uniforms.aspectRatio, canvas.width/canvas.height);
      gl.uniform2f(progs.splat.uniforms.point, x, y);
      gl.uniform3f(progs.splat.uniforms.color, dx, dy, 0);
      gl.uniform1f(progs.splat.uniforms.radius, corrR(cfg.splatRadius/100));
      blit(velocity.write); velocity.swap();
      gl.uniform1i(progs.splat.uniforms.uTarget, dye.read.attach(0));
      gl.uniform3f(progs.splat.uniforms.color, color.r, color.g, color.b);
      blit(dye.write); dye.swap();
    }

    function step(dt) {
      gl.disable(gl.BLEND);
      use(progs.curl);
      gl.uniform2f(progs.curl.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(progs.curl.uniforms.uVelocity, velocity.read.attach(0));
      blit(curlFBO);

      use(progs.vorticity);
      gl.uniform2f(progs.vorticity.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(progs.vorticity.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(progs.vorticity.uniforms.uCurl, curlFBO.attach(1));
      gl.uniform1f(progs.vorticity.uniforms.curl, cfg.curl);
      gl.uniform1f(progs.vorticity.uniforms.dt, dt);
      blit(velocity.write); velocity.swap();

      use(progs.divergence);
      gl.uniform2f(progs.divergence.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(progs.divergence.uniforms.uVelocity, velocity.read.attach(0));
      blit(divergenceFBO);

      use(progs.clear);
      gl.uniform1i(progs.clear.uniforms.uTexture, pressureFBO.read.attach(0));
      gl.uniform1f(progs.clear.uniforms.value, cfg.pressure);
      blit(pressureFBO.write); pressureFBO.swap();

      use(progs.pressure);
      gl.uniform2f(progs.pressure.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(progs.pressure.uniforms.uDivergence, divergenceFBO.attach(0));
      for (let i = 0; i < cfg.pressureIterations; i++) {
        gl.uniform1i(progs.pressure.uniforms.uPressure, pressureFBO.read.attach(1));
        blit(pressureFBO.write); pressureFBO.swap();
      }

      use(progs.gradientSubtract);
      gl.uniform2f(progs.gradientSubtract.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      gl.uniform1i(progs.gradientSubtract.uniforms.uPressure, pressureFBO.read.attach(0));
      gl.uniform1i(progs.gradientSubtract.uniforms.uVelocity, velocity.read.attach(1));
      blit(velocity.write); velocity.swap();

      use(progs.advection);
      gl.uniform2f(progs.advection.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
      const vId = velocity.read.attach(0);
      gl.uniform1i(progs.advection.uniforms.uVelocity, vId);
      gl.uniform1i(progs.advection.uniforms.uSource, vId);
      gl.uniform1f(progs.advection.uniforms.dt, dt);
      gl.uniform1f(progs.advection.uniforms.dissipation, cfg.velocityDissipation);
      blit(velocity.write); velocity.swap();

      gl.uniform1i(progs.advection.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(progs.advection.uniforms.uSource, dye.read.attach(1));
      gl.uniform1f(progs.advection.uniforms.dissipation, cfg.densityDissipation);
      blit(dye.write); dye.swap();
    }

    function render() {
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
      use(displayProg);
      gl.uniform2f(displayProg.uniforms.texelSize, 1/canvas.width, 1/canvas.height);
      gl.uniform1i(displayProg.uniforms.uTexture, dye.read.attach(0));
      gl.uniform1f(displayProg.uniforms.opacity, cfg.opacity);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
      blit(null);
    }

    function pickColor() {
      const base = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      const b = 0.8 + Math.random() * 0.45;
      return { r: base.r*b, g: base.g*b, b: base.b*b };
    }

    function onMove(e) {
      const x = e.clientX * dpr, y = e.clientY * dpr;
      const tx = x/canvas.width, ty = 1 - y/canvas.height;
      if (!ptr.set) { ptr.set = true; ptr.x = tx; ptr.y = ty; }
      ptr.dx = corrX(tx - ptr.x) * cfg.splatForce;
      ptr.dy = corrY(ty - ptr.y) * cfg.splatForce;
      ptr.x = tx; ptr.y = ty;
      ptr.moved = Math.abs(ptr.dx) > 0.5 || Math.abs(ptr.dy) > 0.5;
    }

    function loop() {
      animId = requestAnimationFrame(loop);
      const now = Date.now();
      const dt = Math.min((now - lastT) / 1000, 0.0167);
      lastT = now;
      if (ptr.moved) { ptr.moved = false; splat(ptr.x, ptr.y, ptr.dx, ptr.dy, pickColor()); }
      step(dt);
      render();
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(window.innerWidth * dpr), h = Math.floor(window.innerHeight * dpr);
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w; canvas.height = h;
      initFBOs();
    }

    initBlit();
    progs.clear           = mkProg(baseVertexShaderSource, clearShaderSource);
    progs.splat           = mkProg(baseVertexShaderSource, splatShaderSource);
    progs.advection       = mkProg(baseVertexShaderSource, advectionShaderSource);
    progs.divergence      = mkProg(baseVertexShaderSource, divergenceShaderSource);
    progs.curl            = mkProg(baseVertexShaderSource, curlShaderSource);
    progs.vorticity       = mkProg(baseVertexShaderSource, vorticityShaderSource);
    progs.pressure        = mkProg(baseVertexShaderSource, pressureShaderSource);
    progs.gradientSubtract = mkProg(baseVertexShaderSource, gradientSubtractShaderSource);
    displayProg           = mkProg(baseVertexShaderSource, displayShaderSource);
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    lastT = Date.now();
    animId = requestAnimationFrame(loop);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) { if (animId) { cancelAnimationFrame(animId); animId = null; } }
      else if (!animId) { lastT = Date.now(); animId = requestAnimationFrame(loop); }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
