// ---------- ELEMENTS ----------
const grid = document.getElementById("roadmapGrid");
const savedGrid = document.getElementById("savedGrid");
const filters = document.getElementById("filters");
const searchInput = document.getElementById("searchInput");
const trackCount = document.getElementById("trackCount");

const totalEl = document.getElementById("totalTopics");
const doneEl = document.getElementById("doneTopics");
const pendingEl = document.getElementById("pendingTopics");
const percentEl = document.getElementById("percent");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalSubtopics = document.getElementById("modalSubtopics");
const modalLinks = document.getElementById("modalLinks");
const closeModalBtn = document.getElementById("closeModal");

const navLinks = document.getElementById("navLinks");

const chatBtn = document.getElementById("chatBtn");
const chatPanel = document.getElementById("chatPanel");
const chatClose = document.getElementById("chatClose");
const chatReply = document.getElementById("chatReply");

// ---------- STATE ----------
let currentFilter = "All";
let searchText = "";
let completed = load("dsaCompleted");
let saved = load("dsaSaved");

// ---------- LOCAL STORAGE ----------
function load(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch (e) {
        return [];
    }
}

function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// ---------- CREATE ONE CARD ----------
function createCard(topic) {
    const isDone = completed.includes(topic.id);
    const isSaved = saved.includes(topic.id);

    const card = document.createElement("div");
    card.className = "card" + (isDone ? " done" : "");

    card.innerHTML = `
    <div class="card-top">
      <div class="icon-box"><i class="fa-solid ${topic.icon}"></i></div>
      <button class="bookmark-btn ${isSaved ? "saved" : ""}" title="Save path">
        <i class="${isSaved ? "fa-solid" : "fa-regular"} fa-bookmark"></i>
      </button>
    </div>
    <div class="card-meta">
      <span class="step">STEP ${topic.id}</span>
      <span class="badge ${topic.level}">${topic.level}</span>
    </div>
    <h3>${topic.title}</h3>
    <p>${topic.description}</p>
    <div class="card-bottom">
      <label class="check">
        <input type="checkbox" ${isDone ? "checked" : ""} />
        ${isDone ? "Completed" : "Mark done"}
      </label>
      <span class="view-link">View details →</span>
    </div>
  `;

    card.querySelector(".bookmark-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        toggleSaved(topic.id);
    });

    card.querySelector(".check").addEventListener("click", (e) => e.stopPropagation());
    card.querySelector("input").addEventListener("change", () => toggleDone(topic.id));

    card.addEventListener("click", () => openModal(topic));

    return card;
}

// ---------- RENDER: EXPLORE ----------
function renderExplore() {
    grid.innerHTML = "";

    const q = searchText.toLowerCase();

    const list = roadmap.filter((t) => {
        const matchLevel = currentFilter === "All" || t.level === currentFilter;
        const matchSearch =
            q === "" ||
            t.title.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.subtopics.some((s) => s.toLowerCase().includes(q));
        return matchLevel && matchSearch;
    });

    trackCount.textContent = `${list.length} Track${list.length === 1 ? "" : "s"} Available`;

    if (list.length === 0) {
        grid.innerHTML = `<div class="empty">No topics found. Try a different search.</div>`;
        return;
    }

    list.forEach((t) => grid.appendChild(createCard(t)));
}

// ---------- RENDER: SAVED ----------
function renderSaved() {
    savedGrid.innerHTML = "";
    const list = roadmap.filter((t) => saved.includes(t.id));

    if (list.length === 0) {
        savedGrid.innerHTML = `
      <div class="empty-panel">
        <div class="empty-state">
          <i class="fa-regular fa-bookmark"></i>
          <h4>No Saved Paths Pinned</h4>
          <p>Click the bookmark icon on any topic card to save it here.</p>
        </div>
      </div>`;
        return;
    }

    list.forEach((t) => savedGrid.appendChild(createCard(t)));
}

