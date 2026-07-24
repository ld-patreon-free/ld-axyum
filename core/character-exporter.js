/**
 * Character Exporter
 * Exports character data to JSON format for backup, sharing, or migration
 * Captures: class levels, multiclass, ASI selections, feats, homebrew items, proficiencies, spells, notes, conditions
 */

class CharacterExporter {
  /**
   * Export character data to JSON object
   * @param {Actor} actor - The actor to export
   * @returns {Object} Exportable character data
   */
  static exportCharacter(actor) {
    if (!actor) {
      throw new Error('Cannot export: Actor is required');
    }

    const system = actor.system;
    const characterData = this._extractCharacterData(actor);

    return {
      version: '1.0',
      exportDate: new Date().toISOString(),
      exportedBy: game.user?.name || 'Unknown',
      
      // Character Identity
      character: {
        name: actor.name,
        race: system.details?.race || '',
        class: system.details?.class || '',
        subclass: system.details?.subclass || '',
        background: system.details?.background || '',
        alignment: system.details?.alignment || 'Unaligned',
        level: system.details?.level || 1
      },

      // Ability Scores
      abilities: {
        str: system.abilities?.str || 10,
        dex: system.abilities?.dex || 10,
        con: system.abilities?.con || 10,
        int: system.abilities?.int || 10,
        wis: system.abilities?.wis || 10,
        cha: system.abilities?.cha || 10
      },

      // Hit Points
      hitPoints: {
        value: system.attributes?.hp?.value || 0,
        max: system.attributes?.hp?.max || 1,
        temp: system.attributes?.hp?.temp || 0
      },

      // Armor Class and Speed
      armorClass: system.attributes?.ac || 10,
      speed: system.attributes?.speed || 30,

      // Proficiencies
      proficiencies: {
        armor: system.traits?.armorProf?.value || [],
        weapons: system.traits?.weaponProf?.value || [],
        tools: system.traits?.toolProf?.value || [],
        languages: system.traits?.languages?.value || [],
        savingThrows: characterData.savingThrowProficiencies || [],
        skills: characterData.skillProficiencies || []
      },

      // Class and Multiclass Info
      class: this._exportClassData(actor, characterData),

      // Ability Score Improvements (ASI)
      asiSelections: this._exportASISelections(actor),

      // Feats
      feats: this._exportFeats(actor),

      // Spells and Spell Slots
      spells: this._exportSpells(actor),

      // Equipment and Items
      items: this._exportItems(actor),

      // Features and Traits
      features: this._exportFeatures(actor),

      // Homebrew Items
      homebrew: this._exportHomebrew(actor),

      // Custom Notes and Biography
      biography: {
        notes: system.details?.biography || '',
        personalityTraits: system.details?.personalityTraits || '',
        ideals: system.details?.ideals || '',
        bonds: system.details?.bonds || '',
        flaws: system.details?.flaws || ''
      },

      // Conditions and Status Effects
      conditions: this._exportConditions(actor),

      // Metadata for reconstruction
      metadata: {
        system: game.system?.id || 'dnd5e',
        module: 'ld-axyum',
        creationDate: actor.created || new Date().toISOString(),
        lastModified: actor.modified || new Date().toISOString(),
        uuid: actor.uuid,
        id: actor.id
      }
    };
  }

  /**
   * Extract character data from actor
   */
  static _extractCharacterData(actor) {
    const system = actor.system;
    return {
      name: actor.name,
      class: {
        id: system.details?.class,
        name: system.details?.class || 'Unknown',
        level: system.details?.level || 1
      },
      race: {
        id: system.details?.race,
        name: system.details?.race || 'Unknown'
      },
      savingThrowProficiencies: system.details?.savingThrows || [],
      skillProficiencies: system.details?.skillProficiencies || []
    };
  }

