/**
 * Content Loader Helper - Pulls item data from Foundry pack indexes
 * Does NOT load full documents — uses getIndex() with field projections instead.
 * Full documents are only fetched during character creation (createEmbeddedItems).
 */

// Fields needed per item type for the wizard display
const INDEX_FIELDS = {
  class: [
    'system.hitDice', 'system.hp', 'system.spellcasting',
    'system.saves', 'system.skills'
  ],
  race: [
    'system.advancement', 'system.traits', 'system.movement'
  ],
  background: [
    'system.skills', 'system.languages', 'system.startingEquipment'
  ],
  spell: [
    'system.level', 'system.school', 'system.components', 'system.properties'
  ],
  equipment: [
    'system.type', 'system.rarity', 'system.weight', 'system.price'
  ],
  weapon: [
    'system.type', 'system.rarity', 'system.weight', 'system.price'
  ],
  tool: [
    'system.type', 'system.rarity', 'system.weight', 'system.price'
  ],
  consumable: [
    'system.type', 'system.rarity', 'system.weight', 'system.price'
  ],
  feat: [
    'system.requirements', 'system.type'
  ]
};

export class ContentLoader {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Load items of a specific type from world items and compendium pack indexes.
   * Uses pack.getIndex() with field projections — no full document loading.
   */
  async loadItemType(itemType, enabledPacks = [], transformer = null) {
    const items = [];
    const fields = INDEX_FIELDS[itemType] || ['system'];

    // 1. Load from World Items (these are already in memory)
    if (game?.items) {
      for (const item of game.items) {
        if (item.type !== itemType) continue;
        try {
          const transformed = transformer
            ? transformer(item, 'world')
            : this._defaultTransform(item, 'world');
          if (transformed) items.push(transformed);
        } catch (err) {
          console.warn(`ContentLoader | Failed to transform world item ${item.name}`, err);
        }
      }
    }

    // 2. Pull from compendium pack indexes (fast — no full document loading)
    if (game?.packs) {
      for (const pack of game.packs) {
        const metadata = pack.metadata;
        if (metadata.type !== 'Item') continue;

        // Filter by enabled packs
        if (enabledPacks.length > 0 && !enabledPacks.includes(pack.collection)) continue;

        try {
          // Get index with the system fields we need for display
          const index = await pack.getIndex({ fields: ['type', ...fields] });

          for (const entry of index) {
            if (entry.type !== itemType) continue;

            // Wrap index entry to look like a document for the transformer
            const proxy = {
              id: entry._id,
              name: entry.name,
              type: entry.type,
              img: entry.img,
              system: entry.system || {}
            };

            try {
              const transformed = transformer
                ? transformer(proxy, pack.collection, metadata)
                : this._defaultTransform(proxy, pack.collection, metadata);
              if (transformed) items.push(transformed);
            } catch (err) {
              // Skip individual items that fail to transform
            }
          }
        } catch (err) {
          console.warn(`ContentLoader | Failed to read index from ${pack.collection}`, err);
        }
      }
    }

    return this._deduplicateAndSort(items);
  }

  /**
   * Default transformation for items
   */
  _defaultTransform(item, packName, metadata = null) {
    const source = metadata?.flags?.dnd5e?.sourceBook || (packName === 'world' ? 'World' : 'Unknown');
    const isHomebrew = packName === 'world' || (!source.includes('SRD') && !source.includes('PHB') && !source.includes('Free Rules'));

    return {
      id: item.id,
      packName: packName,
      name: item.name,
      type: item.type,
      source: source,
      isHomebrew: isHomebrew,
      system: item.system
    };
  }

  /**
   * Remove duplicates and sort by name
   */
  _deduplicateAndSort(items) {
    const seen = new Set();
    const filtered = items.filter(item => {
      const key = (item.name || '').toLowerCase().trim();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }

  /**
   * Get cached items or load if not cached
   */
  async getOrLoad(itemType, enabledPacks = [], transformer = null, forceReload = false) {
    const cacheKey = `${itemType}:${enabledPacks.join(',')}`;
    if (!forceReload && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    const items = await this.loadItemType(itemType, enabledPacks, transformer);
    this.cache.set(cacheKey, items);
    return items;
  }

  clearCache() { this.cache.clear(); }

  clearCacheFor(itemType) {
    for (const key of this.cache.keys()) {
      if (key.startsWith(`${itemType}:`)) this.cache.delete(key);
    }
  }
}
