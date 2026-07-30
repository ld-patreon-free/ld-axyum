/**
 * Character Importer
 * Imports character data from JSON format
 * Supports: class levels, multiclass, ASI selections, feats, homebrew items, proficiencies, spells, notes, conditions
 */

class CharacterImporter {
  /**
   * Import character data from JSON object
   * @param {Object} importData - The character data to import
   * @param {Actor} targetActor - Optional actor to apply import to
   * @returns {Object} Import result with success status and data
   */
  static importCharacter(importData, targetActor = null) {
    try {
      // Validate import data
      this._validateImportData(importData);

      const importedCharacter = {
        version: importData.version || '1.0',
        character: importData.character || {},
        abilities: importData.abilities || {},
        hitPoints: importData.hitPoints || {},
        armorClass: importData.armorClass || 10,
        speed: importData.speed || 30,
        proficiencies: importData.proficiencies || {},
        class: importData.class || {},
        asiSelections: importData.asiSelections || [],
        feats: importData.feats || [],
        spells: importData.spells || {},
        items: importData.items || [],
        features: importData.features || [],
        homebrew: importData.homebrew || {},
        biography: importData.biography || {},
        conditions: importData.conditions || {},
        metadata: importData.metadata || {}
      };

      return {
        success: true,
        data: importedCharacter,
        summary: this._generateImportSummary(importedCharacter)
      };
    } catch (error) {
      console.error('Import error:', error);
      return {
        success: false,
        error: error.message,
        details: error.details || {}
      };
    }
  }

  /**
   * Validate import data structure
   */
  static _validateImportData(importData) {
    if (!importData) {
      throw new Error('Import data is required');
    }

    if (typeof importData !== 'object') {
      throw new Error('Import data must be a JSON object');
    }

    if (!importData.character || !importData.character.name) {
      throw new Error('Character name is required in import data');
    }

    if (!importData.abilities || Object.keys(importData.abilities).length === 0) {
      throw new Error('Ability scores are required in import data');
    }

    // Validate ability scores are in valid range
    const validAbilities = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    validAbilities.forEach(ability => {
      const score = importData.abilities[ability];
      if (score !== undefined && (score < 3 || score > 20)) {
        const error = new Error(`Invalid ability score for ${ability.toUpperCase()}: ${score}. Must be between 3 and 20.`);
        error.details = { ability, score };
        throw error;
      }
    });
  }

