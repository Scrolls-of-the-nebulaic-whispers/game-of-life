class Game {
  constructor() {
    this.zoomThrottleTimeoutID = null;
    this.zoomChangeIntervalID = null;
    this.dicreaseUIOpacityIntervalID = null;
    this.startHidingUITimeoutID = null;

    this.gridWidth;
    this.gridHeight;
    this.cellSize = 10;

    this.drawing = false;
    this.lastYOfBrush;
    this.lastXOfBrush;
    this.offsetX = 0;
    this.offsetY = 0;

    this.grid = new Grid();
    this.settings = new Settings();
    this.appearence = new Appearence();

    this.isColorPickerOpened = false;
    this.isMenuOpened = false;
    this.isHoveringOverUI = false;

    this.defineStuff();
    this.attachEventListeners();
    this.centerScreen();
    this.updatePickerColors();
  }

  defineStuff() {
    /** @constant {HTMLCanvasElement}  */
    this.canvas = document.getElementById("gridCanvas");
    this.ctx = this.canvas.getContext("2d");

    /** @constant {HTMLButtonElement}  */
    this.startStopButton = document.getElementById("startStop");

    /** @constant {HTMLButtonElement}  */
    this.speedToggleButton = document.getElementById("speedToggleButton");

    /** @constant {HTMLInputElement}  */
    this.speedSlider = document.getElementById("speedSlider");

    /** @constant {HTMLDivElement}  */
    this.speedMenu = document.getElementById("speedMenu");

    /** @constant {HTMLButtonElement}  */
    this.clearButton = document.getElementById("clearButton");

    /** @constant {HTMLButtonElement}  */
    this.randomizeButton = document.getElementById("randomize");

    /** @constant {HTMLButtonElement}  */
    this.historyToggleButton = document.getElementById("historyToggleButton");

    /** @constant {HTMLButtonElement} */
    this.prevButton = document.getElementById("prev");

    /** @constant {HTMLButtonElement} */
    this.nextButton = document.getElementById("next");

    /** @constant {HTMLButtonElement} */
    this.zoomInButton = document.getElementById("zoomin");

    /** @constant {HTMLButtonElement} */
    this.zoomOutButton = document.getElementById("zoomout");

    /** @constant {HTMLInputElement} */
    this.bgColorPicker = document.getElementById("bgColorPicker");

    /** @constant {HTMLInputElement} */
    this.primaryColorPicker = document.getElementById("primaryColorPicker");

    /** @constant {HTMLInputElement} */
    this.secondaryColorPicker = document.getElementById("secondaryColorPicker");

    /** @constant {HTMLInputElement} */
    this.accentColorPicker = document.getElementById("accentColorPicker");

    /** @constant {HTMLInputElement} */
    this.linesColorPicker = document.getElementById("linesColorPicker");

    /** @constant {HTMLButtonElement[]} */
    this.chooseColorButtons = document.querySelectorAll(".chooseColorButton");

    /** @constant {HTMLInputElement} */
    this.historySlider = document.getElementById("historySlider");

    /** @constant {HTMLInputElement} */
    this.randomAreaToggleButton = document.getElementById(
      "randomAreaToggleButton",
    );

    /** @constant {HTMLInputElement} */
    this.randomAreaSizeInput = document.getElementById("randomAreaSize");

    /** @constant {HTMLInputElement} */
    this.randomAreaMenu = document.getElementById("randomAreaMenu");

    /** @constant {HTMLInputElement} */
    this.randomisationLevelMenu = document.getElementById(
      "randomisationLevelMenu",
    );

    /** @constant {HTMLInputElement} */
    this.randomisationLevelSlider = document.getElementById(
      "randomisationLevelSlider",
    );

    /** @constant {HTMLButtonElement} */
    this.randomisationLevelToggleButton = document.getElementById(
      "randomisationLevelToggleButton",
    );

    /** @constant {HTMLButtonlement} */
    this.themeListToggleButton = document.getElementById(
      "themeListToggleButton",
    );

    /** @constant {HTMLUllement} */
    this.themeListMenu = document.getElementById("themeListMenu");

    /** @constant {HTMLDivlement} */
    this.saveThemeMenu = document.getElementById("saveThemeMenu");

    /** @constant {HTMLInputlement} */
    this.newThemeNameInput = document.getElementById("newThemeNameInput");

    /** @constant {HTMLButtonlement} */
    this.saveNewThemeButton = document.getElementById("saveNewThemeButton");

    /** @constant {HTMLButtonlement} */
    this.saveThemeToggleButton = document.getElementById(
      "saveThemeToggleButton",
    );

    /** @constant {HTMLButtonlement} */
    this.gridPatternToggleButton = document.getElementById(
      "gridPatternToggleButton",
    );

    /** @constant {HTMLUllement} */
    this.gridPatternMenu = document.getElementById("gridPatternMenu");

    /** @constant {HTMLDivlement} */
    this.historyMenu = document.getElementById("historyMenu");

    /** @constant {HTMLPlement} */
    this.population = document.getElementById("population");

    /** @constant {HTMLPlement} */
    this.generation = document.getElementById("generation");

    /** @constant {HTMLDivlement} */
    this.uiElements = document.getElementById("uiElements");
  }

  attachEventListeners() {
    document.addEventListener("mousemove", this.showUI, { passive: true });
    document.onmouseleave = this.handleDocumentMouseLeave;
    this.uiElements.onmouseenter = () => (this.isHoveringOverUI = true);
    this.uiElements.onmouseleave = () => (this.isHoveringOverUI = false);

    window.onresize = this.handleScreenResize;
    window.onclick = this.handleCloseAllMenusBesidesActive;
    this.canvas.onmousedown = this.handleStartDrawing;
    this.canvas.onmousemove = this.handleDraw;
    this.canvas.onmouseup = this.hadnleEndDrawing;
    this.canvas.onwheel = this.handleWheel;

    this.startStopButton.onclick = this.handleToggleSimulationPlayback;
    this.clearButton.onclick = this.handleClearBoard;
    this.randomizeButton.onclick = this.handleRandomize;

    this.prevButton.onclick = this.handleGoGenerationBack;
    this.nextButton.onclick = this.handleGoGenerationForward;

    this.zoomInButton.onmousedown = this.handleZoomInButtonClick;
    this.zoomInButton.onmouseleave = this.handleClearZoom;
    this.zoomInButton.onmouseup = this.handleClearZoom;
    this.zoomOutButton.onmousedown = this.handleZoomOutButtonClick;
    this.zoomOutButton.onmouseleave = this.handleClearZoom;
    this.zoomOutButton.onmouseup = this.handleClearZoom;

    this.historySlider.oninput = this.handleHistorySliderMove;
    this.randomAreaSizeInput.oninput = this.handleRandomAreaChange;
    this.randomisationLevelSlider.oninput = this.handleRandomisationLevel;

    this.speedSlider.oninput = this.handleChangeGameSpeed;

    this.chooseColorButtons.forEach(
      (btn) => (btn.onclick = () => (this.isColorPickerOpened = true)),
    );

    this.bgColorPicker.oninput = (e) => this.handleChangeColor(e, "background");
    this.primaryColorPicker.oninput = (e) =>
      this.handleChangeColor(e, "primary");
    this.secondaryColorPicker.oninput = (e) =>
      this.handleChangeColor(e, "secondary");
    this.accentColorPicker.oninput = (e) => this.handleChangeColor(e, "accent");
    this.linesColorPicker.oninput = (e) =>
      this.handleChangeColor(e, "gridLines");

    this.bgColorPicker.onblur = () => (this.isColorPickerOpened = false);
    this.primaryColorPicker.onblur = () => (this.isColorPickerOpened = false);
    this.secondaryColorPicker.onblur = () => (this.isColorPickerOpened = false);
    this.accentColorPicker.onblur = () => (this.isColorPickerOpened = false);
    this.linesColorPicker.onblur = () => (this.isColorPickerOpened = false);

    this.bgColorPicker.onchange = this.handleSaveThemeUpdates;
    this.primaryColorPicker.onchange = this.handleSaveThemeUpdates;
    this.secondaryColorPicker.onchange = this.handleSaveThemeUpdates;
    this.accentColorPicker.onchange = this.handleSaveThemeUpdates;
    this.linesColorPicker.onchange = this.handleSaveThemeUpdates;

    this.themeListToggleButton.onclick = this.hadleToggleThemeList;
    this.saveThemeToggleButton.onclick = this.handleToggleSaveTheme;

    this.newThemeNameInput.oninput = this.handleNewThemeNameInput;
    this.saveNewThemeButton.onclick = this.handleSaveNewTheme;

    this.speedToggleButton.onclick = this.handleToggleSpeed;
    this.randomAreaToggleButton.onclick = this.handleToggleRandomArea;
    this.randomisationLevelToggleButton.onclick =
      this.handleToggleRandomisationLevel;
    this.historyToggleButton.onclick = this.handleToggleHistory;
    this.gridPatternToggleButton.onclick = this.handleToggleGridPatterns;
  }

  hideUIElements = () => {
    if (
      this.isMenuOpened ||
      this.isHoveringOverUI ||
      this.isColorPickerOpened
    ) {
      return;
    }

    clearTimeout(this.startHidingUITimeoutID);

    let opacity = 1;

    this.dicreaseUIOpacityIntervalID = setInterval(() => {
      this.uiElements.style.opacity = `${opacity - 0.1}`;
      opacity = (opacity - 0.1).toFixed(1);

      if (opacity < 0.1) {
        clearInterval(this.dicreaseUIOpacityIntervalID);
      }
    }, 50);
  };

  showUI = () => {
    this.uiElements.style.opacity = "1";
    clearTimeout(this.dicreaseUIOpacityIntervalID);
    clearTimeout(this.startHidingUITimeoutID);

    this.startHidingUITimeoutID = setTimeout(this.hideUIElements, 2000);
  };

  handleDocumentMouseLeave = () => {
    this.hideUIElements();
  };

  createListItemElement = (textContent, onClick) => {
    const listItem = document.createElement("li");
    const button = document.createElement("button");

    button.textContent = textContent;
    button.onclick = onClick;
    button.id = textContent;
    button.classList.add("optionBtn");
    listItem.appendChild(button);

    return listItem;
  };

  fillPatternList = () => {
    const list = this.grid.getPatterns();
    this.gridPatternMenu.innerHTML = "";

    for (const theme of list) {
      this.gridPatternMenu.appendChild(
        this.createListItemElement(theme.name, () =>
          this.handleSelectPattern(theme.name),
        ),
      );
    }
  };

  fillThemeList = () => {
    const list = this.appearence.getThemeList();

    this.themeListMenu.innerHTML = "";

    for (const theme of list) {
      this.themeListMenu.appendChild(
        this.createListItemElement(theme.name, () =>
          this.handleSelectTheme(theme.name),
        ),
      );
    }
  };

  setPopulation = () => {
    this.population.innerHTML = `Population: ${this.grid.liveCells.size}`;
  };

  setGeneration = () => {
    this.generation.innerHTML = `Generation: ${this.grid.generation}`;
  };

  setStats = () => {
    this.setPopulation();
    this.setGeneration();
  };

  handleCloseAllMenusBesidesActive = (e) => {
    const triggerButton = e.target;

    const menus = {
      themeListMenu: this.hadleToggleThemeList,
      saveThemeMenu: this.handleToggleSaveTheme,
      gridPatternMenu: this.handleToggleGridPatterns,
      speedMenu: this.handleToggleSpeed,
      randomAreaMenu: this.handleToggleRandomArea,
      randomisationLevelMenu: this.handleToggleRandomisationLevel,
      historyMenu: this.handleToggleHistory,
    };

    let numberOfClosedMenus = 0;

    for (const menu in menus) {
      const isOpen = this[menu].getAttribute("opened") === "true";
      const parentElement = !this[menu].parentElement.id
        ? this[menu].parentElement.parentElement
        : this[menu].parentElement;

      if (!isOpen) numberOfClosedMenus++;

      const isActiveMenu = parentElement.contains(triggerButton);
      if (!isActiveMenu && isOpen) {
        menus[menu]();
        numberOfClosedMenus++;
      }
    }

    if (numberOfClosedMenus === Object.keys(menus).length) {
      this.isMenuOpened = false;
    }
  };

  closeMenu = (menuElement, onClose) => {
    menuElement.setAttribute("opened", "false");
    if (onClose) onClose();
  };

  openMenu = (menuElement, onOpen) => {
    menuElement.setAttribute("opened", "true");
    this.isMenuOpened = true;
    if (onOpen) onOpen();
  };

  toggleMenu = (menuElement, onClose, onOpen) => {
    menuElement.getAttribute("opened") === "true"
      ? this.closeMenu(menuElement, onClose)
      : this.openMenu(menuElement, onOpen);
  };

  hadleToggleThemeList = () => {
    const onOpen = () => this.fillThemeList();
    this.toggleMenu(this.themeListMenu, null, onOpen);
  };

  handleToggleSpeed = () => {
    const onOpen = () => {
      const speedExp = (1001 - this.settings.generationUpdateSpeedMS) / 333;
      this.speedSlider.value = Math.pow(10, speedExp);
    };

    this.toggleMenu(this.speedMenu, null, onOpen);
  };

  handleToggleRandomArea = () => {
    const onOpen = () => {
      this.randomAreaSizeInput.focus();
      this.randomAreaSizeInput.value = this.settings.randomAreaSize;
    };
    this.toggleMenu(this.randomAreaMenu, null, onOpen);
  };

  handleToggleRandomisationLevel = () => {
    const onOpen = () => {
      this.randomisationLevelSlider.value = this.settings.randomLevel * 100;
      this.randomisationLevelSlider.setAttribute("opened", "true");
    };
    this.toggleMenu(this.randomisationLevelMenu, null, onOpen);
  };

  handleToggleHistory = () => {
    this.toggleMenu(this.historyMenu);
  };

  handleToggleGridPatterns = () => {
    const onOpen = () => this.fillPatternList();
    this.toggleMenu(this.gridPatternMenu, null, onOpen);
  };

  handleChangeGameSpeed = (e) => {
    this.settings.changeGameSpeed(+e.target.value);

    if (this.settings.isPlaying) {
      this.startGame();
    }
  };

  handleRandomisationLevel = (e) => {
    this.settings.changeRandomisationLevel(+e.target.value);
    this.handleRandomize();
  };

  handleRandomAreaChange = (e) => {
    const updatedSize = this.settings.changeRandomAreaSize(+e.target.value);
    this.randomAreaSizeInput.value = updatedSize;

    if (!Number.isNaN(+e.data)) {
      this.handleRandomize();
    }
  };

  handleClearBoard = () => {
    if (this.settings.isPlaying) this.handleStopGame();

    this.centerScreen();
    this.grid.init();
  };

  handleStartDrawing = (e) => {
    this.isMenuOpened = false;
    this.isDrawing = true;
    this.lastXOfBrush = e.clientX;
    this.lastYOfBrush = e.clientY;

    this.handleDraw(e);
  };

  handleDraw = (e) => {
    if (!this.isDrawing) return;

    const meowX = Math.floor(this.lastXOfBrush / this.cellSize);
    const meowY = Math.floor(this.lastYOfBrush / this.cellSize);

    const x = Math.floor((e.clientX - this.offsetX) / this.cellSize);
    const y = Math.floor((e.clientY - this.offsetY) / this.cellSize);

    if (meowX === x && meowY === y) return;

    this.grid.setCell(x, y, !this.grid.getCell(x, y));
    this.grid.updateCurrentGeneration();

    this.lastXOfBrush = e.clientX - this.offsetX;
    this.lastYOfBrush = e.clientY - this.offsetY;
  };

  hadnleEndDrawing = () => {
    this.isDrawing = false;
    this.lastXOfBrush = undefined;
    this.lastYOfBrush = undefined;
  };

  handleHistorySliderMove = (e) => {
    if (!this.grid.history.length) return;

    if (this.settings.isPlaying) this.handleStopGame();
    this.grid.goToGeneration(e.target.value || 0);
  };

  updateHistorySliderValue = () => {
    this.historySlider.setAttribute("size", this.grid.history.length);
    this.historySlider.max = this.grid.history.length - 1;
    this.historySlider.value = this.grid.generation;
  };

  handleGoGenerationBack = () => {
    if (this.settings.isPlaying) this.handleStopGame();
    this.grid.goToPreviousGeneration();
    this.updateHistorySliderValue();
  };

  handleGoGenerationForward = () => {
    if (this.settings.isPlaying) this.handleStopGame();
    this.grid.goToNextGeneration();
    this.historySlider.disabled = false;
    this.updateHistorySliderValue();
  };

  startGame = () => {
    const onGenerationUpdate = this.settings.startGamePlayback();

    onGenerationUpdate(() => {
      this.grid.goToNextGeneration();
      this.updateHistorySliderValue();
    });
  };

  handleStartGame = () => {
    this.historySlider.disabled = false;
    this.startStopButton.innerHTML = "pause";
    this.startGame();
  };

  handleStopGame = () => {
    this.settings.stopGamePlayback();
    this.startStopButton.innerHTML = "start";
  };

  handleToggleSimulationPlayback = () => {
    !this.settings.isPlaying ? this.handleStartGame() : this.handleStopGame();
  };

  handleRandomize = () => {
    this.historySlider.disabled = true;
    this.handleStopGame();
    this.centerScreen();
    this.grid.init();
    this.grid.randomize(
      this.settings.randomLevel,
      this.settings.randomAreaSize,
    );
  };

  centerScreen = () => {
    this.offsetX = window.innerWidth / 2;
    this.offsetY = window.innerHeight / 2;
  };

  handleScreenResize = () => {
    // Save current styles
    const strokeStyle = this.ctx.strokeStyle;
    const fillStyle = this.ctx.fillStyle;

    this.gridWidth = window.innerWidth;
    this.gridHeight = window.innerHeight;
    this.canvas.width = this.gridWidth;
    this.canvas.height = this.gridHeight;
    this.cellSize = 10 * this.settings.zoomLevel;

    // Restore styles
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.fillStyle = fillStyle;
  };

  handleClearZoom = () => {
    clearTimeout(this.zoomThrottleTimeoutID);
    clearInterval(this.zoomChangeIntervalID);
  };

  handleZoomForButton = (shouldZoomIn) => {
    const zoomAction = () => {
      shouldZoomIn ? this.settings.zoomIn() : this.settings.zoomOut();

      if (!shouldZoomIn && !this.settings.allowZoomOut()) return;

      const zoomFactor = this.settings.getZoomFactor(shouldZoomIn);
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;

      this.offsetX = centerX - (centerX - this.offsetX) * zoomFactor;
      this.offsetY = centerY - (centerY - this.offsetY) * zoomFactor;

      this.handleScreenResize();
    };

    zoomAction();

    this.zoomThrottleTimeoutID = setTimeout(() => {
      this.zoomChangeIntervalID = setInterval(zoomAction, 20);
    }, 300);
  };

  handleZoomInButtonClick = () => this.handleZoomForButton(true);

  handleZoomOutButtonClick = () => this.handleZoomForButton(false);

  handleZoomForMouse = (e) => {
    const shouldZoomIn = e.deltaY <= 0;

    if (!shouldZoomIn && !this.settings.allowZoomOut()) return;

    shouldZoomIn ? this.settings.zoomIn() : this.settings.zoomOut();

    const zoomFactor = this.settings.getZoomFactor(shouldZoomIn);
    const mouseX = e.clientX - this.offsetX;
    const mouseY = e.clientY - this.offsetY;
    this.offsetX = e.clientX - mouseX * zoomFactor;
    this.offsetY = e.clientY - mouseY * zoomFactor;

    this.cellSize *= zoomFactor;
  };

  handlePan = (e) => {
    if (e.shiftKey) {
      this.offsetX += -e.deltaY || -e.deltaX;
    } else {
      this.offsetX += -e.deltaX;
      this.offsetY += -e.deltaY;
    }

    this.lastXOfBrush = e.clientX;
    this.lastYOfBrush = e.clientY;
  };

  handleWheel = (e) => {
    e.preventDefault();

    !e.shiftKey && (e.metaKey || e.ctrlKey)
      ? this.handleZoomForMouse(e)
      : this.handlePan(e);
  };

  updatePickerColors = () => {
    const { accent, background, gridLines, primary, secondary } =
      this.appearence.currentTheme.colors;

    this.bgColorPicker.value = background;
    this.primaryColorPicker.value = primary;
    this.secondaryColorPicker.value = secondary;
    this.accentColorPicker.value = accent;
    this.linesColorPicker.value = gridLines;
  };

  updateUIColors = () => {
    const { accent, background, gridLines, primary, secondary } =
      this.appearence.currentTheme.colors;

    this.ctx.strokeStyle = gridLines;
    this.ctx.fillStyle = primary;
    document.documentElement.style.setProperty("--background", background);
    document.documentElement.style.setProperty("--primary", primary);
    document.documentElement.style.setProperty("--secondary", secondary);
    document.documentElement.style.setProperty("--accent", accent);
    document.documentElement.style.setProperty("--gridLines", gridLines);
  };

  handleChangeColor = (e, colorType) => {
    this.appearence.updateCurrentThemeColor(colorType, e.target.value);
    this.updateUIColors();
  };

  handleSaveThemeUpdates = () => {
    this.isMenuOpened = false;
    this.appearence.saveInLocalStorage();
  };

  handleNewThemeNameInput = (e) => {
    this.appearence.setNewThemeName(e.target.value);
  };

  handleToggleSaveTheme = () => {
    const onOpen = () => this.newThemeNameInput.focus();
    const onClose = () => {
      this.appearence.newThemeName = "";
      this.newThemeNameInput.value = "";
    };

    this.toggleMenu(this.saveThemeMenu, onClose, onOpen);
  };

  handleSaveNewTheme = (e) => {
    e.preventDefault();
    this.appearence.saveNewTheme();
    this.handleToggleSaveTheme();
  };

  handleSelectTheme = (name) => {
    this.appearence.selectTheme(name);
    this.updatePickerColors();
    this.updateUIColors();
  };

  handleSelectPattern = (name) => {
    if (this.settings.isPlaying) this.handleStopGame();

    this.centerScreen();
    this.historySlider.disabled = true;

    this.grid.selectPattern(name);
  };

  updateBananums = () => {
    this.ctx.clearRect(0, 0, this.gridWidth, this.gridHeight);

    this.setStats();

    const visibleStartX = Math.floor(-this.offsetX / this.cellSize);
    const visibleStartY = Math.floor(-this.offsetY / this.cellSize);
    const visibleEndX =
      visibleStartX + Math.ceil(this.gridWidth / this.cellSize);
    const visibleEndY =
      visibleStartY + Math.ceil(this.gridHeight / this.cellSize);

    // Draw grid
    this.ctx.beginPath();

    for (let x = visibleStartX; x <= visibleEndX; x++) {
      const screenX = x * this.cellSize + this.offsetX;
      this.ctx.moveTo(screenX, 0);
      this.ctx.lineTo(screenX, this.gridHeight);
    }

    for (let y = visibleStartY; y <= visibleEndY; y++) {
      const screenY = y * this.cellSize + this.offsetY;
      this.ctx.moveTo(0, screenY);
      this.ctx.lineTo(this.gridWidth, screenY);
    }

    this.ctx.stroke();

    // Draw live cells
    for (const cell of this.grid.liveCells) {
      const [x, y] = cell.split(",").map(Number);
      if (
        x >= visibleStartX &&
        x <= visibleEndX &&
        y >= visibleStartY &&
        y <= visibleEndY
      ) {
        this.ctx.fillRect(
          x * this.cellSize + this.offsetX,
          y * this.cellSize + this.offsetY,
          this.cellSize,
          this.cellSize,
        );
      }
    }

    requestAnimationFrame(this.updateBananums);
  };

  start = () => {
    this.handleScreenResize();
    this.updateBananums();
    this.updateUIColors();
  };
}

const game = new Game();
game.start();
