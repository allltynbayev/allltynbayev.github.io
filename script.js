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
    name: "Po Nagar",
    description: "Храмовый комплекс",
    category: "Культурное",
    visited: false,
    note: "",
    reaction: null,
  },
  {
    id: "sample-2",
    name: "Long Son Pagoda",
    description: "",
    category: "Культурное",
    visited: false,
    note: "",
    reaction: null,
  },
  {
    id: "sample-3",
    name: "Truc Lam Phung Thuy Son",
    description: "Будда",
    category: "Культурное",
    visited: false,
    note: "",
    reaction: null,
  },
  {
    id: "sample-4",
    name: "Mouintain Church",
    description: "",
    category: "Культурное",
    visited: false,
    note: "",
    reaction: null,
  },
  {
    id: "sample-5",
    name: "Vinwonders",
    description: "",
    category: "Развлекательное",
    visited: false,
    note: "",
    reaction: null,
  },
  {
    id: "sample-6",
    name: "I-Resort",
    description: "",
    category: "Развлекательное",
    visited: false,
    note: "",
    reaction: null,
  },
  {
    id: "sample-7",
    name: "Marina Beach club",
    description: "",
    category: "Развлекательное",
    visited: false,
    note: "",
    reaction: null,
  },
  {
    id: "sample-8",
    name: "Ba Ho",
    description: "Водопады",
    category: "Развлекательное",
    visited: false,
    note: "",
    reaction: null,
  },
  {
    id: "sample-9",
    name: "Fairy Forest",
    description: "Парк",
    category: "Развлекательное",
    visited: false,
    note: "",
    reaction: null,
  },
  {
    id: "sample-10",
    name: "Doc let Beach",
    description: "",
    category: "Развлекательное",
    visited: false,
    note: "",
    reaction: null,
  },
  {
    id: "sample-11",
    name: "Mitami Japanese Restaurant",
    description: "",
    category: "Еда/Напитки",
    visited: false,
    note: "",
    reaction: null,
  },
  {
    id: "sample-12",
    name: "Banh Mi Phan",
    description: "",
    category: "Еда/Напитки",
    visited: false,
    note: "",
    reaction: null,
  },
  {
    id: "sample-13",
    name: "HENRI Belgian Ice Cream & Waffles",
    description: "",
    category: "Еда/Напитки",
    visited: false,
    note: "",
    reaction: null,
  },
  {
    id: "sample-14",
    name: "Mr Mac",
    description: "",
    category: "Еда/Напитки",
    visited: false,
    note: "",
    reaction: null,
  },
  {
    id: "sample-15",
    name: "Vincom Plaza, 3rd floor",
    description: "ЧИПСЫ",
    category: "Еда/Напитки",
    visited: false,
    note: "",
    reaction: null,
  },
  {
    id: "sample-15",
    name: "Quan ca phe Duong Tau",
    description: "кофейня с поездом",
    category: "Еда/Напитки",
    visited: false,
    note: "",
    reaction: null,
  },
  {
    id: "sample-16",
    name: "Moony Bunny",
    description: "",
    category: "альпака",
    visited: false,
    note: "",
    reaction: null,
  },
  {
    id: "sample-17",
    name: "Capybara Coffee",
    description: "капибара",
    category: "Еда/Напитки",
    visited: false,
    note: "",
    reaction: null,
  },
  {
    id: "sample-18",
    name: "Maison Marou Cafe",
    description: "собственный шоколад",
    category: "Еда/Напитки",
    visited: false,
    note: "",
    reaction: null,
  },
  {
    id: "sample-19",
    name: "Cafe United Cabinet",
    description: "",
    category: "Еда/Напитки",
    visited: false,
    note: "",
    reaction: null,
  },
  {
    id: "sample-20",
    name: "Chakokoro",
    description: "миядзаки кофе",
    category: "Еда/Напитки",
    visited: false,
    note: "",
    reaction: null,
  },
  {
    id: "sample-21",
    name: "Koi Gardens",
    description: "вертолет",
    category: "Еда/Напитки",
    visited: false,
    note: "",
    reaction: null,
  },
  {
    id: "sample-22",
    name: "An Thoi",
    description: "мешлен",
    category: "Еда/Напитки",
    visited: false,
    note: "",
    reaction: null,
  },
  {
    id: "sample-23",
    name: "Veteran",
    description: "кореский ресторан",
    category: "Еда/Напитки",
    visited: false,
    note: "",
    reaction: null,
  },
  {
    id: "sample-24",
    name: "Pizza 4p",
    description: "",
    category: "Еда/Напитки",
    visited: false,
    note: "",
    reaction: null,
  },
  {
    id: "sample-25",
    name: "Cat coffee",
    description: "",
    category: "Еда/Напитки",
    visited: false,
    note: "",
    reaction: null,
  },
  {
    id: "sample-26",
    name: "dookki korean buffet",
    description: "",
    category: "Еда/Напитки",
    visited: false,
    note: "",
    reaction: null,
  },
  {
    id: "sample-27",
    name: "Mikado Sushi",
    description: "суши на конвеере",
    category: "Еда/Напитки",
    visited: false,
    note: "",
    reaction: null,
  },
  {
    id: "sample-28",
    name: "GoGi House",
    description: "",
    category: "корейский буфет",
    visited: false,
    note: "",
    reaction: null,
  },
  {
    id: "sample-29",
    name: "grill house",
    description: "корейское bbq",
    category: "Еда/Напитки",
    visited: false,
    note: "",
    reaction: null,
  },
  {
    id: "sample-30",
    name: "QooQoo Premium buffet",
    description: "",
    category: "Еда/Напитки",
    visited: false,
    note: "",
    reaction: null,
  },
  {
    id: "sample-31",
    name: "Shrek",
    description: "магазин сувениров и всякого",
    category: "Другое",
    visited: false,
    note: "",
    reaction: null,
  },
  {
    id: "sample-32",
    name: "Vega city",
    description: "",
    category: "Другое",
    visited: false,
    note: "",
    reaction: null,
  },
  {
    id: "sample-33",
    name: "Minh Ha Cosmetics",
    description: "",
    category: "Другое",
    visited: false,
    note: "",
    reaction: null,
  }


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

