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
.thumbnailImage, .pdfViewer .page {
  filter: brightness(0.85) grayscale(0.15) invert(1.0) hue-rotate(0.5turn);
  border-image: none;
  box-shadow: none;
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
.toolbarButton.darkMode::before,
.secondaryToolbarButton.darkMode::before {
  content: var(--toolbarButton-darkMode-light-icon);
}
`;

/**
 * @type {String} auto mode style sheet.
 */
const STYLE_ELEMENT_CONTENT_AUTO = `
@media (prefers-color-scheme: dark) {
  .thumbnailImage, .pdfViewer .page {
    filter: brightness(0.85) grayscale(0.15) invert(1.0) hue-rotate(0.5turn);
    border-image: none;
    box-shadow: none;
  }
}

.toolbarButton.darkMode::before,
.secondaryToolbarButton.darkMode::before {
  content: var(--toolbarButton-darkMode-auto-icon);
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
    const darkModeOption = localStorage.getItem(STORAGE_KEY) || "auto";
    switch (darkModeOption) {
      case "dark":
        this.enable();
        break;
      case "light":
        this.disable();
        break;
      case "auto":
      default:
        this.auto();
        break;
    }

    this.eventBus.on("darkmode", this.toggle.bind(this));
  }

  toggle() {
    const darkModeOption = localStorage.getItem(STORAGE_KEY) || "auto";
    switch (darkModeOption) {
      case "auto":
        this.disable();
        localStorage.setItem(STORAGE_KEY, "light");
        break;
      case "light":
        this.enable();
        localStorage.setItem(STORAGE_KEY, "dark");
        break;
      case "dark":
      default:
        this.auto();
        localStorage.setItem(STORAGE_KEY, "auto");
        break;
    }
  }

  auto() {
    this.styleElement.textContent = STYLE_ELEMENT_CONTENT_AUTO;
  }

  enable() {
    this.styleElement.textContent = STYLE_ELEMENT_CONTENT_DARK;
  }

  disable() {
    this.styleElement.textContent = STYLE_ELEMENT_CONTENT_LIGHT;
  }
}

export { PDFDarkMode };
