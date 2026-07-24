/**
 * LD Axyum Proficiency Bonus Automation
 * Automatically applies proficiency bonuses based on character proficiencies
 * Supports skill checks, ability checks, attack rolls, saving throws
 */

class ProficiencyBonusAutomation {
  /**
   * Calculate proficiency bonus from level
   */
  static calculateProficiencyBonus(characterLevel) {
    if (characterLevel < 1) return 2;
    if (characterLevel < 5) return 2;
    if (characterLevel < 9) return 3;
    if (characterLevel < 13) return 4;
    if (characterLevel < 17) return 5;
    return 6;
  }

  /**
   * Get proficiency bonus for skill check
   */
  static getSkillProficiencyBonus(actor, characterData, skillName) {
    const proficiencyBonus = this.calculateProficiencyBonus(characterData.level || 1);
    const proficiencies = characterData.proficiencies || {};

    if (!proficiencies.skills) {
      return 0;
    }

    const skill = proficiencies.skills.find(s => s.name === skillName);
    if (!skill) {
      return 0;
    }

    // Check for expertise (double proficiency)
    if (skill.expertise) {
      return proficiencyBonus * 2;
    }

    return proficiencyBonus;
  }

  /**
   * Get proficiency bonus for saving throw
   */
  static getSavingThrowProficiencyBonus(actor, characterData, ability) {
    const proficiencyBonus = this.calculateProficiencyBonus(characterData.level || 1);
    const proficiencies = characterData.proficiencies || {};

    if (!proficiencies.savingThrows) {
      return 0;
    }

    const hasSaveProficiency = proficiencies.savingThrows.includes(ability);
    return hasSaveProficiency ? proficiencyBonus : 0;
  }

  /**
   * Get proficiency bonus for attack roll
   */
  static getAttackProficiencyBonus(actor, characterData, weaponName) {
    const proficiencyBonus = this.calculateProficiencyBonus(characterData.level || 1);
    const proficiencies = characterData.proficiencies || {};

    if (!proficiencies.weapons) {
      return 0;
    }

    // Check weapon proficiency
    const hasWeaponProf = proficiencies.weapons.some(w => w === weaponName || w === 'all');
    return hasWeaponProf ? proficiencyBonus : 0;
  }

  /**
   * Get proficiency bonus for armor
   */
  static getArmorProficiencyBonus(actor, characterData, armorName) {
    const proficiencies = characterData.proficiencies || {};

    if (!proficiencies.armor) {
      return 0;
    }

    // Return AC bonus or proficiency indicator (depending on system)
    const hasArmorProf = proficiencies.armor.some(a => a === armorName || a === 'all');
    return hasArmorProf ? 1 : 0; // Mainly for system compatibility
  }

  /**
   * Get all proficiency bonuses for an actor
   */
  static getAllProficiencyBonuses(actor, characterData) {
    const proficiencyBonus = this.calculateProficiencyBonus(characterData.level || 1);
    const proficiencies = characterData.proficiencies || {};

    return {
      proficiencyBonus,
      skills: this._buildSkillProficiencies(proficiencies, proficiencyBonus),
      savingThrows: this._buildSavingThrowProficiencies(proficiencies, proficiencyBonus),
      weapons: proficiencies.weapons || [],
      armor: proficiencies.armor || [],
      tools: proficiencies.tools || [],
      languages: proficiencies.languages || []
    };
  }

  /**
   * Build skill proficiency map
   */
  static _buildSkillProficiencies(proficiencies, proficiencyBonus) {
    const skills = {};

    if (proficiencies.skills && Array.isArray(proficiencies.skills)) {
      proficiencies.skills.forEach(skill => {
        skills[skill.name] = {
          proficient: true,
          bonus: skill.expertise ? proficiencyBonus * 2 : proficiencyBonus,
          expertise: skill.expertise || false
        };
      });
    }

    return skills;
  }

