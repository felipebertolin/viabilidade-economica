/* ═══════════════════════════════════════════════════════════════════════
   APP.JS — Dashboard Executivo de Viabilidade Econômica
   SPA Tab Navigation · Animations · Interactivity
   ═══════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ═══════════════════ TAB NAVIGATION ═══════════════════
    const tabs = document.querySelectorAll('.tab');
    const pages = document.querySelectorAll('.page');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.tab;

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Switch page with animation
            pages.forEach(page => {
                page.classList.remove('active');
                page.style.opacity = '0';
                page.style.transform = 'translateY(12px)';
            });

            const targetPage = document.getElementById(`page-${targetId}`);
            if (targetPage) {
                // Small delay for exit transition
                setTimeout(() => {
                    targetPage.classList.add('active');
                    // Trigger reflow for animation
                    void targetPage.offsetWidth;
                    targetPage.style.opacity = '1';
                    targetPage.style.transform = 'translateY(0)';

                    // Re-trigger card animations
                    triggerAnimations(targetPage);
                }, 150);
            }
        });
    });

    // ═══════════════════ ANIMATION TRIGGERS ═══════════════════
    function triggerAnimations(container) {
        const animCards = container.querySelectorAll('.animate-card');
        animCards.forEach(card => {
            card.style.animation = 'none';
            void card.offsetWidth; // trigger reflow
            card.style.animation = '';
        });
    }

    // Initial page animation
    const activePage = document.querySelector('.page.active');
    if (activePage) {
        triggerAnimations(activePage);
    }

    // ═══════════════════ NUMBER COUNT-UP ANIMATION ═══════════════════
    function animateNumber(element, target, prefix = '', suffix = '', separator = '') {
        const duration = 1500;
        const start = performance.now();
        const startValue = 0;

        function formatNumber(num, sep) {
            if (!sep) return Math.round(num).toString();
            return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);
        }

        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const currentValue = startValue + (target - startValue) * eased;

            element.textContent = prefix + formatNumber(currentValue, separator) + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // ═══════════════════ INTERSECTION OBSERVER ═══════════════════
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;

                // Animate KPI values
                if (el.classList.contains('kpi-value')) {
                    const value = parseInt(el.dataset.value);
                    const prefix = el.dataset.prefix || '';
                    const suffix = el.dataset.suffix || '';
                    const separator = el.dataset.separator || '';

                    if (value && !el.dataset.animated) {
                        el.dataset.animated = 'true';
                        animateNumber(el, value, prefix, suffix, separator);
                    }
                }

                // Animate stat numbers
                if (el.classList.contains('stat-number')) {
                    const value = parseInt(el.dataset.value);
                    if (value && !el.dataset.animated) {
                        el.dataset.animated = 'true';
                        animateNumber(el, value);
                    }
                }

                // Animate bar fills
                if (el.classList.contains('bar-fill')) {
                    el.style.width = el.dataset.width || el.style.width;
                }

                observer.unobserve(el);
            }
        });
    }, observerOptions);

    // Observe elements
    document.querySelectorAll('.kpi-value[data-value], .stat-number[data-value], .bar-fill').forEach(el => {
        observer.observe(el);
    });

    // ═══════════════════ TABLE ROW HOVER EFFECTS ═══════════════════
    const tableRows = document.querySelectorAll('.expense-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.transition = 'background-color 0.2s ease';
        });
    });

    // ═══════════════════ INTERACTIVE TOOLTIPS ═══════════════════
    const tooltip = document.createElement('div');
    tooltip.className = 'rubrica-tooltip';
    document.body.appendChild(tooltip);

    const tooltipElements = document.querySelectorAll('.rubrica-cell[data-detail], .infographic-card[data-detail]');

    tooltipElements.forEach(el => {
        let isHovered = false;

        el.addEventListener('mouseenter', (e) => {
            isHovered = true;
            const detailText = el.getAttribute('data-detail');
            const titleText = el.getAttribute('data-title') || el.textContent.trim();

            tooltip.innerHTML = `
                <div class="rubrica-tooltip-title">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    ${titleText}
                </div>
                <div>${detailText}</div>
            `;
            tooltip.classList.add('visible');
        });

        el.addEventListener('mousemove', (e) => {
            if (!isHovered) return;

            let x = e.clientX + 16;
            let y = e.clientY + 16;

            // Force browser layout to accurately measure tooltip bounding rect
            const rect = tooltip.getBoundingClientRect();

            // Adjust bounds to prevent overflowing the viewport
            if (x + rect.width > window.innerWidth - 16) {
                x = window.innerWidth - rect.width - 16;
            }
            if (y + rect.height > window.innerHeight - 16) {
                y = e.clientY - rect.height - 16;
            }

            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${y}px`;
        });

        el.addEventListener('mouseleave', () => {
            isHovered = false;
            tooltip.classList.remove('visible');
        });
    });

    // ═══════════════════ MAP INTERACTIVE TOOLTIPS ═══════════════════
    const mapPulses = document.querySelectorAll('.map-pulse');
    mapPulses.forEach(dot => {
        dot.style.cursor = 'pointer';
        dot.addEventListener('mouseenter', (e) => {
            const r = parseFloat(dot.getAttribute('r'));
            dot.setAttribute('r', r * 1.5);
            dot.style.transition = 'r 0.3s ease';
        });
        dot.addEventListener('mouseleave', (e) => {
            const r = parseFloat(dot.getAttribute('r'));
            dot.setAttribute('r', r / 1.5);
        });
    });

    // ═══════════════════ RADAR CHART INTERACTIVE TOOLTIPS ═══════════════════
    const radarTooltip = document.getElementById('radar-tooltip');
    const radarGroups = document.querySelectorAll('.radar-interactive-group');

    const radarExplanations = [
        "Chegamos antes. Foco em Hubs otimiza tempo e gera grandes eventos.", // 0: Aérea
        "Decisões baseadas em dados, não em 'achismo'. Zero desperdício.", // 1: Inteligência
        "Ecossistema integrado. Votos dos estaduais são canalizados para nós.", // 2: Rua
        "Domínio do tráfego pago segmentado, não apenas posts orgânicos.", // 3: Digital
        "Custo 46% menor que a média de mercado para um resultado superior." // 4: Financeira
    ];

    radarGroups.forEach(group => {
        group.addEventListener('mouseenter', (e) => {
            const idx = parseInt(group.getAttribute('data-idx'));
            const titleEl = group.querySelector('.radar-label');
            const titleText = titleEl ? titleEl.textContent : '';
            const descText = radarExplanations[idx] || '';

            if (radarTooltip) {
                radarTooltip.innerHTML = `
                    <span class="radar-tooltip-title">${titleText}</span>
                    <span class="radar-tooltip-desc">${descText}</span>
                `;
                radarTooltip.classList.add('visible');
            }

            // Pop effect on hover
            group.style.transform = 'scale(1.05)';
            group.style.transformOrigin = 'center';
            if (titleEl) titleEl.style.fill = '#fff';
        });

        group.addEventListener('mousemove', (e) => {
            if (!radarTooltip) return;
            // Position relative to the container for better stability on SVG
            const container = document.querySelector('.dna-chart-container');
            if (!container) return;
            const rect = container.getBoundingClientRect();
            // Mouse coords relative to the container
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top - 80; // Offset higher than cursor

            radarTooltip.style.left = `${x}px`;
            radarTooltip.style.top = `${y}px`;
        });

        group.addEventListener('mouseleave', () => {
            if (radarTooltip) radarTooltip.classList.remove('visible');
            const titleEl = group.querySelector('.radar-label');

            group.style.transform = 'scale(1)';
            if (titleEl) titleEl.style.fill = '#cbd5e1';
        });
    });

    // ═══════════════════ KEYBOARD NAVIGATION ═══════════════════
    document.addEventListener('keydown', (e) => {
        if (e.key === '1') {
            document.getElementById('tab-estrategia').click();
        } else if (e.key === '2') {
            document.getElementById('tab-execucao').click();
        } else if (e.key === '3') {
            document.getElementById('tab-elite7').click();
        }
    });

    // ═══════════════════ SMOOTH SCROLL TO TOP ON TAB CHANGE ═══════════════════
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    console.log('✅ Dashboard Executivo de Viabilidade Econômica carregado com sucesso.');
});

// ═══════════════════ FLIP CARD & READ MORE FUNCTIONS ═══════════════════
window.toggleFlip = function (btn) {
    const container = btn.closest('.flip-container');
    if (container) {
        container.classList.toggle('flipped');
    }
};

window.toggleReadMore = function (btn) {
    const wrapper = btn.previousElementSibling;
    const chevron = btn.querySelector('.chevron');
    const span = btn.querySelector('span');

    if (wrapper) {
        wrapper.classList.toggle('expanded');
        if (wrapper.classList.contains('expanded')) {
            if (span) span.textContent = 'Mostrar Menos';
            if (chevron) chevron.style.transform = 'rotate(180deg)';
        } else {
            if (span) span.textContent = 'Leia Mais';
            if (chevron) chevron.style.transform = 'rotate(0deg)';
        }
    }
};
