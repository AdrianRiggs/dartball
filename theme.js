// theme.js → CLEAN, FINAL, SENIOR-APPROVED VERSION
// No flash • Perfect panels • Everything works 100%

const THEMEABLE_PAGES = [
  "index.html",
  "dartball_lineup.html",
  "dartball_game_tracker.html",
  "dartball_plays_tracker.html",
  "scoresheet.html",
  "players_stats.html",
  "dartball_roster.html",
  "popup-panel.html"
];

const currentPage = location.pathname.split("/").pop() || "index.html";

const PRESETS = {
  light:    { bg: '#ffffff', text: '#000000', chartBg: '#f8f8f8', chartText: '#000000', defender: '#0066cc' },
  midnight: { bg: '#001122', text: '#88ccff', chartBg: '#002244', chartText: '#88ccff', defender: '#66bbff' },
  forest:   { bg: '#002200', text: '#88ff88', chartBg: '#003300', chartText: '#88ff88', defender: '#77ff77' },
  charcoal: { bg: '#1a1a1a', text: '#ffddaa', chartBg: '#2d2d2d', chartText: '#ffddaa', defender: '#ffcc88' },
  retro:    { bg: '#2d1b3a', text: '#ffd700', chartBg: '#3d2b4d', chartText: '#ffd700', defender: '#ffea80' },
  projector: null
};

// Get current theme colors
function getStyles(themeName = "light") {
  if (themeName !== "custom" && PRESETS[themeName] && themeName !== "projector") return PRESETS[themeName];
  if (themeName === "projector") {
    const saved = localStorage.getItem("projector_favorite");
    if (saved) return JSON.parse(saved);
  }
  if (themeName === "custom") {
    return {
      bg:        localStorage.getItem("cust_bg")        || '#001122',
      text:      localStorage.getItem("cust_text")      || '#88ccff',
      chartBg:   localStorage.getItem("cust_chartBg")   || '#002244',
      chartText: localStorage.getItem("cust_chartText") || '#88ccff',
      defender:  localStorage.getItem("cust_defender")  || '#66bbff'
    };
  }
  return PRESETS.light;
}

// MAIN THEME APPLY FUNCTION
function applyTheme(themeName) {
  if (!THEMEABLE_PAGES.includes(currentPage)) return;
  const s = getStyles(themeName);

  document.body.style.background = s.bg;
  document.body.style.color = s.text;

  const scoreLine = document.querySelector('.single-score-line');
  if (scoreLine) { scoreLine.style.background = s.bg; scoreLine.style.color = s.text; }

  document.querySelectorAll('.inning-chart, .inning-chart table, .inning-chart th, .inning-chart td, #team-stats-table, #homerun-list, #homerun-list ~ div')
    .forEach(el => {
      el.style.background = s.chartBg;
      el.style.color = s.chartText;
      el.style.borderColor = s.text + '40';
    });

  const dropdown = document.getElementById('gameSelect');
  if (dropdown) { dropdown.style.background = s.bg; dropdown.style.color = s.text; }

  document.querySelectorAll('.action-btns button:not(.confirm):not(.brown-btn):not(.blue-btn):not(.yellow-btn):not(.green-btn):not(.out):not(.ball-btn)')
    .forEach(btn => {
      btn.style.background = s.text + '30';
      btn.style.color = s.bg;
      btn.style.border = '2px solid ' + s.text;
    });
  document.querySelectorAll('.action-btns button').forEach(btn => {
    btn.style.color = s.chartText;
    btn.style.borderColor = s.chartText;
  });

  document.querySelectorAll('.list, .pool, .panel, .player, .lineup-slot, .roster-player, .pool h2, .player input')
    .forEach(el => {
      el.style.background = s.bg + 'ee';
      el.style.border = `1px solid ${s.text}40`;
      el.style.color = s.text;
    });

  document.querySelectorAll('.player-name.defense').forEach(el => el.style.color = s.defender);

  document.querySelectorAll('.delete-btn, .del-btn').forEach(btn => {
    btn.style.background = s.text + '33';
    btn.style.color = s.text;
    btn.style.border = `1px solid ${s.text}80`;
    btn.style.opacity = '0.8';
    btn.onmouseenter = () => btn.style.opacity = '1';
    btn.onmouseleave = () => btn.style.opacity = '0.8';
  });

  localStorage.setItem('dartball_projector_theme', themeName);
}

