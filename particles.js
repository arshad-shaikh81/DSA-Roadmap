// Live particle-network background
(function () {
    const canvas = document.getElementById("bgCanvas");
    const ctx = canvas.getContext("2d");

    let width, height, particles;
    const mouse = { x: null, y: null, radius: 150 };

    // Respect users who prefer reduced motion
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function getColor() {
        // reads --particle from CSS so it changes with the theme
        return getComputedStyle(document.body).getPropertyValue("--particle").trim() || "167, 139, 250";
    }

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
        const count = Math.min(110, Math.floor((width * height) / 14000));
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                r: Math.random() * 1.8 + 0.6,
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        const color = getColor();

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            // move
            p.x += p.vx;
            p.y += p.vy;

            // bounce on edges
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

            // draw dot
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${color}, 0.8)`;
            ctx.fill();

            // draw lines to nearby dots
            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const d = Math.hypot(p.x - q.x, p.y - q.y);
                if (d < 130) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = `rgba(${color}, ${0.25 * (1 - d / 130)})`;
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