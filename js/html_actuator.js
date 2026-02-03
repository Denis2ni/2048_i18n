function HTMLActuator() {
  // Main DOM containers used to render the game
  this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");

  // UI elements that contain translatable text
  this.restartButton = document.querySelector(".restart-button");
  this.retryButton = document.querySelector(".retry-button");
  this.keepPlayingButton = document.querySelector(".keep-playing-button");
  this.gameIntro = document.querySelector(".game-intro");
  this.gameExplanation = document.querySelector(".game-explanation");
  this.noteLabel = document.querySelector(".note-label");
  this.noteText = document.querySelector(".note-text");

  // Current score state
  this.score = 0;

  // Set the document language attribute for CSS-based i18n
  document.documentElement.lang = currentLocale;

  // Apply translations on initial load
  this.applyTranslations();

  // Bind language selector events if present
  this.bindLanguageSelector();
}


HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);

    if (metadata.terminated) {
      if (metadata.over) {
        self.message(false); // You lose
      } else if (metadata.won) {
        self.message(true); // You win!
      }
    }

  });
};

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continueGame = function () {
  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var self = this;

  var wrapper   = document.createElement("div");
  var inner     = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.positionClass(position);

  // We can't use classlist because it somehow glitches when replacing classes
  var classes = ["tile", "tile-" + tile.value, positionClass];

  if (tile.value > 2048) classes.push("tile-super");

  this.applyClasses(wrapper, classes);

  inner.classList.add("tile-inner");
  inner.textContent = tile.value;

  if (tile.previousPosition) {
    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(wrapper, classes); // Update the position
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(wrapper, classes);

    // Render the tiles that merged
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    classes.push("tile-new");
    this.applyClasses(wrapper, classes);
  }

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
  this.clearContainer(this.scoreContainer);

  var difference = score - this.score;
  this.score = score;

  this.scoreContainer.textContent = this.score;

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference;

    this.scoreContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = bestScore;
};

HTMLActuator.prototype.message = function (won) {
  // Determine message type based on game outcome
  var type    = won ? "game-won" : "game-over";
  // Get localized strings for the current language (fallback to French)
  // Localized end-of-game message
  var message = won ? t("youWin") : t("gameOver");
  // Update message container state and content
  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};

HTMLActuator.prototype.applyTranslations = function () {
  // Update static UI texts using i18n helper
  if (this.gameIntro) this.gameIntro.innerHTML = t("intro");
  if (this.restartButton) this.restartButton.textContent = t("newGame");
  if (this.retryButton) this.retryButton.textContent = t("tryAgain");
  if (this.keepPlayingButton) this.keepPlayingButton.textContent = t("keepGoing");

  // Update "How to play" section (full paragraph replacement)
  if (this.gameExplanation) {
    this.gameExplanation.innerHTML =
      '<strong class="important">' + t("howToPlayLabel") + '</strong> ' + t("howToPlayText");
  }

  // Optional: Note section (only if you implemented .note-label and .note-text in HTML)
  if (this.noteLabel) this.noteLabel.textContent = t("noteLabel");
  if (this.noteText) this.noteText.innerHTML = t("noteText");
};

HTMLActuator.prototype.bindLanguageSelector = function () {
  // Get language selector element (if present)
  var select = document.getElementById("lang-select");
  if (!select) return;

  // Initialize selector with the current language
  select.value = currentLocale;

  var self = this;
  // Update language and UI on user selection
  select.addEventListener("change", function (e) {
    setLocale(e.target.value);
    // Update document language attribute for CSS-based i18n
    document.documentElement.lang = currentLocale;
    // Re-apply translations to static UI elements
    self.applyTranslations();

    // Re-translate end-of-game message if currently visible
    if (self.messageContainer.classList.contains("game-won")) {
      self.messageContainer.getElementsByTagName("p")[0].textContent = t("youWin");
    } else if (self.messageContainer.classList.contains("game-over")) {
      self.messageContainer.getElementsByTagName("p")[0].textContent = t("gameOver");
    }
  });
};