  /**
   * Export class data and multiclass information
   */
  static _exportClassData(actor, characterData) {
    const system = actor.system;
    const classInfo = {
      primary: {
        name: system.details?.class || 'Unknown',
        level: system.details?.level || 1,
        hitDice: system.details?.hitDice || 'd8'
      }
    };

    // Check for multiclass data
    if (actor.getFlag('ld-axyum', 'isMulticlass')) {
      const multiclassData = actor.getFlag('ld-axyum', 'multiclass') || {};
      classInfo.multiclass = {
        active: true,
        classes: multiclassData.classes || [],
        totalLevel: multiclassData.totalLevel || system.details?.level || 1
      };
    }

    // Export spell slot data
    const spellSlots = {};
    for (let level = 1; level <= 9; level++) {
      const slotKey = `spell${level}`;
      if (system.spells?.[slotKey]) {
        spellSlots[`level${level}`] = {
          value: system.spells[slotKey].value || 0,
          max: system.spells[slotKey].max || 0
        };
      }
    }

    if (Object.keys(spellSlots).length > 0) {
      classInfo.spellSlots = spellSlots;
    }

    return classInfo;
  }

  /**
   * Export ASI selections and ability score improvements
   */
  static _exportASISelections(actor) {
    const asiData = actor.getFlag('ld-axyum', 'asiSelections') || {};
    const asiSelections = [];

    Object.entries(asiData).forEach(([level, selection]) => {
      if (selection && Object.keys(selection).length > 0) {
        asiSelections.push({
          level: parseInt(level),
          type: selection.type || 'asi', // 'asi' or 'feat'
          improvements: selection.improvements || [],
          feat: selection.feat || null
        });
      }
    });

    return asiSelections;
  }

  /**
   * Export selected feats
   */
  static _exportFeats(actor) {
    const featsData = actor.getFlag('ld-axyum', 'feats') || {};
    const feats = [];

    Object.entries(featsData).forEach(([key, feat]) => {
      if (feat && feat.name) {
        feats.push({
          name: feat.name,
          source: feat.source || 'official',
          level: feat.level || 0,
          description: feat.description || '',
          prerequisites: feat.prerequisites || ''
        });
      }
    });

    return feats;
  }

  /**
   * Export spells and spell information
   */
  static _exportSpells(actor) {
    const spellItems = actor.items.filter(item => item.type === 'spell');
    const spells = {
      cantrips: [],
      prepared: [],
      known: [],
      available: []
    };

    spellItems.forEach(spell => {
      const spellData = {
        name: spell.name,
        level: spell.system?.level || 0,
        school: spell.system?.school || '',
        castingTime: spell.system?.activation?.type || '',
        range: spell.system?.range?.value || '',
        components: {
          verbal: spell.system?.components?.vocal || false,
          somatic: spell.system?.components?.somatic || false,
          material: spell.system?.components?.material || false
        },
        duration: spell.system?.duration?.value || '',
        description: spell.system?.description?.value || '',
        source: spell.getFlag('ld-axyum', 'source') || 'phb'
      };

      const level = spell.system?.level || 0;
      if (level === 0) {
        spells.cantrips.push(spellData);
      } else if (spell.system?.preparation?.prepared) {
        spells.prepared.push(spellData);
      } else if (actor.system.details?.class?.includes('Bard') || actor.system.details?.class?.includes('Sorcerer')) {
        spells.known.push(spellData);
      } else {
        spells.available.push(spellData);
      }
    });

    return spells;
  }

  /**
   * Export items (equipment, tools, etc.)
   */
  static _exportItems(actor) {
    const items = [];
    const nonSpellItems = actor.items.filter(item => item.type !== 'spell');

    nonSpellItems.forEach(item => {
      items.push({
        name: item.name,
        type: item.type,
        quantity: item.system?.quantity || 1,
        equipped: item.system?.equipped || false,
        rarity: item.system?.rarity || 'common',
        value: item.system?.value || 0,
        weight: item.system?.weight || 0,
        description: item.system?.description?.value || '',
        source: item.getFlag('ld-axyum', 'source') || 'official'
      });
    });

    return items;
  }

  /**
   * Export character features and class features
   */
  static _exportFeatures(actor) {
    const features = [];
    const featureItems = actor.items.filter(item => item.type === 'feature');

    featureItems.forEach(feature => {
      features.push({
        name: feature.name,
        source: feature.getFlag('ld-axyum', 'source') || 'official',
        gainedAtLevel: feature.getFlag('ld-axyum', 'level') || 1,
        description: feature.system?.description?.value || '',
        prerequisite: feature.system?.prerequisite || ''
      });
    });

    return features;
  }

