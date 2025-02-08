class Settings {
  constructor() {
    const {
      generationUpdateSpeedMS,
      randomLevel,
      randomAreaSize,
      zoomLevel,
      zoomDistanceUnit,
    } = JSON.parse(localStorage.getItem("settings") || "{}");

    this.generationUpdateSpeedMS = generationUpdateSpeedMS || 50;
    this.randomLevel = randomLevel || 0.3;
    this.randomAreaSize = randomAreaSize || 69;
    this.zoomLevel = zoomLevel || 1.3;
    this.zoomDistanceUnit = zoomDistanceUnit || 0.04;
    this.isPlaying = false;
    this.gameIntervalID = null;
  }

  changeGameSpeed = (newSpeed) => {
    const logValue = Math.log10(newSpeed) * 335;
    this.generationUpdateSpeedMS = 1001 - Math.min(logValue, 1000);
    this.saveInLocalStorage();
  };

  changeRandomisationLevel = (newRandomisationvalue) => {
    this.randomLevel = newRandomisationvalue / 100;
    this.saveInLocalStorage();
  };

  changeRandomAreaSize = (newSize) => {
    if (!Number.isNaN(newSize) && newSize.toString().length <= 3) {
      this.randomAreaSize = newSize;
      this.saveInLocalStorage();
    }

    return this.randomAreaSize;
  };

  startGamePlayback = () => {
    clearInterval(this.gameIntervalID);
    this.isPlaying = true;

    return (onNextGeneration) => {
      this.gameIntervalID = setInterval(
        onNextGeneration,
        this.generationUpdateSpeedMS,
      );
    };
  };

  stopGamePlayback = () => {
    this.isPlaying = false;
    clearInterval(this.gameIntervalID);
  };

  getZoomFactor = (isZoomIn) => {
    return isZoomIn ? 1 + this.zoomDistanceUnit : 1 - this.zoomDistanceUnit;
  };

  zoomIn = () => {
    this.zoomLevel *= 1 + this.zoomDistanceUnit;
    this.saveInLocalStorage();
  };

  allowZoomOut = () => this.zoomLevel >= 0.1;

  zoomOut = () => {
    if (!this.allowZoomOut()) return;
    this.zoomLevel *= 1 - this.zoomDistanceUnit;
    this.saveInLocalStorage();
  };

  saveInLocalStorage = () => {
    localStorage.setItem("settings", JSON.stringify(this));
  };
}
