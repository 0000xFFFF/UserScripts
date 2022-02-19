// ==UserScript==
// @name         Words
// @namespace    UserScript
// @version      0.1
// @description  Collect words from page
// @author       0xC0LD
// @match *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAEsSURBVDhPlZNNi4JQFIbnz7eIVgliIIIkGEpCWfiBS7fuFEMURdpIC3cWrc5wT2cmT0XTPCD3fS/eR7xev2BEkiRwPB6pfQYTBEEAURT9S8IEvu/jGIYhtG2L+S+YYLfbUQLwPO8jCRNsNhtKN/b7PTRNQ+01TOA4DqU72+0W6rqm9gwTWJZFiSPEVVVR4zCBaZqUnrFtG8qypHaHCZbLJaXXrFYrKIqC2g0m0DSN0o3L5QK6ruP8zyW+zhgmWCwWOPZ9j5snEIfrcDhgfgUTzOdzXKwoCqzXa8jzHM7nM+7N9XqluzhMMJvNQJIkfOLpdPp9JXE+0jTF/AgTGIYBWZZRA3BdFxcOwwCqqtIshwke6boOZFnGPJ1OcXzkrUAgfrDJZAJxHNPMGIBvHAPJlLxLDG4AAAAASUVORK5CYII=
// ==/UserScript==

let words = GM_getValue("words", []);
let urls = GM_getValue("urls", []);
let url = location.href;
urls.push(url);
let stringWords = document.body.textContent || document.body.innerText;
let matches = stringWords.match(/\w+/gmi);
let total = matches.concat(words);
let uniq = [...new Set(total)].sort() ;
GM_setValue("words", uniq);
GM_setValue("urls", urls);
console.log("URL count...: " + urls.length);
console.log("WORDS count.: " + uniq.length);