  /**
   * Build saving throw proficiency map
   */
  static _buildSavingThrowProficiencies(proficiencies, proficiencyBonus) {
    const saves = {};
    const abilities = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

    abilities.forEach(ability => {
      const isProficient = proficiencies.savingThrows && proficiencies.savingThrows.includes(ability);
      saves[ability] = {
        proficient: isProficient,
        bonus: isProficient ? proficiencyBonus : 0
      };
    });

    return saves;
  }

  /**
   * Apply proficiency bonus to roll
   */
  static applyProficiencyToRoll(roll, proficiencyBonus) {
    try {
      if (!roll) return null;

      // Add proficiency bonus to the roll
      roll._formula = `${roll._formula} + ${proficiencyBonus}`;
      return roll;
    } catch (err) {
      console.error('LD Axyum | Failed to apply proficiency bonus:', err);
      return roll;
    }
  }

  /**
   * Check if character is proficient with tool
   */
  static isToolProficient(characterData, toolName) {
    const proficiencies = characterData.proficiencies || {};
    if (!proficiencies.tools) return false;

    return proficiencies.tools.some(t => t.name === toolName || t.name === 'all');
  }

  /**
   * Check if character knows language
   */
  static knowsLanguage(characterData, language) {
    const proficiencies = characterData.proficiencies || {};
    if (!proficiencies.languages) return false;

    return proficiencies.languages.includes(language);
  }

  /**
   * Get passive skill score (10 + ability modifier + proficiency if proficient)
   */
  static getPassiveSkillScore(characterData, skillName, abilityModifier) {
    const proficiencyBonus = this.calculateProficiencyBonus(characterData.level || 1);
    const proficiencies = characterData.proficiencies || {};

    let passiveScore = 10 + abilityModifier;

    if (proficiencies.skills) {
      const skill = proficiencies.skills.find(s => s.name === skillName);
      if (skill) {
        if (skill.expertise) {
          passiveScore += proficiencyBonus * 2;
        } else {
          passiveScore += proficiencyBonus;
        }
      }
    }

    return passiveScore;
  }

  /**
   * Generate proficiency summary for display
   */
  static generateProficiencySummary(characterData) {
    const proficiencies = characterData.proficiencies || {};
    const proficiencyBonus = this.calculateProficiencyBonus(characterData.level || 1);

    return {
      proficiencyBonus,
      skills: {
        count: proficiencies.skills ? proficiencies.skills.length : 0,
        list: proficiencies.skills || [],
        expertise: proficiencies.skills ? proficiencies.skills.filter(s => s.expertise).map(s => s.name) : []
      },
      savingThrows: {
        count: proficiencies.savingThrows ? proficiencies.savingThrows.length : 0,
        list: proficiencies.savingThrows || []
      },
      weapons: {
        count: proficiencies.weapons ? proficiencies.weapons.length : 0,
        list: proficiencies.weapons || []
      },
      armor: {
        count: proficiencies.armor ? proficiencies.armor.length : 0,
        list: proficiencies.armor || []
      },
      tools: {
        count: proficiencies.tools ? proficiencies.tools.length : 0,
        list: proficiencies.tools || []
      },
      languages: {
        count: proficiencies.languages ? proficiencies.languages.length : 0,
        list: proficiencies.languages || []
      }
    };
  }

  /**
   * Update proficiency based on character level change
   */
  static updateProficiencyForLevelUp(actor, oldLevel, newLevel) {
    try {
      const oldBonus = this.calculateProficiencyBonus(oldLevel);
      const newBonus = this.calculateProficiencyBonus(newLevel);

      if (oldBonus !== newBonus) {
        ui.notifications?.notify?.(`Proficiency bonus increased from +${oldBonus} to +${newBonus}`);
      }

      return newBonus;
    } catch (err) {
      console.error('LD Axyum | Failed to update proficiency for level up:', err);
      return null;
    }
  }

