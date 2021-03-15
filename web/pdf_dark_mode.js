/**
 * @property {HTMLButtonElement} button
 *
 * @property {EventBus} eventBus
 */
class PDFDarkMode {
  /**
   *
   * @param {HTMLButtonElement} button
   * @param {EventBus} eventBus
   */
  constructor(button, eventBus) {
    this.button = button;
    this.eventBus = eventBus;

    // Check dark mode option.
    const inDarkMode = localStorage.getItem("pdfjs.dark_mode") || "false";
    if (inDarkMode === "true") {
      const cssElement = document.createElement("style");
      cssElement.id = "pdfjs-darkmode-style";
      cssElement.textContent = ".textLayer { background: black; }";
      document.head.appendChild(cssElement);
    }

    this.eventBus.on("darkmode", this.toggle.bind(this));
  }

  toggle() {
    const inDarkMode = localStorage.getItem("pdfjs.dark_mode") || "false";
    if (inDarkMode === "false") {
      const cssElement = document.createElement("style");
      cssElement.id = "pdfjs-darkmode-style";
      cssElement.textContent = ".textLayer { background: black; }";
      document.head.appendChild(cssElement);
      localStorage.setItem("pdfjs.dark_mode", "true");
    } else {
      const cssElement = document.getElementById("pdfjs-darkmode-style");
      if (cssElement) {
        cssElement.remove();
      }
      localStorage.setItem("pdfjs.dark_mode", "false");
    }
  }

  enable() {}

  disable() {}
}

export { PDFDarkMode };
