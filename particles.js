// Live particle-network background (purple + blue glowing dots)
(function () {
    const canvas = document.getElementById("bgCanvas");
    const ctx = canvas.getContext("2d");

    let width, height, particles;
    const mouse = { x: null, y: null, radius: 150 };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // dot colours (R, G, B)
    const COLORS = ["167, 105, 250", "70, 130, 250"]; // purple, blue
    const LINE_COLOR = "120, 100, 250";

    function resize() {
        const dpr = window.devicePixelRatio || 1;
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        createParticles();
    }

    function createParticles() {
        // fewer particles on small screens for performance
        const count = Math.min(90, Math.floor((width * height) / 18000));
        particles = [];
        for (let i = 0; i < count; i++) {
            const big = Math.random() < 0.12; // a few larger glowing dots
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                r: big ? Math.random() * 1.5 + 2.5 : Math.random() * 1.3 + 0.8,
                glow: big,
                color: COLORS[Math.random() < 0.5 ? 0 : 1],
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            // push away from mouse
            if (mouse.x !== null) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.hypot(dx, dy);
                if (dist < mouse.radius && dist > 0) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    p.x += (dx / dist) * force * 2;
                    p.y += (dy / dist) * force * 2;
                }
            }

            // dot (big ones get a soft glow)
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color}, ${p.glow ? 0.95 : 0.75})`;
            if (p.glow) {
                ctx.shadowColor = `rgba(${p.color}, 0.9)`;
                ctx.shadowBlur = 14;
            }
            ctx.fill();
            ctx.shadowBlur = 0;

            // faint lines to nearby dots
            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const d = Math.hypot(p.x - q.x, p.y - q.y);
                if (d < 150) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = `rgba(${LINE_COLOR}, ${0.16 * (1 - d / 150)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        if (!reduceMotion) requestAnimationFrame(animate);
    }

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener("mouseout", () => {
        mouse.x = null;
        mouse.y = null;
    });

    resize();
    animate();
})();