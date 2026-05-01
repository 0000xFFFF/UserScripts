// ==UserScript==
// @name         1px Video Progress Bar
// @namespace    UserScript
// @version      1.3
// @description  Always draw a one pixel video progress bar on the bottom of every video element on the page.
// @author       0000xFFFF
// @license      MIT
// @match        *://*/*
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    // WeakMap: survives node replacement, no leaks when nodes are GC'd
    const tracked = new WeakMap();

    function addProgressBar(video) {
        if (tracked.has(video)) return;

        const bar = document.createElement('div');
        Object.assign(bar.style, {
            position:      'fixed',   // KEY FIX: detached from DOM hierarchy
            top:           '0',
            left:          '0',
            height:        '1px',
            width:         '0',
            background:    'red',
            pointerEvents: 'none',
            zIndex:        '2147483647',
        });

        function update() {
            if (!video.duration || isNaN(video.duration)) return;
            // Sync to actual screen coords each frame — survives any DOM restructure
            const r = video.getBoundingClientRect();
            bar.style.left  = r.left + 'px';
            bar.style.top   = (r.bottom - 1) + 'px';
            bar.style.width = (video.currentTime / video.duration) * r.width + 'px';
        }

        function reset() { bar.style.width = '0'; }

        function cleanup() {
            video.removeEventListener('timeupdate', update);
            video.removeEventListener('progress',   update);
            video.removeEventListener('loadedmetadata', reset);
            video.removeEventListener('emptied',    reset);
            bar.remove();
            // don't delete from WeakMap — node is gone anyway
        }

        video.addEventListener('timeupdate',    update);
        video.addEventListener('progress',      update);
        video.addEventListener('loadedmetadata', reset);
        video.addEventListener('emptied',       reset);

        // Clean up when 4chan X removes the video node
        const ro = new IntersectionObserver(() => {
            if (!document.contains(video)) { cleanup(); ro.disconnect(); }
        });
        ro.observe(video);

        document.body.appendChild(bar);
        tracked.set(video, bar);
    }

    function scanVideos() {
        document.querySelectorAll('video').forEach(addProgressBar);
    }

    scanVideos();
    const observer = new MutationObserver(scanVideos);
    observer.observe(document.documentElement, { childList: true, subtree: true });
})();
