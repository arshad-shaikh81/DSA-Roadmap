// Real "Regular Glass" lens refraction for buttons.
// Builds a displacement map per element (matching its size + corner radius)
// and feeds it to an SVG filter used through backdrop-filter.
// Works in Chrome / Edge. Safari & Firefox get the clear-glass fallback.
(function () {
    const isChromium =
        !!window.chrome ||
        (navigator.userAgentData &&
            navigator.userAgentData.brands.some((b) => /Chromium/i.test(b.brand)));

    if (!isChromium) return;

    document.documentElement.classList.add("has-liquid");

    // ---- TUNE THE LOOK HERE ----
    const BEZEL_MAX = 20;   // px: how wide the bending edge zone is
    const STRENGTH = 2.6;   // how strongly the edge bends (try 1.5 – 4)
    // ----------------------------

    const NS = "http://www.w3.org/2000/svg";
    const svg = document.getElementById("glassDefs");
    const records = new Map();
    let counter = 0;

    function buildMap(w, h, r, bezel) {
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        const img = ctx.createImageData(w, h);
        const px = img.data;

        const hw = w / 2;
        const hh = h / 2;
        const ix = hw - r;
        const iy = hh - r;

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const cx = x + 0.5 - hw;
                const cy = y + 0.5 - hh;

                // signed distance to the rounded rectangle (negative = inside)
                const qx = Math.abs(cx) - ix;
                const qy = Math.abs(cy) - iy;
                const ox = Math.max(qx, 0);
                const oy = Math.max(qy, 0);
                const outer = Math.hypot(ox, oy);
                const sd = outer + Math.min(Math.max(qx, qy), 0) - r;
                const depth = -sd; // distance in from the edge

                let dx = 0;
                let dy = 0;

                if (depth >= 0 && depth < bezel) {
                    // outward normal
                    let nx, ny;
                    if (qx > 0 && qy > 0) {
                        nx = ox / outer;
                        ny = oy / outer;
                    } else if (qx > qy) {
                        nx = 1;
                        ny = 0;
                    } else {
                        nx = 0;
                        ny = 1;
                    }
                    nx *= Math.sign(cx) || 1;
                    ny *= Math.sign(cy) || 1;

                    // lens profile: strongest at the very edge, fades to nothing inside
                    const t = 1 - depth / bezel;
                    const amount = t * t * (3 - 2 * t) * t; // smooth, edge-heavy

                    // sample from further inside the button
                    dx = -nx * amount;
                    dy = -ny * amount;
                }

                const i = (y * w + x) * 4;
                px[i] = 128 + dx * 127;     // R = x shift
                px[i + 1] = 128 + dy * 127; // G = y shift
                px[i + 2] = 128;
                px[i + 3] = 255;
            }
        }

        ctx.putImageData(img, 0, 0);
        return canvas.toDataURL();
    }

    function create(el) {
        const rec = { id: "glass-" + counter++, w: 0, h: 0 };

        const filter = document.createElementNS(NS, "filter");
        filter.setAttribute("id", rec.id);
        filter.setAttribute("filterUnits", "userSpaceOnUse");
        filter.setAttribute("color-interpolation-filters", "sRGB");

        const feImage = document.createElementNS(NS, "feImage");
        feImage.setAttribute("result", "map");
        feImage.setAttribute("preserveAspectRatio", "none");

        const disp = document.createElementNS(NS, "feDisplacementMap");
        disp.setAttribute("in", "SourceGraphic");
        disp.setAttribute("in2", "map");
        disp.setAttribute("xChannelSelector", "R");
        disp.setAttribute("yChannelSelector", "G");

        filter.appendChild(feImage);
        filter.appendChild(disp);
        svg.appendChild(filter);

        rec.filter = filter;
        rec.feImage = feImage;
        rec.disp = disp;

        el.style.setProperty("--bf", "url(#" + rec.id + ")");
        records.set(el, rec);
        return rec;
    }

    function update(el) {
        const rect = el.getBoundingClientRect();
        const w = Math.round(rect.width);
        const h = Math.round(rect.height);
        if (!w || !h) return; // hidden element

        const rec = records.get(el) || create(el);
        if (rec.w === w && rec.h === h) return;
        rec.w = w;
        rec.h = h;

        // corner radius
        const br = getComputedStyle(el).borderTopLeftRadius;
        let r = br.endsWith("%")
            ? (parseFloat(br) / 100) * Math.min(w, h)
            : parseFloat(br) || 0;
        r = Math.min(r, w / 2, h / 2);

        const bezel = Math.max(4, Math.min(BEZEL_MAX, w / 2, h / 2));

        rec.filter.setAttribute("x", 0);
        rec.filter.setAttribute("y", 0);
        rec.filter.setAttribute("width", w);
        rec.filter.setAttribute("height", h);

        rec.feImage.setAttribute("x", 0);
        rec.feImage.setAttribute("y", 0);
        rec.feImage.setAttribute("width", w);
        rec.feImage.setAttribute("height", h);
        rec.feImage.setAttribute("href", buildMap(w, h, r, bezel));

        // displacement = scale * 0.5 px at full strength
        rec.disp.setAttribute("scale", (bezel * STRENGTH).toFixed(1));
    }

    const ro = new ResizeObserver((entries) => {
        entries.forEach((e) => update(e.target));
    });

    document.querySelectorAll(".glass, .nav-link").forEach((el) => {
        ro.observe(el);
        update(el);
    });
})();