// ==UserScript==
// @name         1px Video Progress Bar
// @namespace    UserScript
// @version      1.5
// @description  Draw a 1px progress bar on every visible video
// @author       0000xFFFF
// @license      MIT
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const tracked = new WeakSet();

    function addProgressBar(video) {
        if (tracked.has(video)) return;

        tracked.add(video);

        const bar = document.createElement('div');

        Object.assign(bar.style, {
            position: 'fixed',
            height: '1px',
            background: 'red',
            pointerEvents: 'none',
            zIndex: '2147483647',
            opacity: '0'
        });

        document.body.appendChild(bar);

        let raf;

        function sync() {
            // Video removed from DOM
            if (!document.contains(video)) {
                cancelAnimationFrame(raf);
                bar.remove();
                return;
            }

            const rect = video.getBoundingClientRect();

            // Hidden/offscreen/invalid
            if (
                rect.width <= 0 ||
                rect.height <= 0 ||
                rect.bottom < 0 ||
                rect.top > window.innerHeight
            ) {
                bar.style.opacity = '0';
            } else {
                bar.style.opacity = '1';

                const duration = video.duration || 0;
                const progress = duration > 0
                    ? video.currentTime / duration
                    : 0;

                bar.style.left = rect.left + 'px';
                bar.style.top = (rect.bottom - 1) + 'px';
                bar.style.width = (rect.width * progress) + 'px';
            }

            raf = requestAnimationFrame(sync);
        }

        // Wait until metadata exists
        if (video.readyState >= 1) {
            sync();
        } else {
            video.addEventListener('loadedmetadata', sync, { once: true });
        }
    }

    function scan() {
        document.querySelectorAll('video').forEach(addProgressBar);
    }

    // Initial scan
    scan();

    // Catch dynamically inserted videos
    const observer = new MutationObserver(scan);

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

})();
