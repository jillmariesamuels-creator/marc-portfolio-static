
(function(){
  const categories = ["All","Classical Drawing","Portrait","Still Life","Figurative","Landscape","Abstract","Expressive"];
  const state = { tab: "Gallery", filter: "All", q: "", dark: false };

  // theme
  const saved = localStorage.getItem("theme");
  state.dark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", state.dark);
  document.querySelector("#themeToggle").textContent = state.dark ? "Light" : "Dark";

  // hero image
  const hero = document.querySelector("#heroImg");
  if (window.ARTWORKS && window.ARTWORKS.length) {
    hero.src = "images/" + window.ARTWORKS[0].file;
  }

  // filters
  const filterWrap = document.querySelector("#filters");
  categories.forEach(c => {
    const btn = document.createElement("button");
    btn.className = "filter" + (c===state.filter? " active":"");
    btn.textContent = c;
    btn.addEventListener("click", () => { state.filter = c; render(); });
    filterWrap.appendChild(btn);
  });

  // search
  const search = document.querySelector("#search");
  search.addEventListener("input", (e) => { state.q = e.target.value.toLowerCase(); render(); });

  // tabs
  document.querySelectorAll("[data-tab]").forEach(b => {
    b.addEventListener("click", () => {
      state.tab = b.getAttribute("data-tab"); updateTabs();
    });
  });

  // theme toggle
  document.querySelector("#themeToggle").addEventListener("click", () => {
    state.dark = !state.dark;
    document.documentElement.classList.toggle("dark", state.dark);
    localStorage.setItem("theme", state.dark ? "dark":"light");
    document.querySelector("#themeToggle").textContent = state.dark ? "Light" : "Dark";
  });

  function updateTabs(){
    document.querySelector("#tabGallery").classList.toggle("hidden", state.tab!=="Gallery");
    document.querySelector("#tabAbout").classList.toggle("hidden", state.tab!=="About");
    document.querySelector("#tabContact").classList.toggle("hidden", state.tab!=="Contact");
    document.querySelectorAll(".tabs button").forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-tab")===state.tab);
    });
  }

  function render(){
    // update filter buttons state
    [...filterWrap.children].forEach(b => {
      b.classList.toggle("active", b.textContent===state.filter);
    });

    // gallery
    const grid = document.querySelector("#grid");
    grid.innerHTML = "";
    const items = window.ARTWORKS.filter(a => {
      const matchesCat = state.filter === "All" || a.category === state.filter;
      const matchesQ = (a.title + a.medium + a.category).toLowerCase().includes(state.q);
      return matchesCat && matchesQ;
    });
    items.forEach(a => {
      const card = document.createElement("div"); card.className = "card";
      const img = document.createElement("img"); img.src = "images/" + a.file; img.alt = a.title;
      const meta = document.createElement("div"); meta.className = "meta";
      const t = document.createElement("div"); t.className = "title"; t.textContent = a.title;
      const s = document.createElement("div"); s.className = "sub"; s.textContent = a.medium;
      const b = document.createElement("div"); b.className = "badge"; b.textContent = a.category;
      meta.appendChild(t); meta.appendChild(s); meta.appendChild(b);
      card.appendChild(img); card.appendChild(meta);
      grid.appendChild(card);
    });
  }

  updateTabs();
  render();
})();

