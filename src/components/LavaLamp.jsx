import { useEffect, useRef } from 'react';

function hsla(h, s, l, a = 1) {
  return `hsla(${h} ${s}% ${l}% / ${a})`;
}

export default function LavaLamp({ count = 8, speed = 1, hue = 285, saturation = 85, lightness = 60, glow = 22 }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const blobsRef = useRef([]);
  const dprRef = useRef(1);
  const mouseRef = useRef({ x: 0, y: 0, down: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const state = { w: 0, h: 0 };

    const makeBlob = () => {
      const r = rand(30, 80);
      return {
        x: rand(r, state.w - r),
        y: rand(r, state.h - r),
        vx: rand(-1, 1) * speed * 0.6,
        vy: rand(-1, 1) * speed * 0.6,
        r,
        m: r * r * Math.PI,
      };
    };

    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dprRef.current = dpr;
      const rect = canvas.getBoundingClientRect();
      state.w = Math.max(320, Math.floor(rect.width));
      state.h = Math.max(240, Math.floor(rect.height));
      canvas.width = Math.floor(state.w * dpr);
      canvas.height = Math.floor(state.h * dpr);
      canvas.style.width = state.w + 'px';
      canvas.style.height = state.h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function ensureBlobs() {
      const target = Math.max(1, Math.min(64, Math.floor(count)));
      const arr = blobsRef.current;
      while (arr.length < target) arr.push(makeBlob());
      while (arr.length > target) arr.pop();
      // Adjust speed smoothly by scaling velocity
      const speedScale = Math.max(0.15, speed);
      for (const b of arr) {
        const len = Math.hypot(b.vx, b.vy) || 1;
        const desired = 0.6 * speedScale;
        b.vx = (b.vx / len) * desired;
        b.vy = (b.vy / len) * desired;
      }
    }

    function step(dt) {
      const blobs = blobsRef.current;
      const { w, h } = state;
      const mouse = mouseRef.current;

      for (let i = 0; i < blobs.length; i++) {
        const b = blobs[i];
        // gentle gravity-like vertical drift
        b.vy += 0.0008 * dt * (Math.sin(i + performance.now() * 0.0002) * 0.5);

        // mouse attraction when held
        if (mouse.down) {
          const dx = mouse.x - b.x;
          const dy = mouse.y - b.y;
          const dist = Math.hypot(dx, dy) + 0.0001;
          const force = Math.min(1200 / (dist * dist), 0.08) * dt;
          b.vx += (dx / dist) * force;
          b.vy += (dy / dist) * force;
        }

        // integrate
        b.x += b.vx * dt;
        b.y += b.vy * dt;

        // boundary collisions
        if (b.x < b.r) { b.x = b.r; b.vx *= -0.95; }
        if (b.x > w - b.r) { b.x = w - b.r; b.vx *= -0.95; }
        if (b.y < b.r) { b.y = b.r; b.vy *= -0.95; }
        if (b.y > h - b.r) { b.y = h - b.r; b.vy *= -0.95; }
      }

      // simple inelastic collisions (pairwise)
      for (let i = 0; i < blobs.length; i++) {
        for (let j = i + 1; j < blobs.length; j++) {
          const a = blobs[i];
          const b = blobs[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy);
          const minDist = a.r * 0.85 + b.r * 0.85; // allow overlaps to enhance goo
          if (dist > 0 && dist < minDist) {
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = minDist - dist;
            const totalMass = a.m + b.m;
            // separate proportionally to mass
            a.x -= nx * (overlap * (b.m / totalMass));
            a.y -= ny * (overlap * (b.m / totalMass));
            b.x += nx * (overlap * (a.m / totalMass));
            b.y += ny * (overlap * (a.m / totalMass));
            // exchange velocities along normal (inelastic)
            const rvx = b.vx - a.vx;
            const rvy = b.vy - a.vy;
            const velAlongNormal = rvx * nx + rvy * ny;
            if (velAlongNormal < 0) {
              const restitution = 0.2;
              const jImpulse = -(1 + restitution) * velAlongNormal;
              const jn = jImpulse / (1 / a.m + 1 / b.m);
              const ix = nx * jn;
              const iy = ny * jn;
              a.vx -= ix / a.m;
              a.vy -= iy / a.m;
              b.vx += ix / b.m;
              b.vy += iy / b.m;
            }
          }
        }
      }
    }

    function draw() {
      const { w, h } = state;
      ctx.clearRect(0, 0, w, h);

      // background
      ctx.fillStyle = '#050509';
      ctx.fillRect(0, 0, w, h);

      // Goo pass: blurred colored circles with additive blending
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.filter = `blur(${Math.max(6, glow)}px)`;
      for (const b of blobsRef.current) {
        const grad = ctx.createRadialGradient(b.x, b.y, b.r * 0.1, b.x, b.y, b.r);
        const base = hsla(hue, saturation, lightness, 1);
        const edge = hsla(hue, saturation, Math.max(10, lightness - 20), 0);
        grad.addColorStop(0, base);
        grad.addColorStop(1, edge);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Highlight/specular pass for a metallic sheen
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.filter = 'blur(6px)';
      for (const b of blobsRef.current) {
        const grad2 = ctx.createRadialGradient(b.x - b.r * 0.3, b.y - b.r * 0.3, 0, b.x - b.r * 0.3, b.y - b.r * 0.3, b.r);
        grad2.addColorStop(0, 'hsla(0 0% 100% / 0.35)');
        grad2.addColorStop(1, 'hsla(0 0% 100% / 0)');
        ctx.fillStyle = grad2;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Soft vignette for depth
      const vg = ctx.createRadialGradient(w * 0.5, h * 0.55, Math.min(w, h) * 0.3, w * 0.5, h * 0.55, Math.max(w, h) * 0.75);
      vg.addColorStop(0, 'hsla(0 0% 0% / 0)');
      vg.addColorStop(1, 'hsla(0 0% 0% / 0.55)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);
    }

    let prev = performance.now();
    function loop(now) {
      const dt = Math.min(33, now - prev);
      prev = now;
      ensureBlobs();
      step(dt);
      draw();
      rafRef.current = requestAnimationFrame(loop);
    }

    function init() {
      resize();
      blobsRef.current = [];
      ensureBlobs();
      prev = performance.now();
      rafRef.current = requestAnimationFrame(loop);
    }

    const onResize = () => resize();
    window.addEventListener('resize', onResize);

    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left);
      mouseRef.current.y = (e.clientY - rect.top);
    };
    const onPointerDown = (e) => {
      mouseRef.current.down = true;
      onPointerMove(e);
    };
    const onPointerUp = () => { mouseRef.current.down = false; };
    const onClick = (e) => {
      // Add a new blob where clicked
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const r = Math.random() * 40 + 28;
      const b = { x, y, r, vx: (Math.random() - 0.5) * 1.2 * speed, vy: (Math.random() - 0.5) * 1.2 * speed, m: r * r * Math.PI };
      blobsRef.current.push(b);
    };

    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('click', onClick);

    init();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('click', onClick);
    };
  }, [count, speed, hue, saturation, lightness, glow]);

  return (
    <div className="relative w-full aspect-[16/10] md:aspect-[16/8] bg-black">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5 rounded-xl" />
    </div>
  );
}
