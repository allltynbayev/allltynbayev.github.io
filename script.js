// Простое сохранение в localStorage с уникальным префиксом
const STORAGE_PREFIX = "vietnam-guide-v1:";

function save(key, value) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn("Не удалось сохранить данные", e);
  }
}

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

// Scroll-spy и навигация по табам (одна страница, весь контент прокручивается)
function setupTabs() {
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".tab-panel[data-section]");
  const main = document.querySelector(".tab-content");
  if (!panels.length || !main) return;

  // Клик по табу — скролл к секции
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const sectionId = tab.dataset.tab;
      tabs.forEach((t) => t.classList.toggle("active", t === tab));
      const panel = document.querySelector(`#tab-${sectionId}`);
      if (panel) {
        panel.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Scroll-spy: при прокрутке подсвечивать таб, чья секция наиболее видна
  const sectionRatios = new Map();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.dataset.section;
        if (id) sectionRatios.set(id, entry.intersectionRatio);
      });
      // Берём секцию с максимальной видимой долей
      let best = "overview";
      let maxRatio = 0;
      sectionRatios.forEach((ratio, id) => {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          best = id;
        }
      });
      tabs.forEach((t) => t.classList.toggle("active", t.dataset.tab === best));
    },
    { root: null, rootMargin: "-15% 0px -55% 0px", threshold: [0, 0.01, 0.1, 0.5, 1] }
  );

  panels.forEach((panel) => observer.observe(panel));

  // Установить активный таб по умолчанию
  tabs.forEach((t) => t.classList.toggle("active", t.dataset.tab === "overview"));
}

// Чеклисты (что нельзя, что взять)
function setupChecklists() {
  const lists = document.querySelectorAll(".checklist");

  lists.forEach((list) => {
    const listId = list.dataset.listId;
    if (!listId) return;

    const savedState = load(`checklist:${listId}`, {});

    const items = list.querySelectorAll(".checklist-item");

    items.forEach((item, index) => {
      const checkbox = item.querySelector('input[type="checkbox"]');
      if (!checkbox) return;

      const key = String(index);

      if (savedState[key]) {
        checkbox.checked = true;
        item.classList.add("completed");
      }

      checkbox.addEventListener("change", () => {
        const nextState = load(`checklist:${listId}`, {});
        nextState[key] = checkbox.checked;
        item.classList.toggle("completed", checkbox.checked);
        save(`checklist:${listId}`, nextState);
      });
    });
  });
}

