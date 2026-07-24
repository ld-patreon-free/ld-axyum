/**
 * Multiclass Calculator
 * D&D 5e multiclass spell slots, HP, proficiencies, and features
 */

export class MulticlassCalculator {
  /**
   * Calculate spell slots for multiclass character (PHB Table 164)
   * @param {Array} classes - Array of class objects with id, name, level
   * @returns {Object} Spell slots by level (0-9)
   */
  static calculateMulticlassSpellSlots(classes) {
    if (!classes || !Array.isArray(classes) || classes.length === 0) {
      return {};
    }

    let casterLevel = 0;
    
    for (const cls of classes) {
      const name = cls.name;
      const level = cls.level || 1;
      
      if (['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Wizard'].includes(name)) {
        casterLevel += level;
      } else if (['Paladin', 'Ranger'].includes(name)) {
        casterLevel += Math.floor(level / 2);
      } else if (['Artificer'].includes(name)) {
        casterLevel += Math.ceil(level / 2);
      }
    }

    // If no caster levels, return no slots
    if (casterLevel === 0) {
      return {};
    }

    // Cap at 20
    casterLevel = Math.min(20, casterLevel);

    // Standard 5e Multiclass Spell Slot Table (same as full caster table)
    const progression = {
      1: [2, 0, 0, 0, 0, 0, 0, 0, 0],
      2: [3, 0, 0, 0, 0, 0, 0, 0, 0],
      3: [4, 2, 0, 0, 0, 0, 0, 0, 0],
      4: [4, 3, 0, 0, 0, 0, 0, 0, 0],
      5: [4, 3, 2, 0, 0, 0, 0, 0, 0],
      6: [4, 3, 3, 0, 0, 0, 0, 0, 0],
      7: [4, 3, 3, 1, 0, 0, 0, 0, 0],
      8: [4, 3, 3, 2, 0, 0, 0, 0, 0],
      9: [4, 3, 3, 3, 1, 0, 0, 0, 0],
      10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
      11: [4, 3, 3, 3, 2, 1, 0, 0, 0],
      12: [4, 3, 3, 3, 2, 1, 0, 0, 0],
      13: [4, 3, 3, 3, 2, 1, 1, 0, 0],
      14: [4, 3, 3, 3, 2, 1, 1, 0, 0],
      15: [4, 3, 3, 3, 2, 1, 1, 1, 0],
      16: [4, 3, 3, 3, 2, 1, 1, 1, 0],
      17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
      18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
      19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
      20: [4, 3, 3, 3, 3, 2, 2, 1, 1]
    };

    // casterLevel is guaranteed to be 1-20 at this point
    const slotsArray = progression[casterLevel];
    const slots = {};
    
    slotsArray.forEach((count, index) => {
      if (count > 0) {
        slots[`level${index + 1}`] = count;
      }
    });

    return slots;
  }

  /**
   * Calculate hit points for multiclass character
   * @param {Array} classes - Array of class objects with id, name, level
   * @param {number} conModifier - Constitution modifier
   * @param {Function} getHitDie - Function to get hit die for a class
   * @returns {number} Total hit points
   */
  static getMulticlassHP(classes, conModifier, getHitDie) {
    if (!classes || !Array.isArray(classes) || classes.length === 0) {
      return 1;
    }

    let totalHP = 0;
    let isFirst = true;

    for (const cls of classes) {
      const hitDie = getHitDie(cls.name);
      const level = cls.level || 1;

      if (isFirst) {
        // First class gets maximum hit die at level 1
        totalHP += hitDie;
        isFirst = false;

        // Additional levels of first class
        for (let i = 1; i < level; i++) {
          totalHP += Math.max(1, Math.floor(hitDie / 2) + 1 + conModifier);
        }
      } else {
        // Subsequent classes get average
        for (let i = 0; i < level; i++) {
          totalHP += Math.max(1, Math.floor(hitDie / 2) + 1 + conModifier);
        }
      }
    }

    // Add CON modifier for each level
    const totalLevel = classes.reduce((sum, cls) => sum + (cls.level || 1), 0);
    totalHP += Math.max(0, conModifier * totalLevel);

    return Math.max(1, totalHP);
  }

  /**
   * Get proficiency bonus for multiclass character
   * @param {Array} classes - Array of class objects
   * @param {Function} getProficiencyBonus - Function to calculate proficiency bonus
   * @returns {number} Proficiency bonus
   */
  static getMulticlassProficiencyBonus(classes, getProficiencyBonus) {
    if (!classes || !Array.isArray(classes)) {
      return 2;
    }

    const totalLevel = classes.reduce((sum, cls) => sum + (cls.level || 1), 0);
    return getProficiencyBonus(totalLevel);
  }

  /**
   * Check if multiclass character is a spellcaster
   * @param {Array} classes - Array of class objects
   * @param {Function} isSpellcaster - Function to check if class is spellcaster
   * @returns {boolean} True if any class can cast spells
   */
  static isMulticlassSpellcaster(classes, isSpellcaster) {
    if (!classes || !Array.isArray(classes)) {
      return false;
    }

    return classes.some(cls => isSpellcaster(cls.name));
  }

  /**
   * Get all features for multiclass character
   * Only first class provides weapon/armor proficiencies
   * @param {Array} classes - Array of class objects
   * @returns {Object} Features by class
   */
  static getMulticlassFeatures(classes) {
    if (!classes || !Array.isArray(classes)) {
      return {};
    }

    const features = {};

    for (let i = 0; i < classes.length; i++) {
      const cls = classes[i];
      features[cls.name] = {
        name: cls.name,
        level: cls.level,
        subclass: cls.subclass || null,
        isPrimary: i === 0, // First class is primary
        proficiencies: i === 0 ? 'armor, weapons' : 'none'
      };
    }

    return features;
  }

  /**
   * Validate multiclass level distribution
   * @param {Array} classes - Array of class objects
   * @returns {Object} { valid: boolean, errors: Array }
   */
  static validateMulticlassLevels(classes) {
    const errors = [];

    if (!Array.isArray(classes)) {
      errors.push('Classes must be an array');
      return { valid: false, errors };
    }

    if (classes.length === 0) {
      errors.push('Must have at least one class');
    }

    let totalLevel = 0;
    for (let i = 0; i < classes.length; i++) {
      const cls = classes[i];

      if (!cls.id || !cls.name) {
        errors.push(`Class ${i}: missing id or name`);
      }

      if (!Number.isInteger(cls.level) || cls.level < 1 || cls.level > 20) {
        errors.push(`Class ${i} level must be 1-20, got ${cls.level}`);
      }

      totalLevel += cls.level || 0;
    }

    if (totalLevel > 20) {
      errors.push(`Total level cannot exceed 20, got ${totalLevel}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

export default MulticlassCalculator;
