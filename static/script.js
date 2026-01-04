const accountEl = document.getElementById("account");
const usernameEl = document.getElementById("username");
const passwordEl = document.getElementById("password");
const lenEl = document.getElementById("len");
const listEl = document.getElementById("list");

document.getElementById("genBtn").addEventListener("click", async () => {
  const len = Math.max(8, Math.min(64, parseInt(lenEl.value || "16", 10)));
  const res = await fetch(`/generate?length=${len}`);
  const data = await res.json();
  passwordEl.value = data.password;
});

document.getElementById("copyBtn").addEventListener("click", async () => {
  if (!passwordEl.value) return;
  await navigator.clipboard.writeText(passwordEl.value);
  alert("Password copied to clipboard");
});

document.getElementById("addBtn").addEventListener("click", async () => {
  const account = (accountEl.value || "").trim();
  const username = (usernameEl.value || "").trim();
  const password = passwordEl.value || "";

  if (!account || !username || !password) {
    alert("Please fill account, username, and password.");
    return;
  }

  const res = await fetch("/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ account, username, password }),
  });

  if (res.ok) {
    accountEl.value = "";
    usernameEl.value = "";
    passwordEl.value = "";
    await loadPasswords();
    alert("Saved!");
  } else {
    const err = await res.json();
    alert(err.error || "Failed to save");
  }
});

async function loadPasswords() {
  const res = await fetch("/view");
  const data = await res.json();
  renderList(data);
}

function renderList(items) {
  listEl.innerHTML = "";
  if (!items.length) {
    const p = document.createElement("p");
    p.className = "empty";
    p.textContent = "No entries yet.";
    listEl.appendChild(p);
    return;
  }

  for (const item of items) {
    const row = document.createElement("div");
    row.className = "item";

    const a = document.createElement("div");
    a.innerHTML = `<strong>${item.account}</strong>`;
    const u = document.createElement("div");
    u.textContent = item.username;
    const p = document.createElement("code");
    p.textContent = item.password;

    const copyBtn = document.createElement("button");
    copyBtn.textContent = "Copy";
    copyBtn.addEventListener("click", async () => {
      await navigator.clipboard.writeText(item.password);
      alert("Copied!");
    });

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.style.background = "#ef4444";
    delBtn.addEventListener("click", async () => {
      if (!confirm(`Delete '${item.account}'?`)) return;
      const res = await fetch(`/delete/${encodeURIComponent(item.account)}`, { method: "DELETE" });
      if (res.ok) {
        await loadPasswords();
      } else {
        const err = await res.json();
        alert(err.error || "Delete failed");
      }
    });

    row.appendChild(a);
    row.appendChild(u);
    row.appendChild(p);
    row.appendChild(copyBtn);
    row.appendChild(delBtn);
    listEl.appendChild(row);
  }
}

document.addEventListener("DOMContentLoaded", loadPasswords);
