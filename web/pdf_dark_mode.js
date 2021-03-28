/**
 * START BLOCK: Constant Definitions
 */

/**
 * @type {String} localStorage key of dark mode setting.
 */
const STORAGE_KEY = "pdfjs.dark_mode";

/**
 * @type {String} dark mode style element id.
 */
const STYLE_ELEMENT_ID = "pdfjs-dark-mode-style";

/**
 * @type {String} Style sheet for implementing dark mode.
 */
const DARK_STYLE = `
  .thumbnailImage, .pdfViewer .page {
    filter: brightness(0.85) grayscale(0.15) invert(1.0) hue-rotate(0.5turn);
    border-image: none;
    box-shadow: none;
  }
`;

/**
 * @type {String} auto mode style sheet.
 */
const STYLE_ELEMENT_CONTENT_AUTO = `
 @media (prefers-color-scheme: dark) {${DARK_STYLE}}

 .toolbarButton.darkMode::before,
 .secondaryToolbarButton.darkMode::before {
   content: var(--toolbarButton-darkMode-auto-icon);
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
 * @type {String} dark mode style sheet.
 */
const STYLE_ELEMENT_CONTENT_DARK = `
  ${DARK_STYLE}

  .toolbarButton.darkMode::before,
  .secondaryToolbarButton.darkMode::before {
    content: var(--toolbarButton-darkMode-dark-icon);
    transform: rotate(-0.1turn);
  }
`;

/**
 * END BLOCK: Constant Definitions
 */

/**
 * @type {Object} modes supported.
 */
const MODES = Object.freeze({
  AUTO: "auto",
  LIGHT: "light",
  DARK: "dark",
});

/**
 * @type {Object} mode configurations.
 */
const MODE_CONFIGS = Object.freeze({
  auto: {
    style: STYLE_ELEMENT_CONTENT_AUTO,
    next: MODES.LIGHT,
  },
  light: {
    style: STYLE_ELEMENT_CONTENT_LIGHT,
    next: MODES.DARK,
  },
  dark: {
    style: STYLE_ELEMENT_CONTENT_DARK,
    next: MODES.AUTO,
  },
});

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
    const mode = localStorage.getItem(STORAGE_KEY) || MODES.AUTO;
    this.switchTo(mode);

    this.eventBus.on("darkmode", this.toggle.bind(this));
  }

  /**
   * Switch to next mode.
   */
  toggle() {
    const curr = localStorage.getItem(STORAGE_KEY) || MODES.DARK;
    this.switchTo(MODE_CONFIGS[curr].next);
  }

  /**
   * Switch to given mode.
   *
   * @param {String} mode mode to switch to, options listed in MODES.
   * @see MODES
   */
  switchTo(mode) {
    localStorage.setItem(STORAGE_KEY, mode);
    this.styleElement.textContent = MODE_CONFIGS[mode].style;
  }
}

export { PDFDarkMode };