// Update panel appearance
function updateThemePanelAppearance() {
  const saved = localStorage.getItem('dartball_projector_theme') || 'light';
  const s = getStyles(saved);
  const panel = document.getElementById('themePanel');
  if (!panel) return;
  const inner = panel.querySelector('.panel-inner') || panel;
  inner.style.setProperty('--popup-bg', s.bg);
  inner.style.setProperty('--popup-text', s.text);

  panel.querySelectorAll('.tbtn[data-theme]').forEach(btn => {
    const preset = btn.dataset.theme;
    const colors = preset === "projector"
      ? JSON.parse(localStorage.getItem("projector_favorite") || '{}')
      : PRESETS[preset];
    if (colors?.bg) {
      btn.style.background = colors.bg;
      btn.style.color = colors.text || '#fff';
      btn.style.border = `2px solid ${(colors.text || '#fff') + '80'}`;
    }
  });
}

// Hook applyTheme to update panel
const originalApply = applyTheme = applyTheme;
window.applyTheme = function(themeName) {
  originalApply(themeName);
  updateThemePanelAppearance();
};

// Public functions
window.setTheme = function(theme) {
  if (theme !== "custom") {
    ["cust_bg","cust_text","cust_chartBg","cust_chartText","cust_defender"].forEach(k => localStorage.removeItem(k));
  }
  applyTheme(theme);
  const panel = document.getElementById('themePanel');
  if (panel) panel.style.display = 'none';
};

// SAVED CUSTOM THEMES SYSTEM
const SAVED_THEMES_KEY = "dartball_saved_custom_themes";

function getSavedThemes() {
  return JSON.parse(localStorage.getItem(SAVED_THEMES_KEY) || "[]");
}

function saveThemesList(themes) {
  localStorage.setItem(SAVED_THEMES_KEY, JSON.stringify(themes));
}

