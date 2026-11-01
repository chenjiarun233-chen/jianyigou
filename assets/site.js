/* 简衣购 — 页脚「需要帮助？」面板：点击外部或按 Esc 收起 */
(function () {
  var help = document.querySelector(".help");
  if (!help) return;

  document.addEventListener("click", function (e) {
    if (help.open && !help.contains(e.target)) help.open = false;
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && help.open) {
      help.open = false;
      var summary = help.querySelector("summary");
      if (summary) summary.focus();
    }
  });
})();

/* 列表页收藏按钮（纯前端状态） */
document.addEventListener("click", function (e) {
  var btn = e.target.closest ? e.target.closest(".card__fav") : null;
  if (!btn) return;
  var on = btn.getAttribute("aria-pressed") === "true";
  btn.setAttribute("aria-pressed", String(!on));
});

/* 列表页：点击颜色圈切换主图（与详情页同效果） */
document.addEventListener("click", function (e) {
  var dot = e.target.closest ? e.target.closest(".card__colors .dot") : null;
  if (!dot) return;
  var card = dot.closest(".card");
  if (!card) return;
  var dots = card.querySelectorAll(".card__colors .dot");
  Array.prototype.forEach.call(dots, function (d) {
    d.setAttribute("aria-pressed", String(d === dot));
  });
  var img = card.querySelector(".card__media img");
  if (img && dot.dataset.img) {
    img.src = dot.dataset.img;
    if (dot.dataset.alt) img.alt = dot.dataset.alt;
  }
});
