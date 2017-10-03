// ==UserScript==
// @name         BetterPgFb
// @namespace    http://madox2.poriadne.sk/ @version      0.1
// @description  Improved page down/up functionality for facebook stream
// @author       madox2
// @include        https://www.facebook.com/
// @include        https://www.facebook.com/?*
// @grant        none
// ==/UserScript==

(function() {
  const PADDING_TOP = 50;
  const PG_DN_KEY = 34;
  const PG_UP_KEY = 33;
  let current = null;

  function keyDownListener(key, fn) {
    document.addEventListener('keydown', e => {
      if (e.which === key) {
        e.preventDefault();
        fn(e);
      }
    });
  }

  function scrollToCurrentPost() {
    window.scrollBy(0, current.getBoundingClientRect().top - PADDING_TOP);
  }

  function all() {
    const posts = Array.from(
      document.querySelectorAll('div[data-testid="fbfeed_story"]')
    );
    const isOuterPost = post =>
      !posts.find(p => p !== post && p.contains(post));
    return posts.filter(isOuterPost);
  }

  function isNotCurrent(post) {
    return post !== current;
  }

  function next() {
    const posts = all().filter(e => e.getBoundingClientRect().top > 0);
    current = posts.find(isNotCurrent);
  }

  function prev() {
    const posts = all().filter(e => e.getBoundingClientRect().top < 0);
    current = posts.reverse().find(isNotCurrent);
  }

  keyDownListener(PG_DN_KEY, () => {
    next();
    if (!current) {
      return;
    }
    scrollToCurrentPost();
  });

  keyDownListener(PG_UP_KEY, () => {
    prev();
    if (!current) {
      return window.scrollTo(0, 0);
    }
    scrollToCurrentPost();
  });
})();
