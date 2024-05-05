export class ThemeService {
  private static darkMode = false;

  static {
    const isDarkMode = localStorage.getItem("dark-mode");
    if (isDarkMode) {
      this.darkMode = isDarkMode === "true";
    }
  }

  public static isDarkMode() {
    return this.darkMode;
  }

  public static setDarkMode(isDarkMode: boolean) {
    this.darkMode = isDarkMode;

    if (isDarkMode) {
      document.body.classList.add("theme-alternate");
      document.body.style.background = "#2c2c2c";
    } else {
      document.body.classList.remove("theme-alternate");
      document.body.style.background = "#fafafa";
    }

    localStorage.setItem("dark-mode", String(isDarkMode));
  }
}
