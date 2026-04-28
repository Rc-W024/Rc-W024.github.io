/* Vanilla replacement for the jQuery + TweenMax + perfectScrollbar trio.
   Owns: mobile sidebar toggle, R&D timeline accordion, current-section highlight.
   Theme switching itself is inline in <head> to avoid FOUC. */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        initSidebarToggle();
        initTimelineAccordion();
        initCurrentSectionHighlight();
        initSmoothScrollFallback();
        initStyleSwitcher();
    });

    function initSidebarToggle() {
        var toggle = document.querySelector('a.mobilemenu');
        var sidebar = document.getElementById('sidebar');
        var main = document.getElementById('main');
        if (!toggle || !sidebar || !main) return;

        function setOpen(open) {
            document.body.classList.toggle('sidebar-open', open);
            sidebar.setAttribute('aria-hidden', open ? 'false' : 'true');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        }

        toggle.setAttribute('role', 'button');
        toggle.setAttribute('aria-controls', 'sidebar');
        toggle.setAttribute('aria-expanded', 'false');
        sidebar.setAttribute('aria-hidden', 'true');

        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            setOpen(!document.body.classList.contains('sidebar-open'));
        });

        // Close when a nav link is clicked
        sidebar.addEventListener('click', function (e) {
            var link = e.target.closest('a');
            if (link && !link.classList.contains('external')) setOpen(false);
        });

        // Close on outside click (touch UX)
        main.addEventListener('click', function () {
            if (document.body.classList.contains('sidebar-open')) setOpen(false);
        });

        // Close on Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && document.body.classList.contains('sidebar-open')) {
                setOpen(false);
                toggle.focus();
            }
        });
    }

    function initTimelineAccordion() {
        var timelines = document.querySelectorAll('ul.timeline');
        timelines.forEach(function (tl) {
            var items = tl.children;
            if (!items.length) return;

            // Open the first item by default; collapse the rest.
            for (var i = 0; i < items.length; i++) {
                var li = items[i];
                var text = li.querySelector('.text');
                if (!text) continue;
                if (i === 0) {
                    li.classList.add('open');
                    text.style.display = 'block';
                } else {
                    text.style.display = 'none';
                }
                // Make the row keyboard-accessible
                li.setAttribute('tabindex', '0');
                li.setAttribute('role', 'button');
                li.setAttribute('aria-expanded', i === 0 ? 'true' : 'false');
            }

            tl.addEventListener('click', function (e) {
                if (e.target.closest('a, button, input')) return;
                var li = e.target.closest('li');
                if (!li || li.parentElement !== tl) return;
                openTimelineItem(tl, li);
            });

            tl.addEventListener('keydown', function (e) {
                if (e.key !== 'Enter' && e.key !== ' ') return;
                var li = e.target.closest('li');
                if (!li || li.parentElement !== tl) return;
                e.preventDefault();
                openTimelineItem(tl, li);
            });
        });
    }

    function openTimelineItem(tl, li) {
        Array.prototype.forEach.call(tl.children, function (sib) {
            var t = sib.querySelector('.text');
            if (!t) return;
            if (sib === li) {
                sib.classList.add('open');
                t.style.display = 'block';
                sib.setAttribute('aria-expanded', 'true');
            } else {
                sib.classList.remove('open');
                t.style.display = 'none';
                sib.setAttribute('aria-expanded', 'false');
            }
        });
    }

    function initCurrentSectionHighlight() {
        var navLinks = document.querySelectorAll('#navigation a');
        if (!navLinks.length || !('IntersectionObserver' in window)) return;

        // Build map: section id -> nav <li>
        var map = {};
        navLinks.forEach(function (a) {
            var m = (a.getAttribute('onclick') || '').match(/#([\w-]+)/);
            if (m) map[m[1]] = a.closest('li');
        });
        var ids = Object.keys(map);
        if (!ids.length) return;

        var sections = ids
            .map(function (id) { return document.getElementById(id); })
            .filter(Boolean);

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var li = map[entry.target.id];
                if (!li) return;
                navLinks.forEach(function (a) {
                    var p = a.parentElement;
                    if (!p.classList.contains('external')) p.classList.remove('currentmenu');
                });
                li.classList.add('currentmenu');
            });
        }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

        sections.forEach(function (s) { io.observe(s); });
    }

    function initSmoothScrollFallback() {
        // Smooth scroll is handled by inline onclick handlers; this just adds
        // CSS scroll-behavior as belt-and-braces, respecting reduced-motion.
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        document.documentElement.style.scrollBehavior = 'smooth';
    }

    function initStyleSwitcher() {
        // Only render when ?style= is present (preview mode).
        var current = new URLSearchParams(location.search).get('style');
        if (!current) return;
        var current_norm = ({ legacy: 1, academic: 1, tech: 1 })[current] ? current : 'legacy';

        var styles = [
            { key: 'legacy',   label: 'Legacy'   },
            { key: 'academic', label: 'Academic' },
            { key: 'tech',     label: 'Tech'     }
        ];

        var box = document.createElement('div');
        box.id = 'style-switcher';
        box.setAttribute('role', 'group');
        box.setAttribute('aria-label', 'Theme preview');
        box.innerHTML =
            '<style>' +
              '#style-switcher{position:fixed;right:16px;bottom:16px;z-index:9999;' +
              'display:flex;gap:6px;padding:6px;border-radius:999px;' +
              'background:rgba(20,22,30,0.85);backdrop-filter:blur(14px);' +
              '-webkit-backdrop-filter:blur(14px);' +
              'border:1px solid rgba(255,255,255,0.18);' +
              'box-shadow:0 8px 30px rgba(0,0,0,0.35);' +
              'font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;font-size:13px}' +
              '#style-switcher button{appearance:none;border:0;cursor:pointer;' +
              'padding:7px 14px;border-radius:999px;font:inherit;color:#cbd5e1;' +
              'background:transparent;transition:background .15s,color .15s;min-height:34px}' +
              '#style-switcher button:hover{color:#fff;background:rgba(255,255,255,0.08)}' +
              '#style-switcher button[aria-pressed="true"]{' +
              'background:linear-gradient(135deg,#5eead4,#6366f1);color:#0b1020;font-weight:600}' +
              '#style-switcher button:focus-visible{outline:2px solid #5eead4;outline-offset:2px}' +
              '@media (max-width:480px){#style-switcher{right:8px;bottom:8px;font-size:12px}' +
              '#style-switcher button{padding:6px 10px}}' +
            '</style>';

        styles.forEach(function (s) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = s.label;
            btn.dataset.style = s.key;
            btn.setAttribute('aria-pressed', s.key === current_norm ? 'true' : 'false');
            btn.addEventListener('click', function () {
                var url = new URL(location.href);
                url.searchParams.set('style', s.key);
                location.href = url.toString();
            });
            box.appendChild(btn);
        });

        document.body.appendChild(box);
    }
})();
