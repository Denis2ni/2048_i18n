/* js/i18n.js */

const i18n = {
  fr: {
    intro: "Assemblez les nombres et atteignez la tuile <strong>2048 !</strong>",
    newGame: "Nouvelle partie",
    keepGoing: "Continuer",
    tryAgain: "Réessayer",
    howToPlayLabel: "Comment jouer :",
    howToPlayText:
      'Utilisez les <strong>flèches</strong> pour déplacer les tuiles. Quand deux tuiles avec le même nombre se touchent, elles <strong>fusionnent en une seule !</strong>',
    noteLabel: "Note :",
    noteText:
      'La version originale de 2048 est disponible via  <a href="http://git.io/2048">http://git.io/2048</a>. Ce site est une version dérivée avec des modifications et des traductions.',
    gameOver: "Partie terminée !",
    youWin: "Vous avez gagné !",
    score: "Score",
    best: "Meilleur"
  },

  en: {
    intro: 'Join the numbers and get to the <strong>2048 tile!</strong>',
    newGame: "New Game",
    keepGoing: "Keep going",
    tryAgain: "Try again",
    howToPlayLabel: "How to play:",
    howToPlayText:
      'Use your <strong>arrow keys</strong> to move the tiles. When two tiles with the same number touch, they <strong>merge into one!</strong>',
    noteLabel: "Note:",
    noteText:
      'The original version of 2048 is available at <a href="http://git.io/2048">http://git.io/2048</a>. This site is a derivative version with localization and UI changes.',
    gameOver: "Game over!",
    youWin: "You win!",
    score: "Score",
    best: "Best"
  },

  es: {
    intro: "Une los números y llega a la ficha <strong>2048</strong>.",
    newGame: "Nuevo juego",
    keepGoing: "Seguir",
    tryAgain: "Intentar de nuevo",
    howToPlayLabel: "Cómo jugar:",
    howToPlayText:
      'Usa las <strong>teclas de flecha</strong> para mover las fichas. Cuando dos fichas con el mismo número se tocan, se <strong>fusionan en una sola</strong>.',
    noteLabel: "Nota:",
    noteText:
      'La versión original de 2048 está disponible en <a href="http://git.io/2048">http://git.io/2048</a>. Este sitio es una versión derivada con modificaciones y traducciones.',
    gameOver: "¡Fin de la partida!",
    youWin: "¡Has ganado!",
    score: "Puntuación",
    best: "Mejor"
  }
};

let currentLocale = "fr";

function setLocale(locale) {
  if (i18n[locale]) currentLocale = locale;
}

function t(key) {
  const dict = i18n[currentLocale] || i18n.fr;
  return dict[key] ?? (i18n.fr[key] ?? key);
}

// Detect browser language and set initial locale (es/en/fr)
(function detectBrowserLang() {
  const nav = (navigator.language || "fr").toLowerCase();
  const candidate = nav.startsWith("es") ? "es" : nav.startsWith("en") ? "en" : "fr";
  setLocale(candidate);
})();


