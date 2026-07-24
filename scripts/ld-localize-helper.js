/**
 * Shared localization helper for LD modules
 * Provides common i18n utilities
 */

export function setupLocalizationHelper() {
  // Register common localization helpers if not already registered
  if (!Handlebars.helpers.localize) {
    Handlebars.registerHelper('localize', (key) => {
      try {
        if (typeof game !== 'undefined' && game?.i18n && typeof game.i18n.localize === 'function') {
          return game.i18n.localize(String(key));
        }
      } catch (err) {
        console.warn('Localization helper error for key:', key, err);
      }
      return String(key);
    });
  }

  if (!Handlebars.helpers.format) {
    Handlebars.registerHelper('format', (key, options) => {
      try {
        if (typeof game !== 'undefined' && game?.i18n && typeof game.i18n.format === 'function') {
          const params = options && options.hash ? options.hash : {};
          return game.i18n.format(String(key), params);
        }
      } catch (err) {
        console.warn('Format helper error for key:', key, err);
      }
      return String(key);
    });
  }
}
