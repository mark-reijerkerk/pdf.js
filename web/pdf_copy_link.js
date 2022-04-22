/**
 * Copy PDF file link to clipboard.
 */
class PDFCopyLink {
  /**
   * @param {HTMLButtonElement} button toggle button
   * @param {EventBus} eventBus event bus
   * @param {L10n} l10n localization tool
   */
  constructor(button, eventBus, l10n) {
    this.button = button;
    this.eventBus = eventBus;
    this.l10n = l10n;
    this.eventBus.on("copylink", this.copyLink.bind(this));
  }

  /**
   * If the browser does not support navigator.clipboard.writeText,
   * we fallback to this way.
   *
   * @param {String} fileLink PDF file link
   */
  fallbacKCopy(fileLink) {
    const textArea = document.createElement("textarea");
    textArea.value = fileLink;

    // Avoid scrolling to bottom
    textArea.style.cssText = "top: 0px; left: 0px; position: fixed;";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      if (!document.execCommand("copy")) {
        throw new Error("execute copy command failed");
      }
    } catch (err) {
      console.error(`Failed to copy PDF file link "${fileLink}": ${err}`);
    }

    textArea.remove();
  }

  /**
   * Parse and copy the file link.
   *
   * @returns {void} nothing
   */
  copyLink() {
    let fileLink = "";

    try {
      fileLink = window.location.href
        .split("?")[1] // Get the query parameters.
        .split("&") // Split the query parameters.
        .find(param => param.startsWith("file=")) // Find the "file" parameter.
        .split("=")[1] // Get the "file" parameter value.
        .split("#")[0]; // Remove extra page numbers.

      // Decode the URI component.
      fileLink = decodeURIComponent(fileLink);
    } catch (err) {
      console.error(
        `Failed to parse window.location.href "${window.location.href}": ${err}`
      );
      return;
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(fileLink).catch(err => {
        console.error(`Failed to copy PDF file link "${fileLink}": ${err}`);
      });
    } else {
      this.fallbacKCopy(fileLink);
    }
  }
}

export { PDFCopyLink };
