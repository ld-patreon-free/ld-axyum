/**
 * Compendium Cache Manager
 * Manages loading orchestration and caching for compendium content
 */

export class CompendiumCacheManager {
  /**
   * Clear cache for specific category
   */
  static clearCacheForCategory(cache, category) {
    switch (category) {
      case 'classes':
        cache.classes = null;
        break;
      case 'races':
        cache.races = null;
        break;
      case 'backgrounds':
        cache.backgrounds = null;
        break;
      case 'feats':
        cache.feats = null;
        break;
      case 'spells':
        cache.spells = null;
        break;
    }
  }

  /**
   * Get enabled compendia from settings
   */
  static getEnabledCompendia() {
    // Get settings from game settings
    let settings;
    try {
      settings = game.settings.get('ld-axyum', 'enabledCompendia');
    } catch (err) {
      console.warn('CompendiumCacheManager | Could not read enabledCompendia setting:', err.message);
      return []; // Return empty = permissive mode (load all packs)
    }
    
    console.log('CompendiumCacheManager | Raw settings:', settings);
    
    // Handle array format (legacy or direct list)
    if (Array.isArray(settings)) {
        console.log('CompendiumCacheManager | Settings is array, returning:', settings);
        return settings;
    }
    
    // Handle object format (map of id -> boolean)
    const enabledMap = settings || {};
    
    // Convert map to array of pack IDs
    const enabledPacks = Object.entries(enabledMap)
      .filter(([packId, isEnabled]) => isEnabled)
      .map(([packId]) => packId);
    
    console.log('CompendiumCacheManager | Enabled packs:', enabledPacks);
      
    return enabledPacks;
  }

  /**
   * Load all available content from enabled compendia with caching
   */
  static async loadAllContent(loader, cache, isLoading, loadPromise) {
    // Return existing promise if already loading
    if (isLoading && loadPromise) {
      return loadPromise;
    }

    // Return cached data if already loaded
    if (cache.classes && cache.classes.length > 0 && 
        cache.races && cache.races.length > 0 && 
        cache.backgrounds && cache.backgrounds.length > 0) {
      return cache;
    }

    return loader._performLoad();
  }

  /**
   * Perform the actual loading of all content types
   */
  static async performLoad(contentLoader, cache, transformers) {
    let enabled = this.getEnabledCompendia();

    // If no compendia are enabled via settings, default to all available packs.
    // This avoids unnecessary warnings and ensures content is still loaded.
    if (enabled.length === 0) {
      enabled = Array.from(game.packs.values()).map(pack => pack.collection);
    }

    console.log('CompendiumCacheManager | performLoad starting', {
      enabledCompendia: enabled,
      enabledCount: enabled.length,
      availablePacks: game?.packs?.size || 0
    });

    if (enabled.length === 0) {
      console.warn('CompendiumCacheManager | No compendia available to load. Ensure your world has compendium packs.');
    }

    try {
      console.log('CompendiumCacheManager | Loading classes...');
      const classes = await contentLoader.loadItemType('class', enabled, transformers.ClassTransformer.transform);
      console.log('CompendiumCacheManager | Classes loaded:', classes?.length || 0);
      
      console.log('CompendiumCacheManager | Loading races...');
      const races = await contentLoader.loadItemType('race', enabled, transformers.RaceTransformer.transform);
      console.log('CompendiumCacheManager | Races loaded:', races?.length || 0);
      
      console.log('CompendiumCacheManager | Loading backgrounds...');
      const backgrounds = await contentLoader.loadItemType('background', enabled, transformers.BackgroundTransformer.transform);
      console.log('CompendiumCacheManager | Backgrounds loaded:', backgrounds?.length || 0);
      
      console.log('CompendiumCacheManager | Loading spells...');
      const spells = await contentLoader.loadItemType('spell', enabled, transformers.SpellTransformer.transform);
      console.log('CompendiumCacheManager | Spells loaded:', spells?.length || 0);
      
      console.log('CompendiumCacheManager | Loading equipment (including weapons/tools)...');
      const equipmentTypes = ['equipment', 'weapon', 'tool', 'consumable'];
      let equipment = [];
      for (const type of equipmentTypes) {
        try {
          const items = await contentLoader.loadItemType(type, enabled, transformers.EquipmentTransformer.transform);
          equipment = equipment.concat(items || []);
        } catch (err) {
          console.warn(`CompendiumCacheManager | Failed to load equipment type ${type}`, err);
        }
      }
      // Deduplicate by name to avoid weapon/equipment duplicates from multiple sources.
      const seen = new Set();
      equipment = equipment.filter(item => {
        const key = (item?.name || '').toLowerCase().trim();
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      console.log('CompendiumCacheManager | Equipment loaded (merged, deduped):', equipment?.length || 0);
      
      console.log('CompendiumCacheManager | Loading feats...');
      const feats = await contentLoader.loadItemType('feat', enabled, transformers.FeatTransformer.transform);
      console.log('CompendiumCacheManager | Feats loaded:', feats?.length || 0);
      
      cache.classes = classes;
      cache.races = races;
      cache.backgrounds = backgrounds;
      cache.spells = spells;
      cache.equipment = equipment;
      cache.feats = feats;
      
      console.log('CompendiumCacheManager | All content loaded successfully', {
        classes: classes?.length || 0,
        races: races?.length || 0,
        backgrounds: backgrounds?.length || 0,
        spells: spells?.length || 0,
        equipment: equipment?.length || 0,
        feats: feats?.length || 0
      });
      
      return cache;
    } catch (err) {
      console.error('CompendiumCacheManager | Load error', err);
      return cache;
    }
  }
}

// ES module export
export default CompendiumCacheManager;