// Места, заметки, статус "понравилось / не понравилось"
const DEFAULT_PLACES = [
  {
    id: "sample-1",
    name: "Пляж / набережная",
    description: "Прогулка вечером, закат и уличная еда.",
    category: "Развлекательное",
    visited: false,
    note: "",
    reaction: null,
  },
  {
    id: "sample-2",
    name: "Кафе с вьетнамским кофе",
    description: "Попробовать egg coffee и кокосовый кофе.",
    category: "Еда/Напитки",
    visited: false,
    note: "",
    reaction: null,
  },
  {
    id: "sample-3",
    name: "Храм или пагода",
    description: "Спокойная атмосфера, красивые виды.",
    category: "Культурное",
    visited: false,
    note: "",
    reaction: null,
  },
];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function renderPlaces() {
  const container = document.querySelector("#placesList");
  if (!container) return;

  const state = load("places", DEFAULT_PLACES);
  container.innerHTML = "";

  const groupsOrder = ["Культурное", "Развлекательное", "Еда/Напитки", "Другое"];
  const byCategory = {};

  state.forEach((place) => {
    const cat = place.category || "Другое";
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(place);
  });

  groupsOrder.forEach((cat) => {
    const items = byCategory[cat];
    if (!items || !items.length) return;

    const title = document.createElement("h3");
    title.className = "places-category-title";
    title.textContent = cat;
    container.appendChild(title);

    const list = document.createElement("ul");
    list.className = "places-list";
    container.appendChild(list);

    items.forEach((place) => {
      const li = document.createElement("li");
      li.className = "place-card";
      li.dataset.id = place.id;

      li.innerHTML = `
        <div class="place-main">
          <div class="place-title">
            <strong>${place.name}</strong>
            ${place.visited ? '<span class="place-badge">посетили</span>' : ""}
          </div>
          <div class="place-desc-row">
            <span class="place-category">${place.category || "Другое"}</span>
          </div>
          ${
            place.description
              ? `<div class="place-desc">${place.description}</div>`
              : ""
          }
          <input
            class="place-note-input"
            type="text"
            placeholder="Короткая заметка: понравилось / не понравилось"
            value="${place.note || ""}"
          />
        </div>
        <div class="place-status">
          <label class="place-checkbox">
            <input type="checkbox" class="pill-checkbox" ${
              place.visited ? "checked" : ""
            } />
            <span>Были здесь</span>
          </label>
          <div class="place-tags">
            <button type="button" class="place-tag place-tag-like${
              place.reaction === "like" ? " place-tag--liked" : ""
            }">Нравится</button>
            <button type="button" class="place-tag place-tag-dislike${
              place.reaction === "dislike" ? " place-tag--disliked" : ""
            }">Не очень</button>
            <button type="button" class="place-tag place-tag-delete" aria-label="Удалить место">🗑</button>
          </div>
        </div>
      `;

      const checkbox = li.querySelector(".pill-checkbox");
      const noteInput = li.querySelector(".place-note-input");
      const likeBtn = li.querySelector(".place-tag-like");
      const dislikeBtn = li.querySelector(".place-tag-dislike");
      const deleteBtn = li.querySelector(".place-tag-delete");

      checkbox.addEventListener("change", () => {
        const places = load("places", DEFAULT_PLACES);
        const current = places.find((p) => p.id === place.id);
        if (!current) return;
        current.visited = checkbox.checked;
        save("places", places);
        renderPlaces();
      });

      noteInput.addEventListener("input", () => {
        const places = load("places", DEFAULT_PLACES);
        const current = places.find((p) => p.id === place.id);
        if (!current) return;
        current.note = noteInput.value;
        save("places", places);
      });

      likeBtn.addEventListener("click", () => {
        const places = load("places", DEFAULT_PLACES);
        const current = places.find((p) => p.id === place.id);
        if (!current) return;
        current.reaction = current.reaction === "like" ? null : "like";
        save("places", places);
        renderPlaces();
      });

      dislikeBtn.addEventListener("click", () => {
        const places = load("places", DEFAULT_PLACES);
        const current = places.find((p) => p.id === place.id);
        if (!current) return;
        current.reaction = current.reaction === "dislike" ? null : "dislike";
        save("places", places);
        renderPlaces();
      });

      deleteBtn.addEventListener("click", () => {
        let places = load("places", DEFAULT_PLACES);
        places = places.filter((p) => p.id !== place.id);
        save("places", places);
        renderPlaces();
      });

      list.appendChild(li);
    });
  });
}

function setupPlaces() {
  if (!load("places", null)) {
    save("places", DEFAULT_PLACES);
  }

  renderPlaces();

  const form = document.querySelector("#placeForm");
  const nameInput = document.querySelector("#placeName");
  const descInput = document.querySelector("#placeDesc");
  const categorySelect = document.querySelector("#placeCategory");
  if (!form || !nameInput || !descInput || !categorySelect) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const description = descInput.value.trim();
    const category = categorySelect.value || "Другое";
    if (!name) return;

    const places = load("places", DEFAULT_PLACES);
    places.push({
      id: uid(),
      name,
      description,
       category,
      visited: false,
      note: "",
      reaction: null,
    });
    save("places", places);

    form.reset();
    renderPlaces();
  });
}

