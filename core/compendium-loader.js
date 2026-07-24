/**
 * LD Axyum - Compendium Loader
 * Handles loading and caching of content from dnd5e and module packs
 */
import { ContentLoader } from './content-loader.js';
import { ClassTransformer, RaceTransformer, BackgroundTransformer, SpellTransformer, EquipmentTransformer, FeatTransformer } from './content-transformers.js';
import { CompendiumQueries } from './compendium-queries.js';
import { HomebrewLoader } from './homebrew-loader.js';
import { ContentSourceManager } from './content-source-manager.js';
import { CompendiumCacheManager } from './compendium-cache-manager.js';

class CompendiumLoader {
  constructor() {
    this.cache = {
      classes: null,
      races: null,
      backgrounds: null,
      spells: null,
      equipment: null,
      features: null,
      feats: null
    };
    this.isLoading = false;
    this.loadPromise = null;
    this.homebrewDetected = false;
    this.homebrewPacks = [];
    this.worldFolders = new Map(); // Store world folder references
    this.folderConfig = new Map(); // GM-selected folders per category
    this.contentSources = new Map(); // Track active content sources
    this.contentLoader = new ContentLoader();
    this.queries = new CompendiumQueries(this.cache, () => this.loadAllContent());
    this.homebrewLoader = new HomebrewLoader();
    this.sourceManager = new ContentSourceManager();
  }

  scanWorldFolders() { return this.sourceManager.scanWorldFolders(); }
  getAvailableFoldersForCategory(category) { return this.sourceManager.getAvailableFoldersForCategory(category); }
  getAllContentSources(category) { return this.sourceManager.getAllContentSources(category); }
  async loadContentSourceConfig() { return this.sourceManager.loadContentSourceConfig(); }
  saveContentSourceConfig(category, sources) { return this.sourceManager.saveContentSourceConfig(category, sources, (cat) => this.clearCacheForCategory(cat)); }
  async loadFromSpecificSources(category, sources) { return this.sourceManager.loadFromSpecificSources(category, sources); }
  async _loadFromFolder(folderId, category) { return this.sourceManager.loadFromFolder(folderId, category); }
  async _loadFromCompendium(compendiumId, category) { return this.sourceManager.loadFromCompendium(compendiumId, category); }

  /**
   * Detect homebrew/custom content packs
   * Returns array of non-dnd5e system packs
   */
  static detectHomebrewPacks() {
    try {
      if (!game?.packs) return [];

      const homebrewPacks = [];
      const systemPacks = ['dnd5e'];

      for (const pack of game.packs.values()) {
        // Skip system packs
        if (systemPacks.some(sys => pack.collection.includes(sys))) {
          continue;
        }

        // Skip empty packs
        if (!pack.index || pack.index.length === 0) {
          continue;
        }

        homebrewPacks.push({
          name: pack.collection,
          label: pack.title || pack.collection,
          source: this._extractModuleSource(pack.collection),
          itemCount: pack.index.length
        });
      }

      return homebrewPacks;
    } catch (err) {
      console.warn('CompendiumLoader | Failed to detect homebrew packs', err);
      return [];
    }
  }

  /**
   * Extract module name from pack collection
   */
  static _extractModuleSource(packCollection) {
    // Format: "module-name.pack-name"
    const parts = packCollection.split('.');
    if (parts.length > 0) {
      return parts[0].replace(/-/g, ' ').toUpperCase();
    }
    return 'HOMEBREW';
  }

  /**
   * Clear cache for a specific category
   */
  clearCacheForCategory(category) {
    CompendiumCacheManager.clearCacheForCategory(this.cache, category);
  }

  static getEnabledCompendia() {
    return CompendiumCacheManager.getEnabledCompendia();
  }

  /**
   * Load all available content from enabled compendia
   * Returns a promise that resolves when all packs are loaded
   */
  async loadAllContent() {
    // Return existing promise if already loading
    if (this.isLoading && this.loadPromise) {
      return this.loadPromise;
    }

    // Return cached data if already loaded
    // NOTE: We must check if the cache is actually populated with arrays, not just non-null
    if (
      Array.isArray(this.cache.classes) &&
      Array.isArray(this.cache.races) &&
      Array.isArray(this.cache.backgrounds) &&
      Array.isArray(this.cache.spells) &&
      Array.isArray(this.cache.equipment) &&
      Array.isArray(this.cache.feats)
    ) {
      return this.cache;
    }

    this.isLoading = true;
    this.loadPromise = this._performLoad();

    try {
      await this.loadPromise;
      this.isLoading = false;
      return this.cache;
    } catch (err) {
      console.error('CompendiumLoader | Failed to load content', err);
      this.isLoading = false;

      // Prevent repeated failed load loops by caching an empty result.
      this.cache = {
        classes: [],
        races: [],
        backgrounds: [],
        spells: [],
        equipment: [],
        features: [],
        feats: []
      };

      // Resolve future calls immediately.
      this.loadPromise = Promise.resolve(this.cache);
      return this.cache;
    }
  }