  /**
   * Apply default proficiencies based on class
   */
  static getDefaultClassProficiencies(classId) {
    const classProfs = {
      'barbarian': {
        weapons: ['all-simple', 'all-martial'],
        armor: ['light', 'medium', 'shield'],
        savingThrows: ['str', 'con'],
        skills: ['animal-handling', 'athletics', 'intimidation', 'nature', 'perception', 'survival']
      },
      'bard': {
        weapons: ['all-simple', 'hand-crossbow', 'longsword', 'rapier', 'shortsword'],
        armor: ['light'],
        savingThrows: ['dex', 'cha'],
        skills: ['acrobatics', 'animal-handling', 'arcana', 'athletics', 'deception', 'history', 'insight', 'investigation', 'medicine', 'nature', 'perception', 'performance', 'persuasion', 'religion', 'sleight-of-hand', 'stealth']
      },
      'cleric': {
        weapons: ['all-simple'],
        armor: ['light', 'medium', 'heavy', 'shield'],
        savingThrows: ['wis', 'cha'],
        skills: ['insight', 'medicine', 'persuasion', 'religion']
      },
      'druid': {
        weapons: ['all-simple', 'scimitar'],
        armor: ['light', 'medium', 'shield'],
        savingThrows: ['int', 'wis'],
        skills: ['arcana', 'animal-handling', 'insight', 'medicine', 'nature', 'perception', 'religion', 'survival']
      },
      'fighter': {
        weapons: ['all-simple', 'all-martial'],
        armor: ['light', 'medium', 'heavy', 'shield'],
        savingThrows: ['str', 'con'],
        skills: ['acrobatics', 'animal-handling', 'athletics', 'history', 'insight', 'intimidation', 'perception', 'survival']
      },
      'monk': {
        weapons: ['all-simple', 'shortsword'],
        armor: [],
        savingThrows: ['str', 'dex'],
        skills: ['acrobatics', 'athletics', 'history', 'insight', 'religion', 'stealth']
      },
      'paladin': {
        weapons: ['all-simple', 'all-martial'],
        armor: ['light', 'medium', 'heavy', 'shield'],
        savingThrows: ['wis', 'cha'],
        skills: ['athletics', 'insight', 'intimidation', 'medicine', 'persuasion', 'religion']
      },
      'ranger': {
        weapons: ['all-simple', 'all-martial'],
        armor: ['light', 'medium', 'shield'],
        savingThrows: ['str', 'dex'],
        skills: ['animal-handling', 'athletics', 'insight', 'investigation', 'nature', 'perception', 'stealth', 'survival']
      },
      'rogue': {
        weapons: ['all-simple', 'hand-crossbow', 'longsword', 'rapier', 'shortsword'],
        armor: ['light'],
        savingThrows: ['dex', 'int'],
        skills: ['acrobatics', 'athletics', 'deception', 'insight', 'intimidation', 'investigation', 'perception', 'performance', 'persuasion', 'sleight-of-hand', 'stealth']
      },
      'sorcerer': {
        weapons: ['all-simple'],
        armor: [],
        savingThrows: ['con', 'cha'],
        skills: ['arcana', 'deception', 'insight', 'intimidation', 'persuasion', 'religion']
      },
      'warlock': {
        weapons: ['all-simple'],
        armor: ['light'],
        savingThrows: ['wis', 'cha'],
        skills: ['arcana', 'deception', 'history', 'insight', 'investigation', 'occultism', 'perception', 'persuasion', 'religion']
      },
      'wizard': {
        weapons: ['all-simple', 'quarterstaff'],
        armor: [],
        savingThrows: ['int', 'wis'],
        skills: ['arcana', 'history', 'insight', 'investigation', 'medicine', 'nature', 'perception', 'religion']
      }
    };

    return classProfs[classId] || { weapons: [], armor: [], savingThrows: [], skills: [] };
  }
}

// ES module export
export { ProficiencyBonusAutomation };
