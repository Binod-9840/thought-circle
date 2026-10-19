const langBtn = document.getElementById("langBtn");
const navLinks = document.getElementById("navLinks");
const menuBtn = document.getElementById("mobileMenuBtn");
const adminDialog = document.getElementById("adminDialog");
const adminOpen = document.getElementById("adminOpen");
const adminOpen2 = document.getElementById("adminOpen2");
const postForm = document.getElementById("postForm");
const entriesList = document.getElementById("entriesList");
let language = "ne";
let entries = [];

const date = new Date();
document.getElementById("year").textContent = date.getFullYear();
document.getElementById("todayDate").textContent = date.toLocaleDateString("ne-NP", {year:"numeric", month:"long", day:"numeric"});

function switchLanguage() {
  language = language === "ne" ? "en" : "ne";
  document.documentElement.lang = language;
  document.querySelectorAll("[data-ne][data-en]").forEach(el => el.textContent = el.dataset[language]);
  langBtn.textContent = language === "ne" ? "English" : "नेपाली";
}
langBtn.addEventListener("click", switchLanguage);
menuBtn.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));

function openAdmin() { adminDialog.showModal(); renderEntries(); }
adminOpen.addEventListener("click", openAdmin);
adminOpen2.addEventListener("click", openAdmin);

function renderEntries() {
  entriesList.replaceChildren();
  if (!entries.length) {
    const p = document.createElement("p");
    p.className = "meta";
    p.textContent = language === "ne" ? "अहिलेसम्म यो सत्रमा कुनै सामग्री थपिएको छैन।" : "No entries have been added in this session yet.";
    entriesList.appendChild(p);
    return;
  }
  entries.forEach((entry, index) => {
    const article = document.createElement("article");
    article.className = "entry";
    const title = document.createElement("strong"); title.textContent = entry.title;
    const meta = document.createElement("small"); meta.textContent = `${entry.type} · ${entry.author || (language === "ne" ? "लेखक उल्लेख छैन" : "Author not specified")}`;
    const body = document.createElement("p"); body.textContent = entry.body;
    const remove = document.createElement("button"); remove.type = "button"; remove.className = "entry-delete"; remove.textContent = language === "ne" ? "हटाउनुहोस्" : "Delete";
    remove.addEventListener("click", () => { entries.splice(index, 1); renderEntries(); });
    article.append(title, meta, body, remove);
    entriesList.appendChild(article);
  });
}

postForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const typeSelect = document.getElementById("postType");
  entries.unshift({
    type: typeSelect.options[typeSelect.selectedIndex].text,
    section: typeSelect.value,
    title: document.getElementById("postTitle").value.trim(),
    author: document.getElementById("postAuthor").value.trim(),
    body: document.getElementById("postBody").value.trim(),
    createdAt: new Date().toISOString()
  });
  document.getElementById("adminStatus").textContent = language === "ne"
    ? "नमुना सामग्री यो ब्राउजरको हालको सत्रमा थपियो; सार्वजनिक वेबसाइटमा प्रकाशित भएको छैन।"
    : "Demo entry added in this browser session; it has not been published online.";
  postForm.reset();
  renderEntries();
});

document.getElementById("exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(entries, null, 2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "thought-circle-entries.json"; a.click();
  URL.revokeObjectURL(url);
});
