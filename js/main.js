// Set the copyright year
document.getElementById('year').textContent = new Date().getFullYear();

// Adjust hero section height based on viewport size
const docEl = document.documentElement;
const header = document.querySelector('.nav');
const footer = document.querySelector('.site-footer');

function setHeroHeight() {
    const vp = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    const h = Math.max(320, Math.round(vp - (header?.offsetHeight || 0) - (footer?.offsetHeight || 0) - 1));
    docEl.style.setProperty('--hero-avail', h + 'px');
}

addEventListener('resize', setHeroHeight);
addEventListener('orientationchange', setHeroHeight);
addEventListener('DOMContentLoaded', setHeroHeight);
setHeroHeight(); // Initial call
