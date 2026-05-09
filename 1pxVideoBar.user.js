// ==UserScript==
// @name         1px Video Progress Bar
// @namespace    UserScript
// @version      1.4
// @description  Always draw a one pixel video progress bar on the bottom of every video element on the page.
// @author       0000xFFFF
// @license      MIT
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const tracked = new WeakMap();

    function addProgressBar(video) {
        if (tracked.has(video) || video.closest('.re-progress-ignored')) return;

        const bar = document.createElement('div');
        bar.className = 're-progress-bar';
        Object.assign(bar.style, {
            position:      'fixed',
            height:        '1px',
            background:    'red',
            pointerEvents: 'none',
            zIndex:        '2147483647',
            transition:    'opacity 0.2s',
            opacity:       '0'
        });

        let animationFrame;

        function sync() {
            const rect = video.getBoundingClientRect();

            // Hide bar if video is off-screen or has no size
            if (rect.height === 0 || rect.top > window.innerHeight || rect.bottom < 0) {
                bar.style.opacity = '0';
            } else {
                bar.style.opacity = '1';
                bar.style.left = rect.left + 'px';
                bar.style.top = (rect.bottom - 1) + 'px';

                const progress = video.currentTime / video.duration;
                bar.style.width = (isNaN(progress) ? 0 : progress * rect.width) + 'px';
            }

            animationFrame = requestAnimationFrame(sync);
        }

        function cleanup() {
            cancelAnimationFrame(animationFrame);
            bar.remove();
        }

        // Use IntersectionObserver to handle cleanup when video is removed
        const observer = new MutationObserver(() => {
            if (!document.contains(video)) {
                cleanup();
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        document.body.appendChild(bar);
        tracked.set(video, bar);
        sync(); // Start loop
    }

    // Twitter specific: Target videos inside the main timeline
    const scan = () => {
        const videos = document.querySelectorAll('video');
        for (const v of videos) addProgressBar(v);
    };

    // Run frequently to catch Twitter's aggressive DOM recycling
    setInterval(scan, 2000);

    const obs = new MutationObserver(scan);
    obs.observe(document.body, { childList: true, subtree: true });
})();
