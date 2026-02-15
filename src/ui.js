export function createUI() {
  const panel = document.createElement('div');
  panel.id = 'ui-panel';
  panel.innerHTML = `
    <button id="panel-toggle">Settings</button>
    <div id="panel-body">
      <div class="ui-row">
        <label>Speed</label>
        <input type="range" id="speed-slider" min="0" max="100" value="4" step="1">
        <span id="speed-value">0.3x</span>
        <button id="pause-btn">Pause</button>
      </div>
      <div class="ui-row">
        <label>Scale</label>
        <input type="range" id="scale-slider" min="0" max="100" value="0" step="1">
        <span id="scale-value">Pretty</span>
      </div>
      <div class="ui-row">
        <button id="fullscreen-btn">Fullscreen</button>
      </div>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    #ui-panel {
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: rgba(8, 12, 30, 0.75);
      backdrop-filter: blur(8px);
      border-radius: 12px;
      color: white;
      font-family: system-ui, sans-serif;
      font-size: 13px;
      z-index: 100;
      border: 1px solid rgba(140,160,255,0.12);
    }
    #panel-toggle {
      background: none;
      border: none;
      color: white;
      padding: 10px 16px;
      cursor: pointer;
      font-size: 13px;
      font-family: system-ui, sans-serif;
      width: 100%;
      text-align: left;
      opacity: 0.8;
    }
    #panel-toggle:hover {
      opacity: 1;
    }
    #panel-body {
      overflow: hidden;
      max-height: 0;
      padding: 0 16px;
      transition: max-height 0.3s ease, padding 0.3s ease;
    }
    #ui-panel.expanded #panel-body {
      max-height: 200px;
      padding: 0 16px 14px;
    }
    .ui-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }
    .ui-row:last-child {
      margin-bottom: 0;
    }
    .ui-row label {
      width: 45px;
      flex-shrink: 0;
    }
    .ui-row input[type="range"] {
      flex: 1;
      accent-color: #ffcc33;
    }
    .ui-row span {
      width: 55px;
      text-align: right;
      font-variant-numeric: tabular-nums;
      flex-shrink: 0;
    }
    #pause-btn {
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.2);
      color: white;
      padding: 3px 10px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      flex-shrink: 0;
    }
    #pause-btn:hover, #fullscreen-btn:hover {
      background: rgba(255,255,255,0.25);
    }
    #fullscreen-btn {
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.2);
      color: white;
      padding: 5px 14px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      width: 100%;
    }
    #date-display {
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(8, 12, 30, 0.75);
      backdrop-filter: blur(8px);
      padding: 14px 20px;
      border-radius: 12px;
      color: white;
      font-family: system-ui, sans-serif;
      text-align: right;
      z-index: 100;
      border: 1px solid rgba(140,160,255,0.12);
    }
    #date-text {
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 0.02em;
    }
    #day-count {
      font-size: 12px;
      opacity: 0.6;
      margin-top: 3px;
      font-variant-numeric: tabular-nums;
    }
    #follow-indicator {
      position: fixed;
      top: 20px;
      left: 20px;
      background: rgba(8, 12, 30, 0.75);
      backdrop-filter: blur(8px);
      padding: 10px 16px;
      border-radius: 12px;
      color: white;
      font-family: system-ui, sans-serif;
      font-size: 14px;
      z-index: 100;
      border: 1px solid rgba(140,160,255,0.12);
      display: flex;
      align-items: center;
      gap: 12px;
    }
    #follow-name {
      font-weight: 600;
    }
    #follow-exit {
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.2);
      color: white;
      padding: 3px 10px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
    }
    #follow-exit:hover {
      background: rgba(255,255,255,0.25);
    }
    #info-panel {
      position: fixed;
      top: 50%;
      right: 20px;
      transform: translateY(-50%) translateX(calc(100% + 40px));
      background: rgba(8, 12, 30, 0.8);
      backdrop-filter: blur(12px);
      padding: 24px 24px 20px;
      border-radius: 14px;
      color: white;
      font-family: system-ui, sans-serif;
      z-index: 100;
      border: 1px solid rgba(140,160,255,0.15);
      width: 280px;
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    #info-panel.visible {
      transform: translateY(-50%) translateX(0);
    }
    #info-close {
      position: absolute;
      top: 10px;
      right: 12px;
      background: none;
      border: none;
      color: rgba(255,255,255,0.5);
      font-size: 20px;
      cursor: pointer;
      line-height: 1;
      padding: 2px 6px;
    }
    #info-close:hover {
      color: white;
    }
    #info-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 14px;
    }
    #info-header > div {
      flex: 1;
      min-width: 0;
      text-align: center;
    }
    #info-prev, #info-next {
      background: rgba(140,160,255,0.12);
      border: 1px solid rgba(255,255,255,0.15);
      color: white;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      line-height: 1;
      padding: 0;
    }
    #info-prev:hover, #info-next:hover {
      background: rgba(255,255,255,0.25);
    }
    #info-name {
      margin: 0 0 2px;
      font-size: 20px;
      font-weight: 700;
    }
    #info-type {
      font-size: 12px;
      opacity: 0.5;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    #info-stats {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 6px 12px;
      font-size: 12px;
      margin-bottom: 14px;
    }
    #info-stats .stat-label {
      opacity: 0.5;
      white-space: nowrap;
    }
    #info-stats .stat-value {
      font-variant-numeric: tabular-nums;
    }
    #info-fun {
      font-size: 12px;
      line-height: 1.5;
      margin: 0;
      padding-top: 12px;
      border-top: 1px solid rgba(140,160,255,0.12);
      opacity: 0.8;
    }
  `;

  // Date display — top right
  const dateDisplay = document.createElement('div');
  dateDisplay.id = 'date-display';
  dateDisplay.innerHTML = `
    <div id="date-text">Jan 1, Year 1</div>
    <div id="day-count">Day 1</div>
  `;
  document.body.appendChild(dateDisplay);

  // Follow indicator — top left
  const followIndicator = document.createElement('div');
  followIndicator.id = 'follow-indicator';
  followIndicator.innerHTML = `
    <span id="follow-name"></span>
    <button id="follow-exit">Exit</button>
  `;
  followIndicator.style.display = 'none';
  document.body.appendChild(followIndicator);

  // Info panel — right side
  const infoPanel = document.createElement('div');
  infoPanel.id = 'info-panel';
  infoPanel.innerHTML = `
    <button id="info-close">&times;</button>
    <div id="info-header">
      <button id="info-prev">&#8249;</button>
      <div>
        <h2 id="info-name"></h2>
        <div id="info-type"></div>
      </div>
      <button id="info-next">&#8250;</button>
    </div>
    <div id="info-stats"></div>
    <p id="info-fun"></p>
  `;
  document.body.appendChild(infoPanel);

  document.head.appendChild(style);
  document.body.appendChild(panel);

  const speedSlider = document.getElementById('speed-slider');
  const speedValue = document.getElementById('speed-value');
  const pauseBtn = document.getElementById('pause-btn');
  const scaleSlider = document.getElementById('scale-slider');
  const scaleValue = document.getElementById('scale-value');

  const dateText = document.getElementById('date-text');
  const dayCount = document.getElementById('day-count');

  const MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const followName = document.getElementById('follow-name');
  const followExitBtn = document.getElementById('follow-exit');

  const infoName = document.getElementById('info-name');
  const infoType = document.getElementById('info-type');
  const infoStats = document.getElementById('info-stats');
  const infoFun = document.getElementById('info-fun');
  const infoClose = document.getElementById('info-close');
  const infoPrev = document.getElementById('info-prev');
  const infoNext = document.getElementById('info-next');

  const state = {
    timeScale: 0.25,
    paused: false,
    scaleFactor: 0, // 0 = pretty, 1 = realistic
    totalEarthDays: 0,
    followTarget: null, // body being followed
    followTransition: 0, // 0-1 lerp progress
    _onExitFollow: null, // callback set by main.js
    _onNavigate: null, // callback set by main.js: (navEntry) => void
    _navList: [], // flat list set by main.js: [{name, facts, body, parentBody}]
    _navIndex: 0,
    follow(body) {
      this.followTarget = body;
      this.followTransition = 0;
      followName.textContent = `Following ${body.name}`;
      followIndicator.style.display = 'flex';
    },
    exitFollow() {
      this.followTarget = null;
      this.followTransition = 0;
      followIndicator.style.display = 'none';
      this.hideInfo();
      if (this._onExitFollow) this._onExitFollow();
    },
    showInfo(name, facts) {
      if (!facts) return;
      // Sync nav index to the body being shown
      const idx = this._navList.findIndex((e) => e.name === name);
      if (idx !== -1) this._navIndex = idx;
      infoName.textContent = name;
      infoType.textContent = facts.type || '';

      // Build stat rows from whichever fields exist
      const statFields = [
        ['Diameter', facts.diameter],
        ['From Sun', facts.distFromSun],
        ['From parent', facts.distFromParent],
        ['Orbit', facts.orbitalPeriod],
        ['Day length', facts.dayLength],
        ['Temperature', facts.temperature],
      ];
      infoStats.innerHTML = statFields
        .filter(([, v]) => v)
        .map(([label, value]) =>
          `<span class="stat-label">${label}</span><span class="stat-value">${value}</span>`
        )
        .join('');

      infoFun.textContent = facts.funFact || '';
      infoPanel.classList.add('visible');
    },
    hideInfo() {
      infoPanel.classList.remove('visible');
    },
    updateDate(earthAngleDelta) {
      // One full revolution (2*PI) of Earth = 365.25 days
      this.totalEarthDays += (earthAngleDelta / (Math.PI * 2)) * 365.25;

      const totalDays = Math.floor(this.totalEarthDays);
      const year = Math.floor(totalDays / 365.25) + 1;
      let dayInYear = totalDays % 365;

      let month = 0;
      while (month < 11 && dayInYear >= DAYS_IN_MONTH[month]) {
        dayInYear -= DAYS_IN_MONTH[month];
        month++;
      }
      const day = dayInYear + 1;

      dateText.textContent = `${MONTHS[month]} ${day}, Year ${year}`;
      dayCount.textContent = `Day ${totalDays + 1}`;
    },
  };

  speedSlider.addEventListener('input', () => {
    const raw = parseFloat(speedSlider.value);
    // Map 0-100 to 0-10x with exponential curve for fine control at low speeds
    state.timeScale = (raw / 10) ** 1.5;
    speedValue.textContent = state.timeScale < 0.01
      ? '0.0x'
      : state.timeScale.toFixed(1) + 'x';
    if (state.paused && raw > 0) {
      state.paused = false;
      pauseBtn.textContent = 'Pause';
    }
  });

  pauseBtn.addEventListener('click', () => {
    state.paused = !state.paused;
    pauseBtn.textContent = state.paused ? 'Play' : 'Pause';
  });

  const panelToggle = document.getElementById('panel-toggle');
  panelToggle.addEventListener('click', () => {
    const expanded = panel.classList.toggle('expanded');
    panelToggle.textContent = expanded ? 'Hide Settings' : 'Settings';
  });

  const fullscreenBtn = document.getElementById('fullscreen-btn');

  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });

  document.addEventListener('fullscreenchange', () => {
    fullscreenBtn.textContent = document.fullscreenElement ? 'Exit Fullscreen' : 'Fullscreen';
  });

  followExitBtn.addEventListener('click', () => {
    state.exitFollow();
  });

  infoClose.addEventListener('click', () => {
    state.hideInfo();
  });

  function navigateBy(offset) {
    if (state._navList.length === 0) return;
    state._navIndex = (state._navIndex + offset + state._navList.length) % state._navList.length;
    const entry = state._navList[state._navIndex];
    state.showInfo(entry.name, entry.facts);
    // Move camera to the new body's parent planet
    const followBody = entry.parentBody || entry.body;
    state.follow(followBody);
    if (state._onNavigate) state._onNavigate(entry);
  }

  infoPrev.addEventListener('click', () => navigateBy(-1));
  infoNext.addEventListener('click', () => navigateBy(1));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.followTarget) {
      state.exitFollow();
    }
  });

  scaleSlider.addEventListener('input', () => {
    state.scaleFactor = parseFloat(scaleSlider.value) / 100;
    if (state.scaleFactor < 0.01) {
      scaleValue.textContent = 'Pretty';
    } else if (state.scaleFactor > 0.99) {
      scaleValue.textContent = 'Real';
    } else {
      scaleValue.textContent = Math.round(state.scaleFactor * 100) + '%';
    }
  });

  return state;
}
