class Appearence {
  constructor() {
    this.themePresets = this.getThemeList();
    this.currentTheme = this.getCurrentTheme();
    this.newThemeName = "";
  }

  getCurrentTheme = () => {
    if (!localStorage.getItem("appearence")) {
      return structuredClone(cyberpunkTheme);
    }

    const appearence = JSON.parse(localStorage.getItem("appearence"));
    return appearence["currentTheme"] || structuredClone(cyberpunkTheme);
  };

  getThemeList = () => {
    if (!localStorage.getItem("appearence")) {
      return themes.sort((a, b) => a.name.localeCompare(b.name));
    }

    const appearence = JSON.parse(localStorage.getItem("appearence"));

    return (appearence["themePresets"] || themes).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  };

  updateCurrentThemeColor = (colorType, newColor) => {
    if (this.currentTheme.colors[colorType]) {
      this.currentTheme.colors[colorType] = newColor;
    }
  };

  setNewThemeName = (newName) => {
    this.newThemeName = newName;
  };

  selectTheme = (name) => {
    const themeList = this.getThemeList();
    const newTheme = themeList.find((theme) => theme.name === name);
    if (newTheme) {
      this.currentTheme = newTheme;
      this.saveInLocalStorage();
    }
  };

  saveNewTheme = () => {
    if (this.newThemeName) {
      this.themePresets.push({ ...this.currentTheme, name: this.newThemeName });
      this.saveInLocalStorage();
    }
  };

  saveInLocalStorage = () => {
    localStorage.setItem("appearence", JSON.stringify(this));
  };
}