  /**
   * Apply imported data to an actor
   */
  static async applyImportToActor(importData, actor) {
    try {
      this._validateImportData(importData);

      importData = {
        ...importData,
        hitPoints: importData.hitPoints || {},
        proficiencies: importData.proficiencies || {},
        class: importData.class || {},
        homebrew: importData.homebrew || {},
        conditions: importData.conditions || {}
      };

      const updates = {
        name: importData.character.name || actor.name,
        system: {
          details: {
            race: importData.character.race || '',
            class: importData.character.class || '',
            subclass: importData.character.subclass || '',
            background: importData.character.background || '',
            alignment: importData.character.alignment || 'Unaligned',
            level: importData.character.level || 1,
            biography: importData.biography?.notes || ''
          },
          abilities: importData.abilities,
          attributes: {
            ac: importData.armorClass || 10,
            hp: {
              value: importData.hitPoints.value || 0,
              max: importData.hitPoints.max || 1,
              temp: importData.hitPoints.temp || 0
            },
            speed: importData.speed || 30
          },
          traits: {
            armorProf: { value: importData.proficiencies.armor || [] },
            weaponProf: { value: importData.proficiencies.weapons || [] },
            toolProf: { value: importData.proficiencies.tools || [] },
            languages: { value: importData.proficiencies.languages || [] }
          }
        }
      };

      // Apply flags for extended data
      const flags = {
        'ld-axyum': {}
      };

      // Apply multiclass data if present
      if (importData.class.multiclass && importData.class.multiclass.active) {
        flags['ld-axyum'].isMulticlass = true;
        flags['ld-axyum'].multiclass = importData.class.multiclass;
      }

      // Apply ASI selections
      if (importData.asiSelections && importData.asiSelections.length > 0) {
        const asiData = {};
        importData.asiSelections.forEach(asi => {
          asiData[asi.level] = {
            type: asi.type || 'asi',
            improvements: asi.improvements || [],
            feat: asi.feat || null
          };
        });
        flags['ld-axyum'].asiSelections = asiData;
      }

      // Apply feats
      if (importData.feats && importData.feats.length > 0) {
        const featsData = {};
        importData.feats.forEach((feat, index) => {
          featsData[`feat_${index}`] = {
            name: feat.name,
            source: feat.source || 'official',
            level: feat.level || 0,
            description: feat.description || '',
            prerequisites: feat.prerequisites || ''
          };
        });
        flags['ld-axyum'].feats = featsData;
      }

      // Apply homebrew data
      if (importData.homebrew) {
        if (importData.homebrew.feats && importData.homebrew.feats.length > 0) {
          const homebrewFeats = {};
          importData.homebrew.feats.forEach(feat => {
            homebrewFeats[feat.id] = feat;
          });
          flags['ld-axyum'].homebrewFeats = homebrewFeats;
        }

        if (importData.homebrew.features && importData.homebrew.features.length > 0) {
          const homebrewFeatures = {};
          importData.homebrew.features.forEach(feature => {
            homebrewFeatures[feature.id] = feature;
          });
          flags['ld-axyum'].homebrewFeatures = homebrewFeatures;
        }

        if (importData.homebrew.spells && importData.homebrew.spells.length > 0) {
          const homebrewSpells = {};
          importData.homebrew.spells.forEach(spell => {
            homebrewSpells[spell.id] = spell;
          });
          flags['ld-axyum'].homebrewSpells = homebrewSpells;
        }
      }

      // Apply conditions if present
      if (importData.conditions) {
        if (importData.conditions.active && importData.conditions.active.length > 0) {
          const conditionFlags = {};
          importData.conditions.active.forEach(cond => {
            conditionFlags[cond] = true;
          });
          flags['dnd5e'] = flags['dnd5e'] || {};
          flags['dnd5e'].conditions = conditionFlags;
        }

        if (importData.conditions.temporary) {
          importData.conditions.temporary.forEach(tempMod => {
            if (tempMod.type === 'abilities') {
              flags['dnd5e'] = flags['dnd5e'] || {};
              flags['dnd5e'].temporaryAbilities = tempMod.values;
            } else if (tempMod.type === 'ac') {
              flags['dnd5e'] = flags['dnd5e'] || {};
              flags['dnd5e'].temporaryAC = tempMod.value;
            } else if (tempMod.type === 'resistances') {
              flags['dnd5e'] = flags['dnd5e'] || {};
              flags['dnd5e'].temporaryResistances = tempMod.values;
            }
          });
        }
      }

      // Apply updates to actor
      await actor.update(updates);

      // Apply flags
      for (const [scope, scopeFlags] of Object.entries(flags)) {
        for (const [key, value] of Object.entries(scopeFlags)) {
          await actor.setFlag(scope, key, value);
        }
      }

      // Import items/spells if provided
      if (importData.items && importData.items.length > 0) {
        await this._importItems(actor, importData.items);
      }

      if (importData.spells && Object.keys(importData.spells).length > 0) {
        await this._importSpells(actor, importData.spells);
      }

      return {
        success: true,
        message: `Character import applied successfully to ${actor.name}`,
        actorId: actor.id
      };
    } catch (error) {
      console.error('Actor import error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Import items into an actor
   */
  static async _importItems(actor, itemsData) {
    const itemsToCreate = itemsData.map(itemData => ({
      name: itemData.name,
      type: itemData.type,
      system: {
        quantity: itemData.quantity || 1,
        equipped: itemData.equipped || false,
        rarity: itemData.rarity || 'common',
        value: itemData.value || 0,
        weight: itemData.weight || 0,
        description: { value: itemData.description || '' }
      },
      flags: {
        'ld-axyum': {
          source: itemData.source || 'official'
        }
      }
    }));

    if (itemsToCreate.length > 0) {
      await actor.createEmbeddedDocuments('Item', itemsToCreate);
    }
  }

  /**
   * Import spells into an actor
   */
  static async _importSpells(actor, spellsData) {
    const spellsToCreate = [];

    const addSpells = (spellList, prepared = false) => {
      if (spellList && Array.isArray(spellList)) {
        spellList.forEach(spell => {
          spellsToCreate.push({
            name: spell.name,
            type: 'spell',
            system: {
              level: spell.level || 0,
              school: spell.school || '',
              activation: { type: spell.castingTime || 'action' },
              range: { value: spell.range || '30' },
              components: {
                vocal: spell.components?.verbal || false,
                somatic: spell.components?.somatic || false,
                material: spell.components?.material || false
              },
              duration: { value: spell.duration || 'Instantaneous' },
              description: { value: spell.description || '' },
              preparation: { prepared: prepared || false }
            },
            flags: {
              'ld-axyum': {
                source: spell.source || 'phb'
              }
            }
          });
        });
      }
    };

    addSpells(spellsData.cantrips, false);
    addSpells(spellsData.prepared, true);
    addSpells(spellsData.known, false);
    addSpells(spellsData.available, false);

    if (spellsToCreate.length > 0) {
      await actor.createEmbeddedDocuments('Item', spellsToCreate);
    }
  }

  /**
   * Load character data from JSON file (file input)
   */
  static loadFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const content = event.target.result;
          const importData = JSON.parse(content);
          resolve(importData);
        } catch (error) {
          reject(new Error(`Failed to parse JSON: ${error.message}`));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsText(file);
    });
  }

