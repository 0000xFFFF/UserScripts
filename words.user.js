// ==UserScript==
// @name         Words
// @namespace    UserScript
// @version      0.1
// @description  Collect words from web pages
// @author       0xC0LD
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAKCAYAAABv7tTEAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAVUlEQVQokZWRORLAIAwDEcP/v7ypnFFsjqBOoMMGAbRLdCeSpqJ8/jEBRSCp5WHk462aIrA0hSGnBvdAAewaZo3dyUkcGLvLd5z8OPmffLfVnsX0Bw/XVzT+81ppcQAAAABJRU5ErkJggg==
// ==/UserScript==

let words = GM_getValue("words", []);
let stringWords = document.body.textContent || document.body.innerText;
let matches = stringWords.match(/\w+/gmi);
let total = matches.concat(words);
let uniq = [...new Set(total)].sort() ;
GM_setValue("words", uniq);
console.log("WORDS count.: " + uniq.length);

/* <--- comment to enable url collection
// LOG URLS
let urls = GM_getValue("urls", []);
let url = location.href;
urls.push(url);
GM_setValue("urls", urls);
console.log("URL count...: " + urls.length);
//*/
