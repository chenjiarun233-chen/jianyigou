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
