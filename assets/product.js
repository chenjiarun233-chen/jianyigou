/* 简衣购 — 商品详情页交互：图片切换 / 颜色 / 尺码 / 入袋提示 */
(function () {
  var main = document.getElementById("pdp-main");
  if (!main) return;

  var thumbs = Array.prototype.slice.call(document.querySelectorAll(".pdp__thumb"));
  var swatches = Array.prototype.slice.call(document.querySelectorAll(".swatch"));
  var colorName = document.getElementById("pdp-color-name");
  var sizes = Array.prototype.slice.call(document.querySelectorAll(".size"));
  var bag = document.getElementById("pdp-bag");
  var toast = document.getElementById("bag-toast");
  var toastTimer = null;

  function setMain(src, alt) {
    main.src = src;
    if (alt) main.alt = alt;
  }

  function selectThumb(src) {
    thumbs.forEach(function (t) {
      t.setAttribute("aria-selected", String(t.dataset.img === src));
    });
  }

  function showToast(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("is-on");
    }, 2200);
  }

  thumbs.forEach(function (thumb) {
    thumb.addEventListener("click", function () {
      setMain(thumb.dataset.img, thumb.dataset.alt);
      selectThumb(thumb.dataset.img);
    });
  });

  swatches.forEach(function (sw) {
    sw.addEventListener("click", function () {
      swatches.forEach(function (s) {
        s.setAttribute("aria-pressed", String(s === sw));
      });
      if (colorName) colorName.textContent = sw.dataset.name;
      setMain(sw.dataset.img, sw.dataset.alt);
      selectThumb(sw.dataset.img);
    });
  });

  sizes.forEach(function (size) {
    size.addEventListener("click", function () {
      sizes.forEach(function (s) {
        s.setAttribute("aria-pressed", String(s === size));
      });
    });
  });

  if (bag) {
    bag.addEventListener("click", function () {
      var picked = sizes.filter(function (s) {
        return s.getAttribute("aria-pressed") === "true";
      })[0];

      if (!picked) {
        showToast("请先选择尺码");
        return;
      }

      showToast("已入袋 · " + picked.textContent.trim() + " 码（结算功能待接入）");
    });
  }
})();