  /**
   * Perform the actual loading
   */
  async _performLoad() {
    const transformers = { ClassTransformer, RaceTransformer, BackgroundTransformer, SpellTransformer, EquipmentTransformer, FeatTransformer };
    return CompendiumCacheManager.performLoad(this.contentLoader, this.cache, transformers);
  }

  /**
   * Load homebrew/custom content from non-dnd5e packs
   */
  async loadHomebrewContent() {
    const result = await this.homebrewLoader.loadHomebrewContent();
    this.homebrewDetected = result.detected;
    this.homebrewPacks = result.packs;
    return result;
  }

  /**
   * Load homebrew content from a specific pack
   */
  async _loadHomebrewFromPack(packName) {
    return this.homebrewLoader.loadHomebrewFromPack(packName);
  }

  /**
   * Validate homebrew content
   */
  validateHomebrewContent(content) {
    return this.homebrewLoader.validateHomebrewContent(content);
  }

  /**
   * Merge homebrew content with official content
   */
  mergeHomebrewContent(official, homebrew) {
    return this.homebrewLoader.mergeHomebrewContent(official, homebrew);
  }

  async getClasses(filter = '') { return this.queries.getClasses(filter); }
  async getClass(className) { return this.queries.getClass(className); }
  async getRaces(filter = '') { return this.queries.getRaces(filter); }
  async getRace(raceName) { return this.queries.getRace(raceName); }

  async getBackgrounds(filter = '') { return this.queries.getBackgrounds(filter); }
  async getBackground(bgName) { return this.queries.getBackground(bgName); }

  async getSpellsForClass(className, maxLevel = 9) { return this.queries.getSpellsForClass(className, maxLevel); }
  async getSpellsByLevel(level) { return this.queries.getSpellsByLevel(level); }
  async getCantrips(className = null) { return this.queries.getCantrips(className); }

  async getEquipment(type = null, filter = '') { return this.queries.getEquipment(type, filter); }
  async getWeapons(filter = '') { return this.queries.getWeapons(filter); }
  async getArmor(filter = '') { return this.queries.getArmor(filter); }

  async getFeats(filter = '') { return this.queries.getFeats(filter); }
  async getFeat(featName) { return this.queries.getFeat(featName); }
  async getFeatsByLevel(level, classes = null) { return this.queries.getFeatsByLevel(level, classes); }

  /**
   * Clear cache and reload
   */
  async clearCache() {
    this.cache = {
      classes: null,
      races: null,
      backgrounds: null,
      spells: null,
      equipment: null,
      features: null,
      feats: null
    };
    this.isLoading = false;
    this.loadPromise = null;
    return this.loadAllContent();
  }

  /**
   * Extract source from pack name
   */
  _extractSource(packName) {
    const sources = {
      'dnd5e': 'D&D 5e',
      'players-handbook': 'Player\'s Handbook',
      'phb': 'PHB',
      'tashas': 'Tasha\'s Cauldron',
      'tasha': 'Tasha\'s',
      'dungeon-masters': 'Dungeon Master\'s Guide',
      'dmg': 'DMG',
      'monster-manual': 'Monster Manual',
      'mm': 'MM'
    };

    for (const [key, label] of Object.entries(sources)) {
      if (packName.toLowerCase().includes(key)) {
        return label;
      }
    }

    return packName.replace(/^[^\.]+\./, '').replace(/-/g, ' ').toUpperCase();
  }

  /**
   * Get statistics about loaded content
   */
  getStats() {
    return {
      classes: this.cache.classes?.length || 0,
      races: this.cache.races?.length || 0,
      backgrounds: this.cache.backgrounds?.length || 0,
      spells: this.cache.spells?.length || 0,
      equipment: this.cache.equipment?.length || 0,
      feats: this.cache.feats?.length || 0
    };
  }

  async getClassProgression(className) { return this.queries.getClassProgression(className); }
  async getMulticlassOptions() { return this.queries.getMulticlassOptions(); }

  /**
   * Validate that multiclass combination is valid
   * For now, all combinations are valid in D&D 5e
   * @param {Array} classes - Array of class objects
   * @returns {Object} { valid: boolean, message: string }
   */
  validateMulticlass(classes) {
    if (!Array.isArray(classes) || classes.length === 0) {
      return { valid: false, message: 'Must select at least one class' };
    }

    // Check for duplicate classes
    const classIds = classes.map(c => c.id);
    const unique = new Set(classIds);
    if (unique.size !== classIds.length) {
      return { valid: false, message: 'Cannot have duplicate classes' };
    }

    return { valid: true, message: 'Valid multiclass combination' };
  }
}

// ES Module export
export default CompendiumLoader;

// CommonJS export for tests and Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CompendiumLoader;
}
