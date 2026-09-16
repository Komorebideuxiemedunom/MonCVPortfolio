/**
 * neo-effects.js
 * Custom neon cursor + WebGL fluid trail + gooey scroll reveal
 * Visual DA: neonikala.com — neon blue/pink/cyan
 */
(function () {
  'use strict';

  var isTouchDevice = function () { return window.matchMedia('(hover: none)').matches; };
  var prefersReduced = function () { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; };

  /* ====================================================
     1. CUSTOM NEON CURSOR
  ==================================================== */
  function initCursor() {
    if (isTouchDevice()) return;

    var dot  = document.getElementById('neo-cursor');
    var ring = document.getElementById('neo-cursor-ring');
    if (!dot || !ring) return;

    var mx = -300, my = -300;
    var rx = -300, ry = -300;
    var isHovering = false;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    document.addEventListener('mouseleave', function () {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function () {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    });

    /* Ring follows with lerp for soft lag */
    (function animateRing() {
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animateRing);
    })();

    /* Hover expansion on interactive elements */
    function onEnter() {
      dot.classList.add('cursor-hover');
      ring.classList.add('cursor-hover');
    }
    function onLeave() {
      dot.classList.remove('cursor-hover');
      ring.classList.remove('cursor-hover');
    }

    function bindHoverTargets() {
      var sel = 'a, button, .portfolio-filters li, .service-item, .portfolio-content, .lang-opt, .toggle-switch, .scroll-top, .btn-cv, .btn-project-link, .back-to-portfolio';
      document.querySelectorAll(sel).forEach(function (el) {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    }
    bindHoverTargets();
  }

  /* ====================================================
     2. WEBGL FLUID CURSOR TRAIL
     Additive-blended neon blobs cycling blue→pink→cyan
  ==================================================== */
  function initFluidTrail() {
    if (isTouchDevice() || prefersReduced()) return;

    var canvas = document.getElementById('fluid-canvas');
    if (!canvas) return;

    var gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
    if (!gl) return;

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener('resize', resize);

    /* --- shaders --- */
    var VS = [
      'attribute vec2 a_pos;',
      'void main(){gl_Position=vec4(a_pos,0.0,1.0);}'
    ].join('');

    var FS = [
      'precision mediump float;',
      'uniform vec2  u_res;',
      'uniform vec2  u_trail[40];',
      'uniform float u_ages[40];',
      'uniform int   u_count;',

      /* Cycle: neon-blue → neon-pink → neon-cyan */
      'vec3 neon(float t){',
      '  vec3 b=vec3(.47,.67,1.);',   /* #78AAFF */
      '  vec3 p=vec3(1.,.55,.78);',   /* #FF8CC8 */
      '  vec3 c=vec3(.47,1.,.82);',   /* #78FFD2 */
      '  t=mod(t*3.,3.);',
      '  if(t<1.)return mix(b,p,t);',
      '  if(t<2.)return mix(p,c,t-1.);',
      '  return mix(c,b,t-2.);',
      '}',

      'void main(){',
      '  vec2 uv=gl_FragCoord.xy/u_res;',
      '  vec3 col=vec3(0.);',
      '  float a=0.;',
      '  for(int i=0;i<40;i++){',
      '    if(i>=u_count)break;',
      '    vec2 p=vec2(u_trail[i].x/u_res.x, 1.-u_trail[i].y/u_res.y);',
      '    float d=length(uv-p);',
      '    float age=u_ages[i];',
      '    float s=exp(-d*d*1800.)*pow(1.-age,2.2);',
      '    col+=neon(float(i)/40.)*s;',
      '    a+=s;',
      '  }',
      '  gl_FragColor=vec4(col,min(a*.5,.8));',
      '}'
    ].join('');

    function mkShader(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    var prog = gl.createProgram();
    gl.attachShader(prog, mkShader(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, mkShader(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    var aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    var uRes   = gl.getUniformLocation(prog, 'u_res');
    var uTrail = gl.getUniformLocation(prog, 'u_trail');
    var uAges  = gl.getUniformLocation(prog, 'u_ages');
    var uCount = gl.getUniformLocation(prog, 'u_count');

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);  /* additive → neon glow */

    var TRAIL_MAX = 40;
    var LIFETIME  = 850;  /* ms */
    var trail = [];
    var mouseX = -9999, mouseY = -9999;
    var lastPush = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function frame() {
      var now = performance.now();

      /* Push new point every ~16ms if cursor moved */
      if (now - lastPush > 16 && mouseX > -100) {
        var last = trail[trail.length - 1];
        if (!last || Math.abs(last.x - mouseX) > 1 || Math.abs(last.y - mouseY) > 1) {
          trail.push({ x: mouseX, y: mouseY, t: now });
          if (trail.length > TRAIL_MAX) trail.shift();
          lastPush = now;
        }
      }

      /* Expire old points */
      trail = trail.filter(function (p) { return now - p.t < LIFETIME; });

      gl.clear(gl.COLOR_BUFFER_BIT);

      if (trail.length > 0) {
        var pos  = new Float32Array(TRAIL_MAX * 2);
        var ages = new Float32Array(TRAIL_MAX);

        /* Newest point → index 0 (freshest color = blue) */
        for (var i = 0; i < trail.length; i++) {
          var ri = trail.length - 1 - i;
          pos[ri * 2]     = trail[i].x;
          pos[ri * 2 + 1] = trail[i].y;
          ages[ri] = (now - trail[i].t) / LIFETIME;
        }

        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform2fv(uTrail, pos);
        gl.uniform1fv(uAges, ages);
        gl.uniform1i(uCount, trail.length);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ====================================================
     3. GOOEY SCROLL REVEAL (blur → sharp, à la neonikala)
  ==================================================== */
  function initGooeyReveal() {
    if (prefersReduced()) {
      /* Just show everything immediately */
      document.querySelectorAll('.gooey-reveal').forEach(function (el) {
        el.classList.add('is-revealed');
      });
      return;
    }

    var elements = document.querySelectorAll('.gooey-reveal');
    if (!elements.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        /* Small stagger based on position within parent */
        var siblings = el.parentElement ? el.parentElement.querySelectorAll('.gooey-reveal') : [];
        var idx = Array.prototype.indexOf.call(siblings, el);
        var delay = Math.min(idx * 80, 300);
        setTimeout(function () {
          el.classList.add('is-revealed');
        }, delay);
        observer.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

    elements.forEach(function (el) { observer.observe(el); });
  }

  /* ====================================================
     INIT
  ==================================================== */
  function init() {
    initCursor();
    initFluidTrail();
    initGooeyReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
