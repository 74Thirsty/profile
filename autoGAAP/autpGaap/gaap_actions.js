export function buildGAAPButton(label, entryGenerator) {
  const id = `gaap-post-${Math.random().toString(36).slice(2)}`;
  setTimeout(() => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.onclick = () => {
        const newEntry = entryGenerator();
        if (newEntry) {
          window.journalEntries = window.journalEntries || [];
          window.journalEntries.push(newEntry);
          localStorage.setItem("journalEntries", JSON.stringify(window.journalEntries));
          if (window.displayJournalEntries) window.displayJournalEntries();
          if (window.updateBalanceStatus) window.updateBalanceStatus();
          alert("📥 AutoGAAP entry posted.");
        }
      };
    }
  }, 0);
  return `<button id="${id}">${label}</button>`;
}
