const cta = document.getElementById('cta');
const btn = cta.querySelector('.actions .btn, .actions button');
const eyebrow = cta.querySelector('.eyebrow');
const qWrap = cta.querySelector('.qz-area');
const qText = cta.querySelector('#qzText');
const qAns = cta.querySelector('#qzAnswers');

if (!btn || !qWrap) {
    console.error("Quiz elements not found. Aborting quiz script.");
} else {
    const QUESTIONS = [
        { q: 'Hvem skal forkæles?', a: ['Min partner', 'En forælder', 'En søskende', 'En ven/kollega'] },
        { q: 'Hvad er cirka budgettet?', a: ['Under 250 kr.', '250–500 kr.', '500–1.000 kr.', '1.000+ kr.'] }
    ];

    let index = 0;

    function setEyebrow(i) {
        if (eyebrow) { eyebrow.textContent = 'Spørgsmål ' + (i + 1); }
    }

    function typeIn(text, speed) {
        return new Promise(resolve => {
            qText.textContent = '';
            let i = 0;
            (function step() {
                if (i < text.length) {
                    qText.textContent += text[i++];
                    setTimeout(step, speed);
                } else {
                    resolve();
                }
            })();
        });
    }

    function showAnswers(list) {
        qAns.innerHTML = '';
        list.forEach((label, i) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'qz-pill';
            b.innerHTML = `<span>${label}</span>`;
            b.style.opacity = '0';
            b.addEventListener('click', () => onSelect(b));
            qAns.appendChild(b);
            setTimeout(() => { b.style.opacity = '1'; }, 100 * i + 120);
        });
    }

    async function onSelect(btn) {
        Array.from(qAns.children).forEach(b => b.classList.remove('qz-selected'));
        btn.classList.add('qz-selected');
        await new Promise(res => setTimeout(res, 400)); // Pause for feedback
        next();
    }

    async function next() {
        if (index >= QUESTIONS.length) {
            qText.textContent = 'Tak! Vi finder gaver til dig …';
            qAns.innerHTML = '';
            return;
        }
        const { q, a } = QUESTIONS[index++];
        setEyebrow(index - 1);
        await typeIn(q, 48);
        showAnswers(a);
    }

    btn.addEventListener('click', () => {
        cta.classList.add('qz-active');
        index = 0;
        next();
    }, { once: true });
}
