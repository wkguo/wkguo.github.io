// REMA project page: lazy video playback (after seohong.me/projects/ocbench) + BibTeX copy.

(function () {
  // All page videos are H.265/HEVC Main 10. Browsers without HEVC decoding keep the poster frame.
  var probe = document.createElement('video');
  var hevcSupported = !!(probe.canPlayType && probe.canPlayType('video/mp4; codecs="hvc1.2.4.L120.90"'));
  if (!hevcSupported) document.documentElement.classList.add('no-hevc');

  var videos = Array.prototype.slice.call(document.querySelectorAll('video[data-src]'));
  if (!hevcSupported) {
    // Nothing can be played: hide the native controls so the posters do not look playable.
    videos.forEach(function (video) { video.controls = false; });
    return;
  }
  if (!videos.length) return;

  var visible = new Set();
  var pausedByUser = new Set();
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var saveData = navigator.connection && navigator.connection.saveData;
  // Without autoplay (reduced motion, data saver) every video needs controls to be playable by hand.
  if (reducedMotion.matches || saveData) videos.forEach(function (video) { video.controls = true; });

  function playVisible() {
    if (document.hidden || reducedMotion.matches || saveData) return;
    visible.forEach(function (video) {
      if (!pausedByUser.has(video)) {
        var p = video.play();
        if (p && p.catch) p.catch(function () { video.controls = true; });  // autoplay blocked
      }
    });
  }

  videos.forEach(function (video) {
    video.addEventListener('pause', function () {
      if (visible.has(video) && !document.hidden) pausedByUser.add(video);
    });
    video.addEventListener('play', function () { pausedByUser.delete(video); });
  });

  function load(video) {
    if (!video.hasAttribute('src')) {
      video.src = video.dataset.src;
      video.preload = 'metadata';
      video.load();
    }
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var video = entry.target;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
          visible.add(video);
          load(video);
        } else {
          visible.delete(video);
          video.pause();
        }
      });
      playVisible();
    }, { threshold: [0, 0.25] });
    videos.forEach(function (video) { observer.observe(video); });
  } else {
    videos.forEach(load);
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      videos.forEach(function (video) { video.pause(); });
    } else {
      playVisible();
    }
  });
})();

(function () {
  var btn = document.getElementById('copy-bibtex');
  var block = document.getElementById('bibtex-text');
  if (!btn || !block) return;
  btn.addEventListener('click', function () {
    var text = block.textContent.trim();
    function done() {
      btn.textContent = 'Copied';
      setTimeout(function () { btn.textContent = 'Copy'; }, 1500);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done);
    } else {
      var ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      done();
    }
  });
})();
