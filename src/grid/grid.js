class Grid {
  constructor() {
    this.init();
  }

  init = () => {
    this.history = [];
    this.liveCells = new Set();
    this.generation = 0;
    this.maxHistorySize = 10000;
    this.patterns = this.getPatterns();
    this.newPatternName = "";
  };

  saveInLocalStorage = () => {
    const patterns = this.patterns.map((pattern) => {
      const liveCells = !Array.isArray(pattern.liveCells)
        ? Array.from(pattern.liveCells)
        : pattern.liveCells;

      return { name: pattern.name, liveCells };
    });

    const grid = { patterns };

    localStorage.setItem("grid", JSON.stringify(grid));
  };

  saveCurrentPattern = () => {
    if (!this.newPatternName) return;

    this.patterns.push({
      name: this.newPatternName,
      liveCells: Array.from(this.liveCells),
    });

    this.saveInLocalStorage();
  };

  selectPattern = (name) => {
    const patterns = this.getPatterns();
    const newPattern = patterns.find((pattern) => pattern.name === name);

    if (newPattern) {
      this.init();
      this.liveCells = Array.isArray(newPattern.liveCells)
        ? new Set(newPattern.liveCells)
        : newPattern.liveCells;

      this.history = [new Set(this.liveCells)];
    }
  };

  getPatterns = () => {
    if (!localStorage.getItem("grid")) {
      return gridPatterns.sort((a, b) => a.name.localeCompare(b.name));
    }

    const grid = JSON.parse(localStorage.getItem("grid"));

    return (grid["patterns"] || gridPatterns).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  };

  updatePatternList = () => {
    this.patterns = this.getPatterns();
  };

  setCell = (x, y, alive) => {
    const key = `${x},${y}`;
    alive ? this.liveCells.add(key) : this.liveCells.delete(key);
  };

  getCell = (x, y) => {
    return this.liveCells.has(`${x},${y}`);
  };

  updateCurrentGeneration = () => {
    this.history[this.generation] = this.liveCells;
  };

  goToGeneration = (generation) => {
    if (generation < 0 || !this.history.length) return;

    const gen = Math.min(generation, this.history.length - 1);
    this.generation = gen;
    this.liveCells = this.history[gen];
  };

  goToPreviousGeneration = () => {
    if (this.generation <= 0) return;
    this.goToGeneration(this.generation - 1);
  };

  goToNextGeneration = () => {
    const shouldGetCellsFromHistory = this.generation + 1 < this.history.length;

    if (shouldGetCellsFromHistory) {
      this.generation++;
      this.liveCells = this.history[this.generation];
      return;
    }

    if (this.history.length === 0) {
      this.history.push(this.liveCells);
    }

    this.generation++;
    const nextGen = this.calculateNextGeneration();
    this.liveCells = nextGen;

    if (this.history.length <= this.maxHistorySize) {
      this.history.push(nextGen);
    }
  };

  calculateNextGeneration = () => {
    const NEIGHBOR_OFFSETS = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    const cellNeighbors = new Map();

    for (const cellKey of this.liveCells) {
      const [x, y] = cellKey.split(",").map(Number);

      for (const [dx, dy] of NEIGHBOR_OFFSETS) {
        const neighborKey = `${x + dx},${y + dy}`;
        cellNeighbors.set(
          neighborKey,
          (cellNeighbors.get(neighborKey) || 0) + 1,
        );
      }
    }

    const nextGeneration = new Set();

    for (const [cellKey, neighborCount] of cellNeighbors.entries()) {
      const isCurrentlyAlive = this.liveCells.has(cellKey);

      if (neighborCount === 3 || (isCurrentlyAlive && neighborCount === 2)) {
        nextGeneration.add(cellKey);
      }
    }

    return nextGeneration;
  };

  randomize = (randomLevel, randomAreaSize) => {
    for (let x = -randomAreaSize; x < randomAreaSize; x++) {
      for (let y = -randomAreaSize; y < randomAreaSize; y++) {
        if (Math.random() < randomLevel) {
          this.setCell(x, y, true);
        }
      }
    }
    this.history = [new Set(this.liveCells)];
  };
}
