// ==UserScript==
// @name         YouTube Thumbnail Button
// @namespace    UserScript
// @version      1.0
// @description  Adds a button to the current thumbnail of the video
// @author       0000xFFFF
// @include      http*://*.youtube.com/*
// @include      http*://youtube.com/*
// @include      http*://*.youtu.be/*
// @include      http*://youtu.be/*
// @run-at       document-end
// @icon         https://www.youtube.com/favicon.ico
// ==/UserScript==

function button_it() {

    const prevButton = document.getElementById("btn_thumbnail_url")
    if (prevButton != null) {
        prevButton.remove();
    }

    const buttonId = "btn_thumbnail_url";
    const checkInterval = 500; // Interval for checking element existence

    const intervalId = setInterval(() => {
        const startElement = document.querySelector("#start");
        if (startElement) {
            clearInterval(intervalId); // Stop checking

            const params = new URLSearchParams(window.location.search);
            const videoId = params.get("v");
            if (videoId) {
                const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

                fetch(thumbnailUrl)
                    .then(response => {
                        if (response.ok) {
                            let existingButton = document.getElementById(buttonId);
                            if (existingButton) {
                                existingButton.remove();
                            }

                            const button = document.createElement("a");
                            button.target = '_blank';
                            button.id = buttonId;
                            button.href = thumbnailUrl;
                            button.title = "Max Resolution Thumbnail";
                            button.style.cssText = `
                                display: inline-flex;
                                align-items: center;
                                margin-top: 10px;
                                padding: 5px 10px;
                                color: #ffffff;
                                background-color: #cc0000;
                                border-radius: 4px;
                                text-decoration: none;
                                font-weight: bold;
                                font-size: 14px;
                            `;

                            // Create and style the image element
                            const img = document.createElement("img");
                            img.src = thumbnailUrl;
                            img.alt = "Thumbnail";
                            img.style.cssText = `
                                width: 30px; /* Adjust width as needed */
                                height: auto;
                                max-height: 30px; /* Ensure the height fits within the button */
                                margin-right: 5px;
                                border-radius: 4px;
                                object-fit: contain; /* Maintain aspect ratio */
                            `;

                            // Append image and text to the button
                            button.appendChild(img);
                            button.appendChild(document.createTextNode(" Maxres Thumbnail"));

                            startElement.appendChild(button);
                        } else {
                            console.error("Thumbnail not found.");
                        }
                    })
                    .catch(error => console.error("Fetch error: ", error));
            }
        }
    }, checkInterval);
}

button_it();



(function() {
    'use strict';

    let lastUrl = location.href;

    function onUrlChange() {
        console.log("YouTube URL changed:", location.href);
        lastUrl = location.href;

        button_it();
    }

    // Hook into YouTube's navigation API
    const observer = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            onUrlChange();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