// Карточки с текстом (4 штуки) + модальное окно
const INFO_CARDS = {
  "vn-history": `Вьетнам — одна из древнейших стран мира с богатой самобытной материальной и духовной культурой, складывающейся на протяжении веков. Вся история этой страны характеризуется героической борьбой ее народа за свободу и независимость против иноземных завоевателей.

В основе истории Вьетнама лежит судьба двух народов, боровшихся друг с другом на всем пространстве от Хонгхи до Меконга.

История Вьетнама тямы
В южной части Вьетнама проживала народность тямов — австронезийский народ, пришедший с моря, испытавший влияние индийской цивилизации. Северную же часть занимали вьеты — австроазиатский народ, на который влияла китайская культура. Редкий житель европейской части нашей планеты вообще слышал о тямах, а в самом Вьетнаме о них напоминают лишь храмы империи о которых рассказывают экскурсоводы. Разделение страны на два больших народа прошло лишь тогда, когда предки современных вьетнамцев,  постепенно одолели соперников и в 1471 г. окончательно разрушив их столицу заселили оставшиеся территории. Остатком былой цивилизации тямов пришлось смириться с присутствием вьетов по всей стране.

История Вьетнама сестры чынг
Истоки вьетнамской цивилизации восходят к IV — первой половине III в. до н.э., когда на территории современного Северного Вьетнама существовал союз племен Ванланг, образованный лаквьетами — далекими предками нынешних вьетнамцев. В III в. до н, э. Ванланг получил название Аулак. Это было государство с весьма развитой самобытной цивилизацией. Оно неоднократно подвергалось вторжениям со стороны Китая. Во II в. до н.э. на территории современного Северного Вьетнама образовалось новое самостоятельное государство Намвьет. Несмотря на упорное сопротивление китайской агрессии, оно было в 111 г. до н.э. покорено захватчиками, которые стали проводить политику насильственной ассимиляции захваченных ими территорий. Вспыхнувшее в 40 г. н.э. народное восстание под предводительством сестер Чынг привело к победе вьетнамского народа. Несмотря на последовавшее вскоре жестокое подавление восстания, оно стало символом сопротивления для вьетнамцев. Китайское господство с перерывами длилось до X в. н.э. В 938 г. китайские феодалы потерпели жестокое поражение, и Вьетнам вновь обрел независимость.

История Вьетнама
XI—XIV вв. отмечены во Вьетнаме как период становления централизованного феодального государства, именовавшегося Дайвьет —Великий Вьет. И в этот период вьетнамскому государству неоднократно приходилось отражать нападения захватчиков с севера. В самом начале XV в. Дайвьет ненадолго утратил независимость. Однако благодаря широкому освободительному движению, развернувшемуся по всей стране, Вьетнам сумел в 1427 г. вернуть независимость.

В XVIII в. феодальный Вьетнам, находившийся в глубочайшем кризисе, потрясло крупнейшее за всю историю страны крестьянское восстание, известное как восстание тэйшонов (1771—1802), в ходе которого была свергнута власть враждующих феодальных домов — Нгуенов на юге и Чиней на севере, ликвидирована династия Ле и страна была объединена в единое государство. Самостоятельное развитие Вьетнама продолжалось до 1858 г., когда начался колониальный захват Вьетнама Францией. С конца XIX в. вплоть до окончания первой мировой войны французские колонизаторы постепенно превратили Вьетнам в аграрно-сырьевой придаток метрополии. Они захватывали вьетнамские земли, создавали плантационные хозяйства, развивали в первую очередь горнодобывающую промышленность, сооружали порты и дороги для вывоза колониального сырья.

В начале XX в. на исторической арене Вьетнама появляются две ведущие силы освободительной борьбы — рабочий класс и национальная буржуазия, боровшиеся между собой за руководство национально-освободительным. движением.

История Вьетнама
Огромное воздействие на дальнейшее развитие рабочего и освободительного движения во Вьетнаме сыграли идеи Великой Октябрьской социалистической революции и распространение марксистской литературы в стране. С созданием в 1925 г. Хо Ши Мином первой марксистской организации во Вьетнаме — Товарищества революционной молодежи Вьетнама — начинается новый этап во вьетнамском национально-освободительном движении.

В феврале 1930 г. во Вьетнаме создается Коммунистическая партия, возглавившая борьбу вьетнамского народа за независимость. Наиболее значительными в этой борьбе были три этапа. Первый — движение 1930— 1931 гг., высшей точкой которого было установление Советов в провинциях Нгеан и Хатинь. Второй этап — демократическое движение 1936— 1939 гг., основным содержанием которого явилась борьба вьетнамского народа за созыв Индокитайского конгресса и создание Демократического фронта Индокитая, выступившего против войны, за мир, демократические права и улучшение жизненного уровня народа. История Вьетнама война с францией
Третий этап — патриотическое движение 1940—1945 гг., характеризовавшееся широким размахом национально-освободительной борьбы в годы второй мировой войны, активной подготовкой к свержению власти колонизаторов и феодалов, созданием Национального единого фронта (Вьетминь) и национально-освободительной армии.

В августе 1945 г. в стране произошла Августовская революция, в результате которой была создана Демократическая Республика Вьетнам — первое в Юго-Восточной Азии народно-демократическое государство.

История Вьетнама война с США
С первых дней провозглашения независимости Демократической Республики Вьетнам вьетнамский народ был вынужден отражать агрессию сначала французских колонизаторов (1945—1954; первая война Сопротивления), а затем армии США (1965— 1975; вторая война Сопротивления). Многолетняя — свыше 30 лет, полная неимоверных трудностей и лишений героическая борьба вьетнамского народа за национальную независимость завершилась полной победой в апреле 1975 г., когда вьетнамский народ освободил Южный Вьетнам, добился воссоединения родины и создал в июле 1976 г. Социалистическую Республику Вьетнам.

Однако после воссоединения Вьетнама и образования СРВ вьетнамскому народу пришлось выдержать еще один удар — нападение китайской военщины в феврале 1979 г. Китайская военная авантюра полностью провалилась.

Сейчас Вьетнам становится страной новой мировой экономики, как называют его современники «Азиатский дракон», который в некоторых отраслях начинает конкурировать с серьезным мировым игроком Китаем.`
  ,
  "nhatrang-history": `Представьте, что мы начинаем нашу прогулку по солнечному Нячанг ранним утром: море спокойное, рыбацкие лодки возвращаются с уловом, а город только просыпается. Но за этим курортным спокойствием скрывается очень долгая и насыщенная история.

Ещё задолго до появления современного Вьетнама здесь существовало древнее государство Чампа. Чамы были искусными мореплавателями и торговцами, активно взаимодействовали с Индией, поэтому их культура пропитана индуистскими традициями. Самое яркое наследие той эпохи — это Башни По Нагар. Посмотрите на них: кирпичные башни стоят уже больше тысячи лет и посвящены богине По Нагар — покровительнице земли и плодородия. Даже сегодня сюда приходят местные жители, чтобы молиться и приносить подношения.

Теперь давайте мысленно перенесёмся в XVII век. В это время территория постепенно переходит под контроль вьетнамцев, и начинается новый этап. Чамская культура не исчезает полностью, но постепенно уступает место вьетнамским традициям, языку и укладу жизни. Нячанг в те времена — это скорее тихое прибрежное поселение, чем город.

Переломный момент наступает в XIX веке, когда Вьетнам становится частью Французского Индокитая. Французы быстро замечают мягкий климат и красивое побережье Нячанга и начинают развивать его как курорт. Здесь появляются виллы, дороги, первые гостиницы. В начале XX века в городе даже открывается Институт океанографии Нячанга — один из старейших научных центров в регионе, где изучают морскую флору и фауну. Это говорит о том, что Нячанг уже тогда считался важным и перспективным местом.

А теперь представьте 1960-е годы. В стране идёт Вьетнамская война. Нячанг превращается в стратегическую точку: здесь размещаются военные базы, аэродромы, иностранные войска. Город живёт в напряжении, и туристическая жизнь практически замирает.

После окончания войны в 1975 году Нячанг начинает медленно восстанавливаться. Сначала это спокойный провинциальный город, но уже с 1990-х годов начинается активное развитие туризма. Строятся новые отели, рестораны, дороги, и Нячанг постепенно превращается в один из самых популярных курортов Вьетнама.

Сегодня, гуляя по набережной, вы можете увидеть удивительное сочетание эпох: древние храмы Чампы, колониальные здания французского периода и современные отели. А если подняться на смотровую площадку или просто остановиться у моря, становится ясно — Нячанг не просто курорт. Это место, где каждая волна словно приносит с собой отголоски прошлых веков.`
  ,
  "facts": `1. Алфавит — «молодой», а язык древний
Современная письменность Вьетнама (латиница с диакритикой) появилась благодаря европейским миссионерам, особенно Александр де Род, в XVII веке. Но массово её начали использовать только в XX веке — до этого писали китайскими иероглифами.

2. Фамилия «Нгуен» — не совпадение
Около 40% населения носит фамилию Нгуен. Это связано с историей смены династий: люди часто меняли фамилии, чтобы избежать преследований или показать лояльность новой власти.

3. Кофе — не просто напиток, а культ
Вьетнам — второй в мире экспортёр кофе после Бразилии. Но интереснее другое: здесь пьют кофе с яйцом (яичный крем сверху), солью и даже сыром. «Яичный кофе» появился в Ханой из-за нехватки молока в прошлом.

4. Уличная еда — это почти домашняя кухня
Во Вьетнаме многие семьи не готовят дома регулярно — дешевле и проще есть на улице. Поэтому уличная еда здесь не «фастфуд», а полноценная традиционная кухня, часто приготовленная по семейным рецептам.

5. Байки важнее автомобилей
В стране зарегистрированы десятки миллионов мотоциклов. В крупных городах вроде Хошимин поток байков настолько плотный, что переход дороги — это навык: нужно идти медленно и предсказуемо, а не бежать.

6. Школьники учатся очень рано вставать
Занятия в школах часто начинаются уже в 7:00 утра, а иногда и раньше. Это связано с жарким климатом — днём учиться сложнее.

7. Вьетнам — одна из самых «узких» стран мира
В центральной части расстояние от моря до границы с Лаосом местами составляет всего около 50 км. Из-за этого климат и культура могут сильно меняться даже на небольшом расстоянии.

8. Праздник Тет — важнее Нового года
Главный праздник — Тет. В это время города буквально «вымирают»: все уезжают к семьям, а бизнес закрывается на несколько дней.

9. Вьетнамцы не любят число 4
Как и в Китае, число 4 ассоциируется со смертью из-за схожего звучания. Поэтому в некоторых зданиях можно не встретить 4-й этаж.

10. В стране есть «подземные города»
Во время Вьетнамская война были построены огромные сети туннелей, например Туннели Ку Чи. Там были кухни, больницы и даже школы — люди жили под землёй месяцами.

11. Вьетнам — мировой лидер по кешью и перцу
Многие специи и орехи, которые вы покупаете в магазине, скорее всего, родом именно отсюда — но об этом редко задумываются.

12. Люди улыбаются… когда неловко
Во вьетнамской культуре улыбка не всегда означает радость — иногда это способ скрыть смущение, несогласие или даже извиниться без слов.`
  ,
  "culture": `# 🇻🇳 Культура Вьетнама

Культура Вьетнама — это сочетание древних традиций, философии Востока и практичной повседневной жизни. Здесь прошлое и настоящее тесно переплетены, и это чувствуется буквально во всём.

---

## 🏮 Основа культуры: уважение и иерархия

В основе лежит Конфуцианство — философия, которая формирует поведение людей.

**Главные принципы:**
- уважение к старшим  
- почтение к родителям  
- соблюдение социальной иерархии  

Даже язык отражает это: форма обращения зависит от возраста и статуса собеседника.

---

## 🏠 Семья и культ предков

Семья — главный центр жизни.

Практически в каждом доме есть:
- алтарь предков  
- фотографии умерших родственников  
- благовония и подношения  

Считается, что предки продолжают влиять на жизнь семьи.

---

## 🎉 Праздник Тет (вьетнамский Новый год)

Это самый важный праздник в стране.

В это время:
- люди возвращаются в родные дома  
- готовят традиционные блюда  
- посещают могилы предков  
- проводят время с семьёй  

Города на несколько дней практически замирают.

---

## 🍜 Еда как часть культуры

Еда — это не просто приём пищи, а социальный ритуал.

**Особенности:**
- блюда ставятся в центр стола  
- все делятся едой  
- важно уважать старших (начинать есть после них)

Пример традиционного блюда:
- фо — национальный суп, который едят каждый день

---

## 🛵 Практичность и образ жизни

Вьетнамцы очень гибкие и адаптивные.

Вы легко можете увидеть:
- кафе прямо на тротуаре  
- дома, которые одновременно являются магазинами  
- улицы, где жизнь кипит 24/7  

Это не хаос, а эффективный способ жизни.

---

## 🧘 Религия и духовность

Во Вьетнаме нет одной основной религии.

Это смесь:
- буддизма  
- даосизма  
- народных верований  

Люди могут одновременно:
- ходить в пагоду  
- верить в духов  
- соблюдать семейные ритуалы  

---

## 🎭 Искусство и традиции

Традиционная культура включает:
- водный кукольный театр  
- каллиграфию  
- народную музыку  

**Символы:**
- 🐉 дракон — сила  
- 🐢 черепаха — долголетие  
- 🌸 лотос — чистота  

---

## 😊 Поведение и «сохранение лица»

Очень важно не поставить человека в неловкое положение.

Поэтому:
- избегают прямых отказов  
- не спорят публично  
- часто говорят «да», даже если это «возможно»  

---

## 👗 Традиционная одежда

Аозай — национальный костюм Вьетнама.

**Особенности:**
- длинное приталенное платье  
- разрезы по бокам  
- символ элегантности и культуры  

---

## 📌 Итог

Культура Вьетнама — это баланс:
- уважение к прошлому  
- сильные семейные ценности  
- умение адаптироваться к жизни  

Это страна, которую важно не только увидеть, но и почувствовать.`
};

function setupInfoModal() {
  const modalOverlay = document.querySelector("#infoModal");
  const modalTitle = document.querySelector("#infoModalTitle");
  const modalBody = document.querySelector("#infoModalBody");
  const closeBtn = document.querySelector("#infoModalClose");
  const cards = document.querySelectorAll(".info-card[data-info]");

  if (!modalOverlay || !modalTitle || !modalBody || !closeBtn || !cards.length) return;

  function openCard(key, cardEl) {
    const text = INFO_CARDS[key];
    if (!text) return;
    modalTitle.textContent = (cardEl ? cardEl.textContent : "").trim() || "Информация";
    modalBody.textContent = text;
    modalOverlay.setAttribute("aria-hidden", "false");
    modalOverlay.classList.add("visible");
  }

  function close() {
    modalOverlay.setAttribute("aria-hidden", "true");
    modalOverlay.classList.remove("visible");
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => openCard(card.dataset.info, card));
  });

  closeBtn.addEventListener("click", close);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  setupChecklists();
  setupPlaces();
  setupPackingLists();
  setupNotes();
  setupLoveOverlay();
  setupInfoModal();
});

