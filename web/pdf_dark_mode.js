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
 *
 * @property {String} AUTO auto mode.
 * @property {String} LIGHT light/original mode.
 * @property {String} DARK dark mode.
 */
const MODES = Object.freeze({
  AUTO: "auto",
  LIGHT: "light",
  DARK: "dark",
});

/**
 * @typedef {Object} ModeConfig mode config object.
 *
 * @property {String} style mode style sheet
 * @property {String} next next mode to switch to when toggle button clicked
 * @property {Number} l10nCode code used for localization, see WebL10n plural()
 * @property {String} l10nFallback localization text fallback
 */

/**
 * @type {Object} mode configurations.
 *
 * @property {ModeConfig} auto auto mode config
 * @property {ModeConfig} light light/original mode config
 * @property {ModeConfig} dark dark mode config
 */
const MODE_CONFIGS = Object.freeze({
  auto: {
    style: STYLE_ELEMENT_CONTENT_AUTO,
    next: MODES.LIGHT,
    l10nCode: 0,
    l10nFallback: "Auto(Follow OS Settings)",
  },
  light: {
    style: STYLE_ELEMENT_CONTENT_LIGHT,
    next: MODES.DARK,
    l10nCode: 1,
    l10nFallback: "Original",
  },
  dark: {
    style: STYLE_ELEMENT_CONTENT_DARK,
    next: MODES.AUTO,
    l10nCode: 2,
    l10nFallback: "Dark",
  },
});

/**
 * PDF dark mode manager.
 *
 * @property {HTMLButtonElement} button toggle button
 * @property {EventBus} eventBus event bus
 * @property {L10n} l10n localization tool
 * @property {HTMLStyleElement} styleElement dark mode style element
 */
class PDFDarkMode {
  /**
   * @param {HTMLButtonElement} button toggle button
   * @param {EventBus} eventBus event bus
   * @param {L10n} l10n localization tool
   */
  constructor(button, eventBus, l10n) {
    this.button = button;
    this.buttonAltText = button.children[0];
    this.eventBus = eventBus;
    this.l10n = l10n;

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
    // Save mode setting.
    localStorage.setItem(STORAGE_KEY, mode);

    // Update style.
    const config = MODE_CONFIGS[mode];
    this.styleElement.textContent = config.style;

    // Localize button tool tip and alt text.
    const buttonTitle = this.l10n.get(
      "dark_mode_title",
      { mode: config.l10nCode },
      config.l10nFallback
    );

    const buttonAltText = this.l10n.get(
      "dark_mode_label",
      { mode: config.l10nCode },
      config.l10nFallback
    );

    Promise.all([buttonTitle, buttonAltText]).then(messages => {
      this.button.title = messages[0];
      this.buttonAltText.textContent = messages[1];
    });
  }
}

export { PDFDarkMode };
