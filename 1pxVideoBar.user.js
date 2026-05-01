// ==UserScript==
// @name         1px Video Progress Bar
// @namespace    UserScript
// @version      1.2
// @description  Always draw a one pixel video progress bar on the bottom of every video element on the page.
// @author       0000xFFFF
// @license      MIT
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function addProgressBar(video) {
        if (video._progressBar) return;

        const bar = document.createElement('div');
        bar.style.position = 'absolute';
        bar.style.left = '0';
        bar.style.bottom = '0';
        bar.style.height = '1px';
        bar.style.width = '0%';
        bar.style.background = 'red';
        bar.style.pointerEvents = 'none';
        bar.style.zIndex = '9999';

        function getContainer() {
            // Find a safe positioned parent
            let el = video;
            while (el && el !== document.body) {
                const style = getComputedStyle(el);
                if (style.position !== 'static') return el;
                el = el.parentElement;
            }
            return video.parentElement;
        }

        const container = getContainer();
        if (!container) return;

        // Ensure container can hold absolute children
        if (getComputedStyle(container).position === 'static') {
            container.style.position = 'relative';
        }

        container.appendChild(bar);

        function update() {
            if (!video.duration || isNaN(video.duration)) {
                bar.style.width = '0%';
                return;
            }
            bar.style.width = (video.currentTime / video.duration) * 100 + '%';
        }

        function reset() {
            bar.style.width = '0%';
        }

        video.addEventListener('timeupdate', update);
        video.addEventListener('progress', update);
        video.addEventListener('loadedmetadata', reset);
        video.addEventListener('emptied', reset);

        video._progressBar = bar;
    }

    function scanVideos() {
        document.querySelectorAll('video').forEach(addProgressBar);
    }

    scanVideos();

    const observer = new MutationObserver(scanVideos);
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();