// ---------- RENDER: DASHBOARD ----------
function updateProgress() {
    const total = roadmap.length;
    const done = completed.length;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);

    totalEl.textContent = total;
    doneEl.textContent = done;
    pendingEl.textContent = total - done;
    percentEl.textContent = pct + "%";

    renderActiveProgress();
}

function renderActiveProgress() {
    const box = document.getElementById("activeProgress");

    if (completed.length === 0) {
        box.innerHTML = `
      <div class="empty-state">
        <i class="fa-regular fa-circle-play"></i>
        <p>No learning started yet. Tick a topic on the roadmap to see it tracked here.</p>
      </div>`;
        return;
    }

    box.innerHTML = ["Beginner", "Intermediate", "Advanced"]
        .map((level) => {
            const all = roadmap.filter((t) => t.level === level);
            const done = all.filter((t) => completed.includes(t.id)).length;
            const pct = all.length ? Math.round((done / all.length) * 100) : 0;
            return `
        <div class="level-row">
          <div class="level-top">
            <span>${level}</span>
            <span>${done}/${all.length} topics • ${pct}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${pct}%"></div>
          </div>
        </div>`;
        })
        .join("");
}

function refreshAll() {
    renderExplore();
    renderSaved();
    updateProgress();
}

// ---------- ACTIONS ----------
function toggleDone(id) {
    completed = completed.includes(id)
        ? completed.filter((x) => x !== id)
        : [...completed, id];
    save("dsaCompleted", completed);
    refreshAll();
}

function toggleSaved(id) {
    saved = saved.includes(id) ? saved.filter((x) => x !== id) : [...saved, id];
    save("dsaSaved", saved);
    refreshAll();
}

// ---------- VIEW SWITCHING ----------
function showView(name) {
    document.querySelectorAll(".view").forEach((v) => v.classList.add("hidden"));
    document.getElementById("view-" + name).classList.remove("hidden");

    document.getElementById("hero").classList.toggle("hidden", name !== "explore");

    document.querySelectorAll(".nav-link").forEach((b) => {
        b.classList.toggle("active", b.dataset.view === name);
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
}

navLinks.addEventListener("click", (e) => {
    const btn = e.target.closest(".nav-link");
    if (!btn) return;
    showView(btn.dataset.view);
});

// ---------- FILTERS ----------
filters.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter");
    if (!btn) return;

    document.querySelectorAll(".filter").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    currentFilter = btn.dataset.level;
    renderExplore();
});

// ---------- SEARCH ----------
searchInput.addEventListener("input", (e) => {
    searchText = e.target.value.trim();
    showView("explore");
    renderExplore();
});

// ---------- MODAL ----------
function openModal(topic) {
    modalTitle.textContent = topic.title;
    modalDesc.textContent = topic.description;

    modalSubtopics.innerHTML = topic.subtopics.map((s) => `<li>${s}</li>`).join("");
    modalLinks.innerHTML = topic.links
        .map((l) => `<li><a href="${l.url}" target="_blank" rel="noopener">${l.name}</a></li>`)
        .join("");

    modal.classList.remove("hidden");
}

function closeModal() {
    modal.classList.add("hidden");
}

closeModalBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
});

// ---------- CHATBOT ----------
chatBtn.addEventListener("click", () => chatPanel.classList.toggle("hidden"));
chatClose.addEventListener("click", () => chatPanel.classList.add("hidden"));

document.querySelectorAll(".chat-opt").forEach((btn) => {
    btn.addEventListener("click", () => {
        const level = btn.dataset.level;
        const next = roadmap.find((t) => t.level === level && !completed.includes(t.id));

        chatReply.textContent = next
            ? `Start with "${next.title}" (Step ${next.id}). ${next.description}`
            : `You've completed every ${level} topic. Great work! Try the next level.`;
    });
});

// ---------- INIT ----------
refreshAll();
showView("explore");