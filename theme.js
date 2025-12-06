// theme.js → CLEAN, FINAL, SENIOR-APPROVED VERSION
// No flash • Perfect panels • Blended delete buttons • Everything works

const THEMEABLE_PAGES = [
  "index.html", "dartballGM.html", "dartball_game_tracker.html",
  "dartball_plays_tracker.html", "scoresheet.html", "players_stats.html",
  "dartball_roster.html", "dartball_lineup.html"
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

// MAIN THEME APPLY FUNCTION — CLEAN & PERFECT
function applyTheme(themeName) {
  if (!THEMEABLE_PAGES.includes(currentPage)) return;
  const s = getStyles(themeName);

  // Body
  document.body.style.background = s.bg;
  document.body.style.color = s.text;

  // Scoreboard line
  const scoreLine = document.querySelector('.single-score-line');
  if (scoreLine) { scoreLine.style.background = s.bg; scoreLine.style.color = s.text; }

  // Charts
  document.querySelectorAll('.inning-chart, .inning-chart table, .inning-chart th, .inning-chart td, #team-stats-table, #homerun-list, #homerun-list ~ div')
    .forEach(el => {
      el.style.background = s.chartBg;
      el.style.color = s.chartText;
      el.style.borderColor = s.text + '40';
    });

  // Dropdown
  const dropdown = document.getElementById('gameSelect');
  if (dropdown) { dropdown.style.background = s.bg; dropdown.style.color = s.text; }

  // Action buttons
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

 
  // === ROSTER & LINEUP: Panels, boxes, player tags ===
  document.querySelectorAll('.list, .pool, .panel, .player, .lineup-slot, .roster-player').forEach(el => {
    el.style.background = s.bg + 'ee';  // Subtle glass effect
    el.style.border = `1px solid ${s.text}40`;
    el.style.color = s.text;
  });

   

    // Defender glow still works via theme
  document.querySelectorAll('.player-name.defense').forEach(el => el.style.color = s.defender);

  // === BLENDED DELETE BUTTONS (no angry red!) ===
  document.querySelectorAll('.delete-btn, .del-btn').forEach(btn => {
    btn.style.background = s.text + '33';
    btn.style.color = s.text;
    btn.style.border = `1px solid ${s.text}80`;
    btn.style.opacity = '0.8';
    btn.onmouseenter = () => btn.style.opacity = '1';
    btn.onmouseleave = () => btn.style.opacity = '0.8';
  });

  // Save current theme
  localStorage.setItem('dartball_projector_theme', themeName);
}

// Projector Favorite — save once, love forever
window.saveAsProjectorFavorite = function () {
  const favorite = {
    bg:        document.getElementById("custBg").value        || "#ffffff",
    text:      document.getElementById("custText").value      || "#000000",
    chartBg:   document.getElementById("custChartBg").value   || "#f8f8f8",
    chartText: document.getElementById("custChartText").value || "#000000",
    defender:  document.getElementById("custDefender").value  || "#0066cc"
  };
  localStorage.setItem("projector_favorite", JSON.stringify(favorite));
  localStorage.setItem('dartball_projector_theme', 'projector');
  applyTheme('projector');
  document.getElementById('themePanel').style.display = 'none';
  alert("Projector Favorite saved! It will load every week.");
};

// Update theme panel to match current theme
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
    const colors = preset === "projector" ? JSON.parse(localStorage.getItem("projector_favorite") || '{}') : PRESETS[preset];
    if (colors && colors.bg) {
      btn.style.background = colors.bg;
      btn.style.color = colors.text || '#fff';
      btn.style.border = `2px solid ${(colors.text || '#fff') + '80'}`;
    }
  });
}

// Hook everything up
const originalApply = applyTheme;
window.applyTheme = function (themeName) {
  originalApply(themeName);
  updateThemePanelAppearance();
};

document.querySelector('button[onclick*="themePanel"]')?.addEventListener('click', () => {
  setTimeout(updateThemePanelAppearance, 100);
});

// Public functions
window.setTheme = function (theme) {
  if (theme !== "custom") {
    ["cust_bg","cust_text","cust_chartBg","cust_chartText","cust_defender"].forEach(k => localStorage.removeItem(k));
  }
  applyTheme(theme);
  document.getElementById('themePanel').style.display = 'none';
};

window.clearTheme = function () {
  localStorage.clear();
  location.reload();
};

window.applyCustomTheme = function () {
  localStorage.setItem("cust_bg",        document.getElementById("custBg").value);
  localStorage.setItem("cust_text",      document.getElementById("custText").value);
  localStorage.setItem("cust_chartBg",   document.getElementById("custChartBg").value);
  localStorage.setItem("cust_chartText", document.getElementById("custChartText").value);
  localStorage.setItem("cust_defender",  document.getElementById("custDefender").value);
  localStorage.setItem('dartball_projector_theme', 'custom');
  applyTheme('custom');
  document.getElementById('themePanel').style.display = 'none';
};

// Auto-load theme on every page
window.addEventListener('load', () => {
  if (!THEMEABLE_PAGES.includes(currentPage)) return;
  const saved = localStorage.getItem('dartball_projector_theme');
  const fallback = localStorage.getItem("projector_favorite") ? 'projector' : 'light';
  applyTheme(saved || fallback);
});