  /**
   * Load character data from JSON string
   */
  static loadFromString(jsonString) {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      throw new Error(`Failed to parse JSON: ${error.message}`);
    }
  }

  /**
   * Generate import summary for display
   */
  static _generateImportSummary(importedData) {
    return {
      characterName: importedData.character.name,
      race: importedData.character.race,
      class: importedData.character.class,
      level: importedData.character.level,
      itemCount: importedData.items.length,
      spellCount: (importedData.spells.cantrips?.length || 0) +
                  (importedData.spells.prepared?.length || 0) +
                  (importedData.spells.known?.length || 0) +
                  (importedData.spells.available?.length || 0),
      featCount: importedData.feats.length,
      homebrewCount: (importedData.homebrew.feats?.length || 0) +
                     (importedData.homebrew.features?.length || 0) +
                     (importedData.homebrew.spells?.length || 0),
      hasMulticlass: importedData.class.multiclass?.active || false,
      hasASISelections: importedData.asiSelections?.length > 0,
      hasConditions: (importedData.conditions.active?.length || 0) > 0,
      hasTemporaryModifiers: (importedData.conditions.temporary?.length || 0) > 0
    };
  }

  /**
   * Compare imported data with existing actor data
   */
  static compareWithActor(importData, actor) {
    const comparison = {
      differences: [],
      conflicts: [],
      warnings: []
    };

    const importedChar = importData.character;
    const existingSystem = actor.system;

    // Compare basic info
    if (importedChar.name !== actor.name) {
      comparison.differences.push({
        field: 'Character Name',
        current: actor.name,
        imported: importedChar.name
      });
    }

    if (importedChar.level !== (existingSystem.details?.level || 1)) {
      comparison.differences.push({
        field: 'Level',
        current: existingSystem.details?.level || 1,
        imported: importedChar.level
      });
    }

    // Compare abilities
    const currentAbilities = existingSystem.abilities || {};
    Object.keys(importData.abilities).forEach(ability => {
      if (currentAbilities[ability] !== importData.abilities[ability]) {
        comparison.differences.push({
          field: `Ability Score (${ability.toUpperCase()})`,
          current: currentAbilities[ability] || 10,
          imported: importData.abilities[ability]
        });
      }
    });

    // Check for data loss
    if (actor.items.length > 0 && (!importData.items || importData.items.length === 0)) {
      comparison.warnings.push('Import has no items but actor has existing items');
    }

    // Check version compatibility
    if (importData.version !== '1.0') {
      comparison.warnings.push(`Import version is ${importData.version}, expected 1.0`);
    }

    return comparison;
  }
}

// ES module export
export { CharacterImporter };
