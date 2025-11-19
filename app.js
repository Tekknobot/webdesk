(function () {
  const STORAGE_KEY = "webdesk_profile_v5";

  /**
   * A simple profile model. In a production app, this could be keyed by IP
   * or user account on the server side instead of just localStorage.
   */
  const defaultProfile = {
    theme: "system",
    accentHue: 210,
    baseFontSize: 16,
    wallpaperDataUrl: null,
    showIntro: true,
    panels: [
      {
        id: "panel-quick",
        title: "Daily launchpad",
        subtitle: "The stuff you open every day",
        width: 2,
        links: [
          { label: "Gmail", url: "https://mail.google.com" },
          { label: "Google Calendar", url: "https://calendar.google.com" },
          { label: "Google Drive", url: "https://drive.google.com" },
          { label: "Slack", url: "https://slack.com/signin" },
          { label: "Discord", url: "https://discord.com/app" },
          { label: "WhatsApp Web", url: "https://web.whatsapp.com" },
          { label: "Telegram Web", url: "https://web.telegram.org" },
        ],
      },
      {
        id: "panel-ai",
        title: "AI & research",
        subtitle: "Chat, generate, and explore ideas",
        width: 2,
        links: [
          { label: "ChatGPT", url: "https://chatgpt.com" },
          { label: "Claude", url: "https://claude.ai" },
          { label: "Perplexity", url: "https://www.perplexity.ai" },
          { label: "Gemini", url: "https://gemini.google.com" },
          { label: "Microsoft Copilot", url: "https://copilot.microsoft.com" },
          { label: "Poe", url: "https://poe.com" },
        ],
      },
      {
        id: "panel-social",
        title: "Social & creator",
        subtitle: "Feeds, followers, and broadcasts",
        width: 2,
        links: [
          { label: "YouTube", url: "https://youtube.com" },
          { label: "Twitter / X", url: "https://x.com" },
          { label: "Bluesky", url: "https://bsky.app" },
          { label: "Instagram", url: "https://www.instagram.com" },
          { label: "TikTok", url: "https://www.tiktok.com" },
          { label: "Facebook", url: "https://www.facebook.com" },
          { label: "LinkedIn", url: "https://www.linkedin.com" },
          { label: "Reddit", url: "https://www.reddit.com" },
          { label: "Twitch", url: "https://www.twitch.tv" },
          { label: "Mastodon", url: "https://mastodon.social" },
        ],
      },
      {
        id: "panel-focus",
        title: "Work & docs",
        subtitle: "Workspace, writing, and code",
        width: 2,
        links: [
          { label: "Notion", url: "https://www.notion.so" },
          { label: "Google Docs", url: "https://docs.google.com" },
          { label: "Google Sheets", url: "https://sheets.google.com" },
          { label: "Google Slides", url: "https://slides.google.com" },
          { label: "Figma", url: "https://www.figma.com" },
          { label: "GitHub", url: "https://github.com" },
          { label: "Stack Overflow", url: "https://stackoverflow.com" },
          { label: "Jira", url: "https://www.atlassian.com/software/jira" },
        ],
      },
      {
        id: "panel-media",
        title: "Music & streaming",
        subtitle: "Sound and screen time",
        width: 1,
        links: [
          { label: "Spotify Web", url: "https://open.spotify.com" },
          { label: "Apple Music", url: "https://music.apple.com" },
          { label: "YouTube Music", url: "https://music.youtube.com" },
          { label: "SoundCloud", url: "https://soundcloud.com" },
          { label: "Netflix", url: "https://www.netflix.com" },
          { label: "Prime Video", url: "https://www.primevideo.com" },
          { label: "Disney+", url: "https://www.disneyplus.com" },
        ],
      },
      {
        id: "panel-utilities",
        title: "Utilities & errands",
        subtitle: "Maps, shopping, and cloud files",
        width: 1,
        links: [
          { label: "Google Maps", url: "https://maps.google.com" },
          { label: "Google Photos", url: "https://photos.google.com" },
          { label: "Amazon", url: "https://www.amazon.com" },
          { label: "eBay", url: "https://www.ebay.com" },
          { label: "PayPal", url: "https://www.paypal.com" },
          { label: "Dropbox", url: "https://www.dropbox.com" },
        ],
      },
      {
        id: "panel-play",
        title: "Play & games",
        subtitle: "Quick breaks and brain food",
        width: 1,
        links: [
          { label: "Chess.com", url: "https://www.chess.com" },
          { label: "Lichess", url: "https://lichess.org" },
          { label: "NYT Games", url: "https://www.nytimes.com/crosswords" },
          { label: "Steam", url: "https://store.steampowered.com" },
        ],
      },
    ],
  };

  let profile = loadProfile();
  let editingPanelId = null;

  const panelGrid = document.getElementById("panel-grid");
  const addPanelBtn = document.getElementById("add-panel-btn");
  const openSettingsBtn = document.getElementById("open-settings-btn");

  const panelModalBackdrop = document.getElementById("panel-modal-backdrop");
  const panelModalTitle = document.getElementById("panel-modal-title");
  const panelTitleInput = document.getElementById("panel-title-input");
  const panelSubtitleInput = document.getElementById("panel-subtitle-input");
  const panelWidthInput = document.getElementById("panel-width-input");
  const linksContainer = document.getElementById("links-container");
  const addLinkRowBtn = document.getElementById("add-link-row-btn");
  const savePanelBtn = document.getElementById("save-panel-btn");
  const linkRowTemplate = document.getElementById("link-row-template");

  const settingsModalBackdrop = document.getElementById("settings-modal-backdrop");
  const accentRange = document.getElementById("accent-range");
  const fontSizeRange = document.getElementById("font-size-range");

  const wallpaperInput = document.getElementById("wallpaper-input");
  const clearWallpaperBtn = document.getElementById("clear-wallpaper-btn");

  const desktopHeader = document.getElementById("desktop-header");
  const desktopHeaderToggle = document.getElementById("desktop-header-toggle");


  // Load profile

  function loadProfile() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(defaultProfile);
      const parsed = JSON.parse(raw);
      return {
        ...structuredClone(defaultProfile),
        ...parsed,
        panels: parsed.panels || structuredClone(defaultProfile.panels),
      };
    } catch (e) {
      console.warn("Error loading profile; using defaults.", e);
      return structuredClone(defaultProfile);
    }
  }

  function saveProfile() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn("Unable to persist profile:", e);
    }
  }

  /* Theme + appearance */

  function applyAppearance() {
    const root = document.documentElement;
    const body = document.body;

    // Accent + typography
    root.style.setProperty("--accent-hue", profile.accentHue ?? 210);
    root.style.setProperty("--font-base-size", (profile.baseFontSize || 16) + "px");
    document.querySelectorAll(".panel, .subhead, .link-chip, .input, body").forEach((el) => {
      el.style.setProperty("font-size", "");
    });

    // Force dark theme
    body.setAttribute("data-theme", "dark");

    applyWallpaper();
  }

  function applyIntroVisibility() {
    if (!desktopHeader || !desktopHeaderToggle) return;

    const visible = profile.showIntro !== false; // default true
    desktopHeader.classList.toggle("collapsed", !visible);

    desktopHeaderToggle.textContent = visible
      ? "Hide overview ▲"
      : "Show overview ▼";
  }


  function applyWallpaper() {
    const body = document.body;

    if (profile.wallpaperDataUrl) {
      body.classList.add("has-wallpaper");

      // Set individual background-* properties so attachment stays fixed
      body.style.backgroundImage = `url("${profile.wallpaperDataUrl}")`;
      body.style.backgroundRepeat = "no-repeat";
      body.style.backgroundSize = "cover";
      body.style.backgroundPosition = "center center";
      body.style.backgroundAttachment = "fixed";
      body.style.backgroundColor = "#000"; // fallback behind image
    } else {
      body.classList.remove("has-wallpaper");

      // Clear inline styles so CSS default gradient comes back
      body.style.backgroundImage = "";
      body.style.backgroundRepeat = "";
      body.style.backgroundSize = "";
      body.style.backgroundPosition = "";
      body.style.backgroundAttachment = "";
      body.style.backgroundColor = "";
    }
  }

  /* Rendering */

  function faviconFor(url) {
    try {
      const { hostname } = new URL(url);
      return "https://www.google.com/s2/favicons?sz=64&domain=" + encodeURIComponent(hostname);
    } catch {
      return "";
    }
  }

  function renderPanels() {
    panelGrid.innerHTML = "";

    profile.panels.forEach((panel) => {
      const card = document.createElement("article");
      card.className = "panel";
      card.dataset.panelId = panel.id;
      card.style.gridColumn = `span ${Math.min(Math.max(panel.width || 1, 1), 2)}`;

      const header = document.createElement("div");
      header.className = "panel-header";

      const titleBlock = document.createElement("div");
      const h = document.createElement("h2");
      h.className = "panel-title";
      h.textContent = panel.title || "Untitled panel";
      titleBlock.appendChild(h);

      if (panel.subtitle) {
        const sub = document.createElement("p");
        sub.className = "panel-subtitle";
        sub.textContent = panel.subtitle;
        titleBlock.appendChild(sub);
      }

      const right = document.createElement("div");
      right.className = "panel-tools";

      const meta = document.createElement("div");
      meta.className = "panel-meta";
      const dot = document.createElement("span");
      dot.textContent = "●";
      dot.style.color = "var(--accent)";
      const count = document.createElement("span");
      count.textContent = `${panel.links?.length || 0} link${panel.links?.length === 1 ? "" : "s"}`;
      meta.append(dot, count);

      const editBtn = document.createElement("button");
      editBtn.className = "icon-btn";
      editBtn.title = "Edit panel";
      editBtn.textContent = "✎";
      editBtn.addEventListener("click", () => openPanelModal(panel.id));

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "icon-btn";
      deleteBtn.title = "Remove panel";
      deleteBtn.textContent = "✕";
      deleteBtn.addEventListener("click", () => removePanel(panel.id));

      right.append(meta, editBtn, deleteBtn);

      header.append(titleBlock, right);
      card.appendChild(header);

      const ul = document.createElement("ul");
      ul.className = "link-list";

      // NOTE: include idx here
      (panel.links || []).forEach((link, idx) => {
        if (!link || !link.url) return;

        const li = document.createElement("li");
        li.className = "link-item";
        li.draggable = true;
        li.dataset.panelId = panel.id;
        li.dataset.index = idx;

        const a = document.createElement("a");
        a.className = "link-chip";
        a.href = link.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";

        const img = document.createElement("img");
        img.className = "link-favicon";
        img.src = faviconFor(link.url);
        img.alt = "";

        const span = document.createElement("span");
        span.textContent = link.label || link.url;

        a.append(img, span);
        li.appendChild(a);
        ul.appendChild(li);
      });

      card.appendChild(ul);
      panelGrid.appendChild(card);
    });

    // Enable drag-and-drop AFTER everything is rendered
    enableDragAndDrop();
  }

  /* ---------------------------
    Drag + Drop (Reorder links)
  -------------------------------- */

  let dragState = {
    draggingEl: null,
    placeholder: null,
    startPanelId: null,
    startIndex: null,
    longPressTimer: null,
  };

  function enableDragAndDrop() {
    const items = document.querySelectorAll(".link-item");

    items.forEach(item => {
      item.addEventListener("dragstart", onDragStart);
      item.addEventListener("dragover", onDragOver);
      item.addEventListener("drop", onDrop);
      item.addEventListener("dragend", onDragEnd);

      // Mobile long-press to activate drag
      item.addEventListener("touchstart", onTouchStart);
      item.addEventListener("touchend", onTouchEnd);
    });
  }

  function onTouchStart(e) {
    dragState.longPressTimer = setTimeout(() => {
      e.target.dispatchEvent(new Event("dragstart", { bubbles: true }));
    }, 300); // long-press delay
  }

  function onTouchEnd() {
    clearTimeout(dragState.longPressTimer);
  }

  function onDragStart(e) {
    const li = e.target.closest(".link-item");
    if (!li) return;

    dragState.draggingEl = li;
    dragState.startPanelId = li.dataset.panelId;
    dragState.startIndex = Number(li.dataset.index);

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", "dragging");

    li.classList.add("dragging");
  }

  function onDragOver(e) {
    e.preventDefault();
    const li = e.target.closest(".link-item");
    if (!li || li === dragState.draggingEl) return;

    const rect = li.getBoundingClientRect();
    const halfway = rect.top + rect.height / 2;

    const parent = li.parentElement;

    if (!dragState.placeholder) {
      dragState.placeholder = document.createElement("li");
      dragState.placeholder.className = "link-item placeholder";
    }

    if (e.clientY < halfway) {
      parent.insertBefore(dragState.placeholder, li);
    } else {
      parent.insertBefore(dragState.placeholder, li.nextSibling);
    }
  }

  function onDrop(e) {
    e.preventDefault();

    const placeholder = dragState.placeholder;
    const dragging = dragState.draggingEl;
    if (!placeholder || !dragging) return;

    placeholder.replaceWith(dragging);
  }

  function onDragEnd() {
    const dragging = dragState.draggingEl;
    const placeholder = dragState.placeholder;

    if (placeholder) placeholder.remove();
    if (dragging) dragging.classList.remove("dragging");

    // Re-build link order
    if (dragging) saveNewOrder(dragging.dataset.panelId);

    dragState.draggingEl = null;
    dragState.placeholder = null;
  }

  function saveNewOrder(panelId) {
    const panel = profile.panels.find(p => p.id === panelId);
    if (!panel) return;

    const linkItems = [...document.querySelectorAll(`.link-item[data-panel-id="${panelId}"]`)];
    const newOrder = linkItems.map(li => {
      const idx = Number(li.dataset.index);
      return panel.links[idx];
    });

    panel.links = newOrder;
    saveProfile();
  }


  /* Panel modal */

  function openPanelModal(panelId) {
    editingPanelId = panelId || null;

    let panelData = null;
    if (panelId) {
      panelData = profile.panels.find((p) => p.id === panelId) || null;
    }

    if (panelData) {
      panelModalTitle.textContent = "Edit panel";
      panelTitleInput.value = panelData.title || "";
      panelSubtitleInput.value = panelData.subtitle || "";
      panelWidthInput.value = String(panelData.width || 1);
    } else {
      panelModalTitle.textContent = "New panel";
      panelTitleInput.value = "";
      panelSubtitleInput.value = "";
      panelWidthInput.value = "1";
    }

    linksContainer.innerHTML = "";

    const linksToRender = panelData?.links && panelData.links.length > 0 ? panelData.links : [{ label: "", url: "" }];

    linksToRender.forEach((link) => addLinkRow(link.label, link.url));

    panelModalBackdrop.classList.remove("hidden");
    panelTitleInput.focus();
  }

  function closePanelModal() {
    panelModalBackdrop.classList.add("hidden");
    editingPanelId = null;
  }

  function addLinkRow(label = "", url = "") {
    const fragment = linkRowTemplate.content.cloneNode(true);
    const row = fragment.querySelector(".link-row");
    const labelInput = fragment.querySelector(".link-label-input");
    const urlInput = fragment.querySelector(".link-url-input");
    const removeBtn = fragment.querySelector(".remove-link-row-btn");

    labelInput.value = label || "";
    urlInput.value = url || "";

    removeBtn.addEventListener("click", () => {
      row.remove();
    });

    linksContainer.appendChild(row);
  }

  function collectLinksFromEditor() {
    const rows = linksContainer.querySelectorAll(".link-row");
    const links = [];
    rows.forEach((row) => {
      const labelInput = row.querySelector(".link-label-input");
      const urlInput = row.querySelector(".link-url-input");
      const label = (labelInput.value || "").trim();
      const url = (urlInput.value || "").trim();
      if (!url) return;
      links.push({ label: label || url, url });
    });
    return links;
  }

  function savePanelFromModal() {
    const title = panelTitleInput.value.trim() || "Untitled panel";
    const subtitle = panelSubtitleInput.value.trim();
    const width = parseInt(panelWidthInput.value, 10) || 1;
    const links = collectLinksFromEditor();

    if (links.length === 0) {
      alert("Add at least one link to this panel.");
      return;
    }

    if (editingPanelId) {
      const idx = profile.panels.findIndex((p) => p.id === editingPanelId);
      if (idx >= 0) {
        profile.panels[idx] = {
          ...profile.panels[idx],
          title,
          subtitle,
          width: Math.min(Math.max(width, 1), 2),
          links,
        };
      }
    } else {
      const id = "panel-" + Math.random().toString(36).slice(2, 9);
      profile.panels.push({
        id,
        title,
        subtitle,
        width: Math.min(Math.max(width, 1), 2),
        links,
      });
    }

    saveProfile();
    renderPanels();
    closePanelModal();
  }

  function removePanel(panelId) {
    const panel = profile.panels.find((p) => p.id === panelId);
    if (!panel) return;
    const ok = confirm(`Remove the panel “${panel.title || "Untitled panel"}”?`);
    if (!ok) return;
    profile.panels = profile.panels.filter((p) => p.id !== panelId);
    saveProfile();
    renderPanels();
  }

  /* Settings modal */

  function openSettingsModal() {
    accentRange.value = profile.accentHue ?? 210;
    fontSizeRange.value = profile.baseFontSize || 16;
    settingsModalBackdrop.classList.remove("hidden");
  }

  function closeSettingsModal() {
    settingsModalBackdrop.classList.add("hidden");
  }

  /* Event wiring */

  addPanelBtn.addEventListener("click", () => openPanelModal(null));
  openSettingsBtn.addEventListener("click", openSettingsModal);

  savePanelBtn.addEventListener("click", savePanelFromModal);
  addLinkRowBtn.addEventListener("click", () => addLinkRow());

  panelModalBackdrop.addEventListener("click", (e) => {
    if (e.target === panelModalBackdrop) closePanelModal();
  });
  settingsModalBackdrop.addEventListener("click", (e) => {
    if (e.target === settingsModalBackdrop) closeSettingsModal();
  });

  document.querySelectorAll("[data-close-panel-modal]").forEach((btn) =>
    btn.addEventListener("click", closePanelModal),
  );
  document.querySelectorAll("[data-close-settings-modal]").forEach((btn) =>
    btn.addEventListener("click", closeSettingsModal),
  );

  accentRange.addEventListener("input", () => {
    profile.accentHue = parseInt(accentRange.value, 10) || 210;
    applyAppearance();
  });
  accentRange.addEventListener("change", () => {
    saveProfile();
  });

  fontSizeRange.addEventListener("input", () => {
    profile.baseFontSize = parseInt(fontSizeRange.value, 10) || 16;
    document.documentElement.style.setProperty(
      "--font-base-size",
      profile.baseFontSize + "px",
    );
    document.body.style.fontSize = profile.baseFontSize + "px";
  });
  fontSizeRange.addEventListener("change", () => {
    saveProfile();
  });

  // Wallpaper upload
  if (wallpaperInput) {
    wallpaperInput.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        // Basic size guard: avoid absurdly huge strings (rough heuristic)
        const dataUrl = String(reader.result || "");
        if (dataUrl.length > 5_000_000) {
          alert("That image is a bit large. Please choose a smaller file.");
          return;
        }

        profile.wallpaperDataUrl = dataUrl;
        saveProfile();
        applyWallpaper();
      };
      reader.readAsDataURL(file);
    });
  }

  if (clearWallpaperBtn) {
    clearWallpaperBtn.addEventListener("click", () => {
      profile.wallpaperDataUrl = null;
      saveProfile();
      applyWallpaper();
      if (wallpaperInput) {
        wallpaperInput.value = "";
      }
    });
  }

  applyAppearance();
  applyIntroVisibility();
  renderPanels();
})();
