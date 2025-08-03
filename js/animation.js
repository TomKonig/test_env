const ICONS = Array.from({ length: 19 }, (_, i) => i + 1);
const COLORS = ["#FFD86B", "#FF5DB1", "#8A5CFF", "#5BE2FF"];
const layer = document.getElementById('icon-layer');
const svgNS = "http://www.w3.org/2000/svg";
const CFG = { count: 7, minSize: 42, maxSize: 60, speed: 10, turnMax: 0.35, noise: 0.18, sepPad: 6, off: 80, fadeMs: 700 };
const icons = [];
let VW = window.innerWidth;
let VH = window.innerHeight;

function resize() {
    VW = window.innerWidth;
    VH = window.innerHeight;
}
window.addEventListener('resize', resize);
window.addEventListener('orientationchange', resize);

const rand = (a, b) => a + Math.random() * (b - a);
const pick = a => a[Math.floor(Math.random() * a.length)];

async function spawn(mode = "edge") {
    try {
        const name = pick(ICONS);
        const color = pick(COLORS);
        const res = await fetch(`icons/${name}.svg`);
        if (!res.ok) throw new Error(`SVG fetch failed: ${res.status}`);
        const svgText = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, "image/svg+xml");
        const fetchedSvg = doc.documentElement;
        const viewBox = fetchedSvg.getAttribute('viewBox');

        const el = document.createElementNS(svgNS, 'svg');
        if (viewBox) el.setAttribute('viewBox', viewBox);
        el.setAttribute('fill', color);
        
        while (fetchedSvg.firstChild) {
            el.appendChild(fetchedSvg.firstChild.cloneNode(true));
        }

        const size = Math.round(rand(CFG.minSize, CFG.maxSize));
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;

        let x, y, theta;
        if (mode === "initial") {
            x = rand(0, VW - size);
            y = rand(0, VH - size);
            theta = rand(0, 2 * Math.PI);
        } else { // edge
            const side = pick(['top', 'bottom', 'left', 'right']);
            if (side === 'left') { x = -size; y = rand(0, VH); }
            else if (side === 'right') { x = VW; y = rand(0, VH); }
            else if (side === 'top') { x = rand(0, VW); y = -size; }
            else { x = rand(0, VW); y = VH; }
            theta = Math.atan2((VH / 2) - y, (VW / 2) - x);
        }

        el.style.opacity = '0';
        layer.appendChild(el);
        requestAnimationFrame(() => { el.style.opacity = '0.62'; });

        icons.push({ el, x, y, size, r: size / 2, theta });
    } catch (e) {
        console.error(`Failed to spawn icon: ${e.message}`);
    }
}

function step(dt) {
    for (const icon of icons) {
        icon.x += Math.cos(icon.theta) * CFG.speed * dt;
        icon.y += Math.sin(icon.theta) * CFG.speed * dt;
        icon.el.style.transform = `translate(${icon.x}px, ${icon.y}px)`;

        // Despawn logic
        if (icon.x < -CFG.off || icon.x > VW + CFG.off || icon.y < -CFG.off || icon.y > VH + CFG.off) {
            icon.el.remove();
            icons.splice(icons.indexOf(icon), 1);
            spawn();
        }
    }
}

// Initial spawn
for (let i = 0; i < CFG.count; i++) {
    spawn('initial');
}

// Animation loop
let lastTime = performance.now();
function animate(currentTime) {
    const dt = (currentTime - lastTime) / 1000;
    step(dt);
    lastTime = currentTime;
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
