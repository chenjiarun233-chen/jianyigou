/* 简衣购 — 自定义鼠标：箭头精确跟随 + 3 层惯性残影
   机制参考 1102houseclub.com：主指针零延迟，残影逐级 lerp 递减。
   仅在「精确指针 + 悬停可用」且未开启减弱动效时启用。 */
(function () {
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!fine.matches || reduce.matches) return;

  var SIZE_W = 24;
  var SIZE_H = 31;
  var HOT = 2.1; /* 箭头尖端在图形内的偏移，保证尖端正好落在指针热点 */

  var SVG =
    '<svg viewBox="-1.5 -1.5 17 22" aria-hidden="true">' +
    '<path d="M0 0 0 17.6 4.4 13.4 7.2 19.3 9.9 18.1 7.2 12.3 13.1 11.7Z" ' +
    'fill="#0a0a0a" stroke="#ffffff" stroke-width="1.1" stroke-linejoin="round"/>' +
    "</svg>";

  function build(isTrail, opacity) {
    var el = document.createElement("div");
    el.className = "cursor-node" + (isTrail ? " is-trail" : "");
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = SVG;
    el.style.width = SIZE_W + "px";
    el.style.height = SIZE_H + "px";
    el.style.opacity = "0";
    el.dataset.opacity = opacity;
    document.body.appendChild(el);
    return el;
  }

  var main = build(false, 1);
  var t1 = build(true, 0.28);
  var t2 = build(true, 0.15);
  var t3 = build(true, 0.07);

  var nodes = [main, t1, t2, t3];
  var speed = [1, 0.22, 0.14, 0.09];

  var tx = window.innerWidth / 2;
  var ty = window.innerHeight / 2;
  var px = [tx, tx, tx, tx];
  var py = [ty, ty, ty, ty];

  var visible = false;
  var raf = null;

  /* 原生指针在第一次移动后才隐藏，避免"进场瞬间没有指针" */
  var nativeHidden = false;

  function hideNative() {
    if (nativeHidden) return;
    nativeHidden = true;
    document.documentElement.classList.add("js-cursor");
  }

  function show() {
    nodes.forEach(function (n) {
      n.style.opacity = n.dataset.opacity;
    });
  }

  function hide() {
    nodes.forEach(function (n) {
      n.style.opacity = "0";
    });
  }

  function loop() {
    if (!visible) {
      raf = null;
      return;
    }

    /* 主指针零延迟，残影依次追赶前一层 */
    px[0] = tx;
    py[0] = ty;

    for (var i = 1; i < nodes.length; i++) {
      px[i] += (px[i - 1] - px[i]) * speed[i];
      py[i] += (py[i - 1] - py[i]) * speed[i];
    }

    for (var j = 0; j < nodes.length; j++) {
      nodes[j].style.transform =
        "translate3d(" + (px[j] - HOT) + "px," + (py[j] - HOT) + "px,0)";
    }

    raf = requestAnimationFrame(loop);
  }

  function start() {
    if (raf === null) raf = requestAnimationFrame(loop);
  }

  document.addEventListener(
    "mousemove",
    function (e) {
      tx = e.clientX;
      ty = e.clientY;

      if (!visible) {
        visible = true;
        for (var i = 0; i < nodes.length; i++) {
          px[i] = tx;
          py[i] = ty;
        }
        hideNative();
        show();
      }
      start();
    },
    { passive: true }
  );

  document.addEventListener("mouseleave", function () {
    visible = false;
    hide();
  });

  document.addEventListener("mouseenter", function () {
    if (visible) show();
  });

  window.addEventListener("blur", function () {
    visible = false;
    hide();
  });
})();
