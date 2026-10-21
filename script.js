// ---------- ELEMENTS ----------
const grid = document.getElementById("roadmapGrid");
const filters = document.getElementById("filters");
const totalEl = document.getElementById("totalTopics");
const doneEl = document.getElementById("doneTopics");
const percentEl = document.getElementById("percent");
const fillEl = document.getElementById("progressFill");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalSubtopics = document.getElementById("modalSubtopics");
const modalLinks = document.getElementById("modalLinks");
const closeModalBtn = document.getElementById("closeModal");
const themeToggle = document.getElementById("themeToggle");

// ---------- STATE ----------
let currentFilter = "All";
let completed = loadCompleted();

// ---------- LOCAL STORAGE ----------
function loadCompleted() {
    try {
        return JSON.parse(localStorage.getItem("dsaCompleted")) || [];
    } catch (e) {
        return [];
    }
}

function saveCompleted() {
    localStorage.setItem("dsaCompleted", JSON.stringify(completed));
}

// ---------- RENDER CARDS ----------
function renderCards() {
    grid.innerHTML = "";

    const list =
        currentFilter === "All"
            ? roadmap
            : roadmap.filter((t) => t.level === currentFilter);

    list.forEach((topic) => {
        const isDone = completed.includes(topic.id);

        const card = document.createElement("div");
        card.className = "card" + (isDone ? " done" : "");

        card.innerHTML = `
      <div class="card-top">
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
        <span class="view">View details →</span>
      </div>
    `;

        // checkbox: toggle completion (don't open modal)
        const checkbox = card.querySelector("input");
        checkbox.addEventListener("click", (e) => e.stopPropagation());
        card.querySelector(".check").addEventListener("click", (e) => e.stopPropagation());
        checkbox.addEventListener("change", () => toggleDone(topic.id));

        // clicking the card opens the modal
        card.addEventListener("click", () => openModal(topic));

        grid.appendChild(card);
    });
}

// ---------- TOGGLE COMPLETE ----------
function toggleDone(id) {
    if (completed.includes(id)) {
        completed = completed.filter((x) => x !== id);
    } else {
        completed.push(id);
    }
    saveCompleted();
    renderCards();
    updateProgress();
}

// ---------- PROGRESS ----------
function updateProgress() {
    const total = roadmap.length;
    const done = completed.length;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);

    totalEl.textContent = total;
    doneEl.textContent = done;
    percentEl.textContent = pct + "%";
    fillEl.style.width = pct + "%";
}

// ---------- FILTERS ----------
filters.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter");
    if (!btn) return;

    document.querySelectorAll(".filter").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    currentFilter = btn.dataset.level;
    renderCards();
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
    if (e.target === modal) closeModal(); // click outside the box
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
});

// ---------- THEME TOGGLE ----------
if (localStorage.getItem("dsaTheme") === "light") {
    document.body.classList.add("light");
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
    const mode = document.body.classList.contains("light") ? "light" : "dark";
    localStorage.setItem("dsaTheme", mode);
});

// ---------- INIT ----------
renderCards();
updateProgress();