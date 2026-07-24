/**
 * Query methods for cached compendium content
 * @module compendium-queries
 */

export class CompendiumQueries {
  constructor(cache, ensureLoaded) {
    this.cache = cache;
    this.ensureLoaded = ensureLoaded;
  }

  /**
   * Get classes filtered by name
   */
  async getClasses(filter = '') {
    console.log('CompendiumQueries | getClasses called', {
      filter,
      cacheExists: !!this.cache,
      classesInCache: this.cache?.classes?.length || 0,
      hasEnsureLoaded: typeof this.ensureLoaded === 'function'
    });
    
    await this.ensureLoaded();
    
    console.log('CompendiumQueries | After ensureLoaded', {
      classesInCache: this.cache?.classes?.length || 0
    });

    if (!filter) return this.cache.classes || [];

    const lower = filter.toLowerCase();
    return (this.cache.classes || []).filter(cls =>
      cls.name.toLowerCase().includes(lower)
    );
  }

  /**
   * Get a specific class by name
   */
  async getClass(className) {
    await this.ensureLoaded();
    return this.cache.classes.find(cls =>
      cls.name.toLowerCase() === className.toLowerCase()
    );
  }

  /**
   * Get races filtered by name
   */
  async getRaces(filter = '') {
    await this.ensureLoaded();

    if (!filter) return this.cache.races;

    const lower = filter.toLowerCase();
    return this.cache.races.filter(race =>
      race.name.toLowerCase().includes(lower)
    );
  }

  /**
   * Get a specific race by name
   */
  async getRace(raceName) {
    await this.ensureLoaded();
    return this.cache.races.find(race =>
      race.name.toLowerCase() === raceName.toLowerCase()
    );
  }

  /**
   * Get backgrounds filtered by name
   */
  async getBackgrounds(filter = '') {
    await this.ensureLoaded();

    if (!filter) return this.cache.backgrounds;

    const lower = filter.toLowerCase();
    return this.cache.backgrounds.filter(bg =>
      bg.name.toLowerCase().includes(lower)
    );
  }

  /**
   * Get a specific background by name
   */
  async getBackground(bgName) {
    await this.ensureLoaded();
    return this.cache.backgrounds.find(bg =>
      bg.name.toLowerCase() === bgName.toLowerCase()
    );
  }

  /**
   * Get spells filtered by class and optional level
   */
  async getSpellsForClass(className, maxLevel = 9) {
    await this.ensureLoaded();

    return this.cache.spells.filter(spell => {
      const classMatch = !spell.classes || !spell.classes.length || 
        spell.classes.some(cls => cls.toLowerCase().includes(className.toLowerCase()));
      
      const levelMatch = spell.level <= maxLevel;

      return classMatch && levelMatch;
    });
  }

  /**
   * Get spells by level
   */
  async getSpellsByLevel(level) {
    await this.ensureLoaded();

    return this.cache.spells.filter(spell => spell.level === level);
  }

  /**
   * Get cantrips (level 0 spells)
   */
  async getCantrips(className = null) {
    await this.ensureLoaded();

    let cantrips = this.cache.spells.filter(spell => spell.level === 0);

    if (className) {
      cantrips = cantrips.filter(spell =>
        !spell.classes.length ||
        spell.classes.some(cls => cls.toLowerCase().includes(className.toLowerCase()))
      );
    }

    return cantrips;
  }

  /**
   * Get equipment filtered by type
   */
  async getEquipment(type = null, filter = '') {
    await this.ensureLoaded();

    let results = this.cache.equipment;

    if (type) {
      results = results.filter(item => item.type === type);
    }

    if (filter) {
      const lower = filter.toLowerCase();
      results = results.filter(item =>
        item.name.toLowerCase().includes(lower)
      );
    }

    return results;
  }

  /**
   * Get weapons
   */
  async getWeapons(filter = '') {
    return this.getEquipment('weapon', filter);
  }

  /**
   * Get armor
   */
  async getArmor(filter = '') {
    return this.getEquipment('equipment', filter);
  }

  /**
   * Get all feats
   */
  async getFeats(filter = '') {
    await this.ensureLoaded();

    if (!filter) return this.cache.feats;

    const lower = filter.toLowerCase();
    return this.cache.feats.filter(feat =>
      feat.name.toLowerCase().includes(lower)
    );
  }

  /**
   * Get a specific feat by name
   */
  async getFeat(featName) {
    await this.ensureLoaded();
    return this.cache.feats.find(feat =>
      feat.name.toLowerCase() === featName.toLowerCase()
    );
  }

  /**
   * Get feats available at a given character level
   */
  async getFeatsByLevel(level, classes = null) {
    await this.ensureLoaded();

    let available = this.cache.feats.filter(feat => {
      return feat.requiresLevel <= level;
    });

    if (classes && classes.length > 0) {
      const classNames = classes.map(c => c.toLowerCase());
      available = available.filter(feat => {
        if (!feat.requiresAbility) return true;
        return classNames.includes(feat.requiresAbility.toLowerCase());
      });
    }

    return available;
  }

  /**
   * Get class progression details
   */
  async getClassProgression(className) {
    await this.ensureLoaded();
    
    const cls = this.cache.classes.find(c =>
      c.name.toLowerCase() === className.toLowerCase()
    );

    if (!cls) return null;

    return {
      name: cls.name,
      hitDice: cls.hitDice,
      spellcasting: cls.spellcasting,
      saves: cls.saves,
      skills: cls.skills
    };
  }

  /**
   * Get multiclass options
   */
  async getMulticlassOptions() {
    await this.ensureLoaded();
    return this.cache.classes.filter(cls => cls.spellcasting !== null);
  }
}