  /**
   * Export homebrew items (custom feats, features, spells)
   */
  static _exportHomebrew(actor) {
    const homebrew = {
      feats: [],
      features: [],
      spells: [],
      races: [],
      classes: []
    };

    const homebrewFeats = actor.getFlag('ld-axyum', 'homebrewFeats') || {};
    Object.values(homebrewFeats).forEach(feat => {
      if (feat && feat.name) {
        homebrew.feats.push({
          id: feat.id,
          name: feat.name,
          description: feat.description || '',
          prerequisites: feat.prerequisites || [],
          source: feat.source || 'homebrew'
        });
      }
    });

    const homebrewFeatures = actor.getFlag('ld-axyum', 'homebrewFeatures') || {};
    Object.values(homebrewFeatures).forEach(feature => {
      if (feature && feature.name) {
        homebrew.features.push({
          id: feature.id,
          name: feature.name,
          description: feature.description || '',
          source: feature.source || 'homebrew'
        });
      }
    });

    const homebrewSpells = actor.getFlag('ld-axyum', 'homebrewSpells') || {};
    Object.values(homebrewSpells).forEach(spell => {
      if (spell && spell.name) {
        homebrew.spells.push({
          id: spell.id,
          name: spell.name,
          level: spell.level || 0,
          school: spell.school || '',
          description: spell.description || '',
          source: spell.source || 'homebrew'
        });
      }
    });

    return homebrew;
  }

  /**
   * Export conditions and status effects
   */
  static _exportConditions(actor) {
    const conditions = {
      active: [],
      temporary: []
    };

    // Export active conditions
    const conditionFlags = actor.getFlag('dnd5e', 'conditions') || {};
    const commonConditions = [
      'blind', 'charm', 'deafen', 'fatigue', 'fright', 'grapple',
      'incap', 'invisible', 'paralysis', 'petrified', 'poison', 'prone',
      'restrained', 'stun', 'unconscious'
    ];

    commonConditions.forEach(cond => {
      if (conditionFlags[cond]) {
        conditions.active.push(cond);
      }
    });

    // Export temporary modifiers
    const tempAbilities = actor.getFlag('dnd5e', 'temporaryAbilities') || {};
    const tempAC = actor.getFlag('dnd5e', 'temporaryAC') || 0;
    const tempResistances = actor.getFlag('dnd5e', 'temporaryResistances') || {};

    if (Object.keys(tempAbilities).length > 0) {
      conditions.temporary.push({
        type: 'abilities',
        values: tempAbilities
      });
    }

    if (tempAC !== 0) {
      conditions.temporary.push({
        type: 'ac',
        value: tempAC
      });
    }

    if (Object.keys(tempResistances).length > 0) {
      conditions.temporary.push({
        type: 'resistances',
        values: tempResistances
      });
    }

    // Export active effects
    const activeEffects = actor.appliedEffects || [];
    const temporaryEffects = activeEffects.filter(effect => {
      const duration = effect.duration || {};
      return duration.seconds || duration.rounds || duration.turns;
    });

    if (temporaryEffects.length > 0) {
      conditions.temporary.push({
        type: 'effects',
        effects: temporaryEffects.map(effect => ({
          name: effect.name,
          label: effect.label,
          duration: effect.duration,
          changes: effect.changes || []
        }))
      });
    }

    return conditions;
  }

  /**
   * Export character to JSON file (browser download)
   */
  static async downloadCharacterJSON(actor) {
    try {
      const characterData = this.exportCharacter(actor);
      const jsonString = JSON.stringify(characterData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${characterData.character.name.replace(/\s+/g, '_')}_export.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return {
        success: true,
        message: `Character exported successfully: ${characterData.character.name}`
      };
    } catch (error) {
      console.error('Export error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Export to string for clipboard copy
   */
  static exportToString(actor) {
    const characterData = this.exportCharacter(actor);
    return JSON.stringify(characterData, null, 2);
  }

  /**
   * Get exportable data size estimate in KB
   */
  static getExportSize(actor) {
    const characterData = this.exportCharacter(actor);
    const jsonString = JSON.stringify(characterData);
    const sizeKB = new Blob([jsonString]).size / 1024;
    return Math.round(sizeKB * 100) / 100; // Round to 2 decimals
  }
}

// ES module export
export { CharacterExporter };