// Динамические списки вещей (что взять / без чего можно обойтись)
const DEFAULT_PACKING = {
  must: [
    "Паспорт (и другие документы)",
    "Лекарства (которые не сможем найти там)",
    "Зарядки",
    "Наушники",
    "Капибара",
    "Штатив (и прочее для контента)",
    "Instax (и картриджи к нему)",
    "Уходовая косметика (тк вода там плохая и могут быть высыпания)",
  ],
  optional: [
    "Много тёплой одежды",
    "Обуви хватит 1 пары кроссовок и кроксы",
    "Дайсон? (там должен быть фен в отеле)",
  ],
};

function renderPackingList(containerId, key) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const storageKey = `packing:${key}`;
  let items = load(storageKey, null);
  if (!items) {
    items = DEFAULT_PACKING[key].map((text) => ({
      id: uid(),
      text,
      checked: false,
    }));
    save(storageKey, items);
  }

  container.innerHTML = "";

  items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "checklist-item";
    li.dataset.id = item.id;

    li.innerHTML = `
      <label>
        <input type="checkbox" ${item.checked ? "checked" : ""} />
        <span class="checklist-text">${item.text}</span>
      </label>
      <button type="button" class="place-tag place-tag-delete packing-delete" aria-label="Удалить пункт">🗑</button>
    `;

    const checkbox = li.querySelector('input[type="checkbox"]');
    const deleteBtn = li.querySelector(".packing-delete");

    checkbox.addEventListener("change", () => {
      const current = load(storageKey, items);
      const found = current.find((it) => it.id === item.id);
      if (!found) return;
      found.checked = checkbox.checked;
      save(storageKey, current);
    });

    deleteBtn.addEventListener("click", () => {
      let current = load(storageKey, items);
      current = current.filter((it) => it.id !== item.id);
      save(storageKey, current);
      renderPackingList(containerId, key);
    });

    container.appendChild(li);
  });
}

function setupPackingLists() {
  renderPackingList("packingMustList", "must");
  renderPackingList("packingOptionalList", "optional");

  document.querySelectorAll(".packing-form").forEach((form) => {
    const type = form.dataset.packType;
    const input = form.querySelector(".packing-input");
    if (!type || !input) return;

    const storageKey = `packing:${type}`;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;

      const items = load(storageKey, []) || [];
      items.push({ id: uid(), text, checked: false });
      save(storageKey, items);
      input.value = "";
      renderPackingList(
        type === "must" ? "packingMustList" : "packingOptionalList",
        type
      );
    });
  });
}

// Заметки
function setupNotes() {
  const textarea = document.querySelector("#tripNotes");
  const status = document.querySelector("#notesStatus");
  const clearBtn = document.querySelector("#clearNotesBtn");
  if (!textarea || !status || !clearBtn) return;

  textarea.value = load("notes", "");

  let timeoutId = null;

  textarea.addEventListener("input", () => {
    if (timeoutId) clearTimeout(timeoutId);

    status.textContent = "Сохраняю...";

    timeoutId = setTimeout(() => {
      save("notes", textarea.value);
      status.textContent = "Сохранено ✅";
      setTimeout(() => {
        status.textContent = "Изменения сохраняются автоматически";
      }, 1500);
    }, 350);
  });

  clearBtn.addEventListener("click", () => {
    if (!textarea.value) return;
    if (!confirm("Точно очистить все заметки? Это действие нельзя отменить.")) return;
    textarea.value = "";
    save("notes", "");
    status.textContent = "Заметки очищены";
    setTimeout(() => {
      status.textContent = "Изменения сохраняются автоматически";
    }, 1500);
  });
}

// Кнопка-сердечко: показывает оверлей «я тебя люблю!» на 3 секунды
function setupLoveOverlay() {
  const btn = document.querySelector("#loveButton");
  const overlay = document.querySelector("#loveOverlay");
  if (!btn || !overlay) return;

  let timer = null;

  btn.addEventListener("click", () => {
    overlay.classList.add("visible");
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      overlay.classList.remove("visible");
    }, 3000);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  setupChecklists();
  setupPlaces();
  setupPackingLists();
  setupNotes();
  setupLoveOverlay();
});

