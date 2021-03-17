/**
 * @type {String} localStorage key of dark mode setting.
 */
const STORAGE_KEY = "pdfjs.dark_mode";

/**
 * @type {String} dark mode style element id.
 */
const STYLE_ELEMENT_ID = "pdfjs-dark-mode-style";

/**
 * @type {String} dark mode style sheet.
 */
const STYLE_ELEMENT_CONTENT_DARK = `
.textLayer {
  background: black;
}

.toolbarButton.darkMode::before,
.secondaryToolbarButton.darkMode::before {
  content: var(--toolbarButton-darkMode-dark-icon);
  transform: rotate(-0.1turn);
}
`;

/**
 * @type {String} light mode style sheet.
 */
const STYLE_ELEMENT_CONTENT_LIGHT = `
.textLayer {
  background: white;
}

.toolbarButton.darkMode::before,
.secondaryToolbarButton.darkMode::before {
  content: var(--toolbarButton-darkMode-light-icon);
}
`;

/**
 * PDF dark mode manager.
 *
 * @property {HTMLButtonElement} button toggle button
 *
 * @property {EventBus} eventBus event bus
 */
class PDFDarkMode {
  /**
   * @param {HTMLButtonElement} button toggle button
   * @param {EventBus} eventBus event bus
   */
  constructor(button, eventBus) {
    this.button = button;
    this.eventBus = eventBus;

    // Create dark mode style element.
    this.styleElement = document.createElement("style");
    document.head.appendChild(this.styleElement);
    this.styleElement.id = STYLE_ELEMENT_ID;

    // Check dark mode option.
    const inDarkMode = localStorage.getItem(STORAGE_KEY) || "false";
    if (inDarkMode === "true") {
      this.enable();
    } else {
      this.disable();
    }

    this.eventBus.on("darkmode", this.toggle.bind(this));
  }

  toggle() {
    const inDarkMode = localStorage.getItem(STORAGE_KEY) || "false";
    if (inDarkMode === "false") {
      this.enable();
      localStorage.setItem(STORAGE_KEY, "true");
    } else {
      this.disable();
      localStorage.setItem(STORAGE_KEY, "false");
    }
  }

  enable() {
    this.styleElement.textContent = STYLE_ELEMENT_CONTENT_DARK;
  }

  disable() {
    this.styleElement.textContent = STYLE_ELEMENT_CONTENT_LIGHT;
  }
}

export { PDFDarkMode };