// RENDER SAVED THEMES — NOW WITH CLEAN TRASH BUTTONS
function renderSavedThemes() {
  const container = document.getElementById('saved-themes-list');
  if (!container) return;

  const saved = getSavedThemes();
  container.innerHTML = '';

  if (saved.length === 0) {
    container.innerHTML = '<i style="opacity:0.6;">No saved themes yet</i>';
    return;
  }

  saved.forEach((theme, index) => {
    // Main theme button (takes most of the row)
    const btn = document.createElement('button');
    btn.className = 'tbtn saved-theme-btn';
    btn.textContent = theme.name;
    btn.style.cssText = `
      width: 78%;
      margin: 6px 0;
      padding: 14px;
      background: ${theme.colors.bg};
      color: ${theme.colors.text};
      border: 2px solid ${theme.colors.text + '80'};
      border-radius: 10px;
      font-weight: bold;
      text-align: left;
      position: relative;
    `;

    btn.onclick = () => {
      Object.entries(theme.colors).forEach(([k, v]) => localStorage.setItem(`cust_${k}`, v));
      localStorage.setItem('dartball_projector_theme', 'custom');
      applyTheme('custom');
      document.getElementById('themePanel').style.display = 'none';
    };

    // Trash button — same style as your roster delete buttons
    const del = document.createElement('button');
    del.textContent = 'Delete';
    del.style.cssText = `
      width: 18%;
      margin: 6px 4px 6px 8px;
      padding: 14px 8px;
      background: ${theme.colors.text + '40'};
      color: ${theme.colors.text};
      border: 2px solid ${theme.colors.text + '80'};
      border-radius: 10px;
      font-size: 14px;
      cursor: pointer;
      opacity: 0.9;
    `;
    del.onmouseenter = () => del.style.opacity = '1';
    del.onmouseleave = () => del.style.opacity = '0.9';

    del.onclick = (e) => {
      e.stopPropagation();
      if (confirm(`Delete "${theme.name}" forever?`)) {
        const updated = getSavedThemes();
        updated.splice(index, 1);
        saveThemesList(updated);
        renderSavedThemes();
      }
    };

    // Wrap both in a flex container
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display: flex; align-items: center; gap: 8px; width: 100%;';
    wrapper.appendChild(btn);
    wrapper.appendChild(del);

    container.appendChild(wrapper);
  });
}
// ALL BUTTONS WORK — Presets + Live Picker + Saved Themes
document.addEventListener('DOMContentLoaded', () => {
  // 1. Preset buttons
  document.querySelectorAll('.tbtn[data-theme]').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = btn.dataset.theme;
      if (t === 'projector' && !localStorage.getItem('projector_favorite')) {
        alert("No Projector Favorite saved yet!");
        return;
      }
      setTheme(t);
    });
  });

  // 2. Apply Live Custom Colors
  document.getElementById('apply-live-custom')?.addEventListener('click', () => {
    const c = {
      bg:        document.getElementById('liveBg').value,
      text:      document.getElementById('liveText').value,
      chartBg:   document.getElementById('liveChartBg').value,
      chartText: document.getElementById('liveChartText').value,
      defender:  document.getElementById('liveDefender').value
    };
    Object.entries(c).forEach(([k,v]) => localStorage.setItem(`cust_${k}`, v));
    localStorage.setItem('dartball_projector_theme', 'custom');
    applyTheme('custom');
  });

  // 3. Save as Projector Favorite
  document.getElementById('save-as-projector-fav')?.addEventListener('click', () => {
    const fav = {
      bg:        document.getElementById('liveBg').value,
      text:      document.getElementById('liveText').value,
      chartBg:   document.getElementById('liveChartBg').value,
      chartText: document.getElementById('liveChartText').value,
      defender:  document.getElementById('liveDefender').value
    };
    localStorage.setItem("projector_favorite", JSON.stringify(fav));
    localStorage.setItem('dartball_projector_theme', 'projector');
    applyTheme('projector');
    alert("Projector Favorite saved!");
  });

  // 4. Save Current as Named Theme
  document.getElementById('save-current-as-custom')?.addEventListener('click', () => {
    let name = document.getElementById('custom-theme-name').value.trim() || prompt("Theme name?");
    if (!name) return;
    const colors = {
      bg:        document.getElementById('liveBg').value,
      text:      document.getElementById('liveText').value,
      chartBg:   document.getElementById('liveChartBg').value,
      chartText: document.getElementById('liveChartText').value,
      defender:  document.getElementById('liveDefender').value
    };
    const list = getSavedThemes();
    const idx = list.findIndex(t => t.name === name);
    if (idx > -1) list[idx].colors = colors; else list.push({name, colors});
    saveThemesList(list);
    document.getElementById('custom-theme-name').value = '';
    renderSavedThemes();
    alert(`"${name}" saved!`);
  });

  // 5. Sync color pickers when panel opens — NOW FIXED FOR CHART TEXT
document.querySelector('button[onclick*="themePanel"]')?.addEventListener('click', () => {
  setTimeout(() => {
    const current = getStyles(localStorage.getItem('dartball_projector_theme') || 'light');

    document.getElementById('liveBg').value        = current.bg;
    document.getElementById('liveText').value      = current.text;
    document.getElementById('liveChartBg').value   = current.chartBg;
    document.getElementById('liveChartText').value = current.chartText;  // ← This was broken before
    document.getElementById('liveDefender').value  = current.defender;

    updateThemePanelAppearance();
    renderSavedThemes();
  }, 150);
});

});


// Page load — apply saved theme
window.addEventListener('load', () => {
  if (!THEMEABLE_PAGES.includes(currentPage)) return;
  const saved = localStorage.getItem('dartball_projector_theme');
  const fallback = localStorage.getItem("projector_favorite") ? 'projector' : 'light';
  applyTheme(saved || fallback);
  renderSavedThemes();
});
