export function createDialogBox(title, contentLines = []) {
  const existing = document.getElementById("gaap-dialog");
  if (existing) existing.remove();

  const dialog = document.createElement("div");
  dialog.id = "gaap-dialog";
  dialog.style.position = "fixed";
  dialog.style.top = "20%";
  dialog.style.left = "50%";
  dialog.style.transform = "translateX(-50%)";
  dialog.style.backgroundColor = "#222";
  dialog.style.color = "#fff";
  dialog.style.padding = "20px";
  dialog.style.borderRadius = "8px";
  dialog.style.boxShadow = "0 0 10px #000";
  dialog.style.zIndex = "9999";
  dialog.style.maxWidth = "420px";

  let inner = `<h3>${title}</h3>`;
  contentLines.forEach(line => {
    inner += `<p style="margin: 4px 0;">${line}</p>`;
  });
  inner += `<button id="gaap-close" style="margin-top:10px;">Close</button>`;

  dialog.innerHTML = inner;
  document.body.appendChild(dialog);
  document.getElementById("gaap-close").onclick = () => dialog.remove();
}
