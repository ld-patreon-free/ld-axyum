/**
 * RulesEngine - D&D 5e calculations and mechanics
 * Handles all derived stat calculations, ability modifiers, proficiencies, etc.
 */
import { AbilityCalculator } from './ability-calculator.js';
import { CombatCalculator } from './combat-calculator.js';
import { SpellcastingCalculator } from './spellcasting-calculator.js';
import { MulticlassCalculator } from './multiclass-calculator.js';
import { FeatCalculator } from './feat-calculator.js';
import { DerivedStatsCalculator } from './derived-stats-calculator.js';

export class RulesEngine {
  /**
   * Get ability score modifier from ability score
   * @param {number} abilityScore - Ability score (3-20)
   * @returns {number} Ability modifier
   */
  static getAbilityModifier(abilityScore) {
    return AbilityCalculator.getAbilityModifier(abilityScore);
  }

  /**
   * Get all ability modifiers from ability scores object
   * @param {Object} abilities - Object with str, dex, con, int, wis, cha scores
   * @returns {Object} Object with str, dex, con, int, wis, cha modifiers
   */
  static getAbilityModifiers(abilities) {
    return AbilityCalculator.getAbilityModifiers(abilities);
  }

  /**
   * Get proficiency bonus based on character level
   * @param {number} level - Character level (1-20)
   * @returns {number} Proficiency bonus
   */
  static getProficiencyBonus(level) {
    return AbilityCalculator.getProficiencyBonus(level);
  }

  /**
   * Calculate hit points
   * @param {Object} options - Calculation options
   * @param {string} options.className - Class name (e.g., 'Barbarian', 'Wizard')
   * @param {number} options.level - Character level
   * @param {number} options.conModifier - Constitution modifier
   * @param {boolean} options.useMaxAtFirst - Use maximum at 1st level (default: true)
   * @returns {number} Total hit points
   */
  static calculateHitPoints(options) {
    return CombatCalculator.calculateHitPoints(options);
  }

  /**
   * Calculate armor class
   * @param {Object} options - AC calculation options
   * @param {string} options.armorType - Armor type (light, medium, heavy, none)
   * @param {number} options.armorAC - Base AC of armor (if known)
   * @param {number} options.dexModifier - Dexterity modifier
   * @param {number} options.shieldBonus - Shield AC bonus (default: 0)
   * @param {number} options.acBonus - Other bonuses (default: 0)
   * @returns {number} Total armor class
   */
  static calculateArmorClass(options) {
    return CombatCalculator.calculateArmorClass(options);
  }

  /**
   * Get spell slots for a class at a given level
   * Returns null if not a spellcaster
   * 
   * @param {string} className - Class name
   * @param {number} level - Character level
   * @returns {Object|null} Object with slot counts by level, or null if not spellcaster
   */
  static getSpellSlots(className, level) {
    const slots = {
      full: {
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
      },
      half: {
        1: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        2: [2, 0, 0, 0, 0, 0, 0, 0, 0],
        3: [3, 0, 0, 0, 0, 0, 0, 0, 0],
        4: [3, 0, 0, 0, 0, 0, 0, 0, 0],
        5: [4, 2, 0, 0, 0, 0, 0, 0, 0],
        6: [4, 2, 0, 0, 0, 0, 0, 0, 0],
        7: [4, 3, 0, 0, 0, 0, 0, 0, 0],
        8: [4, 3, 0, 0, 0, 0, 0, 0, 0],
        9: [4, 3, 2, 0, 0, 0, 0, 0, 0],
        10: [4, 3, 2, 0, 0, 0, 0, 0, 0],
        11: [4, 3, 3, 0, 0, 0, 0, 0, 0],
        12: [4, 3, 3, 0, 0, 0, 0, 0, 0],
        13: [4, 3, 3, 1, 0, 0, 0, 0, 0],
        14: [4, 3, 3, 1, 0, 0, 0, 0, 0],
        15: [4, 3, 3, 2, 0, 0, 0, 0, 0],
        16: [4, 3, 3, 2, 0, 0, 0, 0, 0],
        17: [4, 3, 3, 3, 1, 0, 0, 0, 0],
        18: [4, 3, 3, 3, 1, 0, 0, 0, 0],
        19: [4, 3, 3, 3, 2, 0, 0, 0, 0],
        20: [4, 3, 3, 3, 2, 0, 0, 0, 0]
      }
    };

    // Handle null/undefined className
    if (!className) return null;
    const classType = String(className).toLowerCase();
    
    // Full casters: Cleric, Druid, Wizard, Bard, Sorcerer
    const fullCasters = ['cleric', 'druid', 'wizard', 'bard', 'sorcerer'];
    if (fullCasters.includes(classType)) {
      return {
        type: 'full',
        slots: slots.full[level] || slots.full[20]
      };
    }

    // Half casters: Paladin, Ranger
    const halfCasters = ['paladin', 'ranger'];
    if (halfCasters.includes(classType)) {
      return {
        type: 'half',
        slots: slots.half[level] || slots.half[20]
      };
    }

    // Warlocks and others: not tracked here
    return null;
  }

  /**
   * Check if a class is a spellcaster
   * @param {string} className - Class name
   * @returns {boolean} True if class can cast spells
   */
  static isSpellcaster(className) {
    if (!className) return false;
    const spellcasters = [
      'artificer',
      'bard',
      'cleric',
      'druid',
      'paladin',
      'ranger',
      'sorcerer',
      'warlock',
      'wizard'
    ];
    return spellcasters.includes(String(className).toLowerCase());
  }

  /**
   * Get number of cantrips known for a class
   * @param {string} className - Class name
   * @param {number} level - Character level
   * @returns {number} Number of cantrips
   */
  static getCantripCount(className, level) {
    return SpellcastingCalculator.getCantripCount(className, level);
  }

  /**
   * Calculate all derived stats for a character
   * @param {Object} characterData - Character data
   * @returns {Object} Object with all calculated values
   */
  static calculateAllDerivedStats(characterData) {
    return DerivedStatsCalculator.calculateAllDerivedStats(characterData, {
      AbilityCalculator,
      CombatCalculator,
      SpellcastingCalculator,
      MulticlassCalculator
    });
  }

  /**
   * Calculate spell slots for multiclass character (PHB Table 164)
   * @param {Array} classes - Array of class objects with id, name, level
   * @returns {Object} Spell slots by level (0-9)
   */
  static calculateMulticlassSpellSlots(classes) {
    return MulticlassCalculator.calculateMulticlassSpellSlots(classes);
  }

  /**
   * Calculate hit points for multiclass character
   * @param {Array} classes - Array of class objects with id, name, level
   * @param {number} conModifier - Constitution modifier
   * @returns {number} Total hit points
   */
  static getMulticlassHP(classes, conModifier = 0) {
    return MulticlassCalculator.getMulticlassHP(
      classes,
      conModifier,
      (className) => CombatCalculator.getHitDie(className)
    );
  }

  /**
   * Get proficiency bonus for multiclass character
   * @param {Array} classes - Array of class objects
   * @returns {number} Proficiency bonus
   */
  static getMulticlassProficiencyBonus(classes) {
    return MulticlassCalculator.getMulticlassProficiencyBonus(
      classes,
      (totalLevel) => this.getProficiencyBonus(totalLevel)
    );
  }

  /**
   * Check if multiclass character is a spellcaster
   * @param {Array} classes - Array of class objects
   * @returns {boolean} True if any class can cast spells
   */
  static isMulticlassSpellcaster(classes) {
    return MulticlassCalculator.isMulticlassSpellcaster(
      classes,
      (className) => this.isSpellcaster(className)
    );
  }

  /**
   * Get all features for multiclass character
   * Only first class provides weapon/armor proficiencies
   * @param {Array} classes - Array of class objects
   * @returns {Object} Features by class
   */
  static getMulticlassFeatures(classes) {
    return MulticlassCalculator.getMulticlassFeatures(classes);
  }

  /**
   * Validate multiclass level distribution
   * @param {Array} classes - Array of class objects
   * @returns {Object} { valid: boolean, errors: Array }
   */
  static validateMulticlassLevels(classes) {
    return MulticlassCalculator.validateMulticlassLevels(classes);
  }

  /**
   * Internal helper: Get hit die for class
   * @private
   */
  static _getHitDie(className) {
    return CombatCalculator.getHitDie(className);
  }

  /**
   * Get Ability Score Improvement (ASI) levels for a class
   * D&D 5e grants ASI at levels 4, 8, 12, 16, 19
   * @param {string} className - Class name
   * @returns {Array<number>} Levels where ASI is granted
   */
  static getASILevels(className) {
    return FeatCalculator.getASILevels(className);
  }

  /**
   * Check if a character gets an ASI at a specific level
   * @param {string} className - Class name
   * @param {number} level - Character level
   * @returns {boolean} True if ASI is granted at this level
   */
  static hasASIAtLevel(className, level) {
    return FeatCalculator.hasASIAtLevel(className, level);
  }

  /**
   * Get total number of ASIs available by a given level
   * @param {number} level - Character level
   * @returns {number} Total ASIs available
   */
  static countASIsByLevel(level) {
    return FeatCalculator.countASIsByLevel(level);
  }

  /**
   * Validate a feat selection for a character
   * @param {Object} options - Validation options
   * @param {string} options.featName - Name of feat being selected
   * @param {number} options.characterLevel - Character level
   * @param {Object} options.abilityScores - Character ability scores (optional)
   * @param {Array} options.selectedFeats - Already selected feats (optional)
   * @returns {Object} { valid: boolean, message: string }
   */
  static validateFeatSelection(options) {
    return FeatCalculator.validateFeatSelection(options);
  }

  /**
   * Get feats available for a character at a given level
   * @param {number} characterLevel - Character level
   * @param {Array} classes - Character classes array (optional)
   * @param {Array} selectedFeats - Already selected feats to exclude
   * @returns {Array} Available feats for selection
   */
  static getAvailableFeats(characterLevel, classes = [], selectedFeats = []) {
    return FeatCalculator.getAvailableFeats(characterLevel, classes, selectedFeats);
  }

  /**
   * Calculate if character can apply ASI improvements instead of feat
   * @param {string} className - Class name
   * @param {number} level - Character level  
   * @returns {boolean} True if character can choose ASI instead of feat
   */
  static canChooseASI(className, level) {
    return FeatCalculator.canChooseASI(className, level);
  }

  /**
   * Apply feat effects to character (placeholder for Phase 3c enhancement)
   * @param {string} featName - Feat name
   * @param {Object} character - Character object
   * @returns {Object} Modified character
   */
  static applyFeat(featName, character) {
    return FeatCalculator.applyFeat(featName, character);
  }

  /**
   * Remove feat from character (placeholder)
   * @param {string} featName - Feat name
   * @param {Object} character - Character object
   * @returns {Object} Modified character
   */
  static removeFeat(featName, character) {
    return FeatCalculator.removeFeat(featName, character);
  }

  /**
   * Calculate skill bonus
   * @param {Object} options - Skill calculation options
   * @returns {number} Total skill bonus
   */
  static calculateSkillBonus(options) {
    return DerivedStatsCalculator.calculateSkillBonus(options);
  }

  /**
   * Calculate passive skill score
   * @param {number} skillBonus - Total skill bonus
   * @returns {number} Passive score (10 + skill bonus)
   */
  static calculatePassiveScore(skillBonus) {
    return DerivedStatsCalculator.calculatePassiveScore(skillBonus);
  }

  /**
   * Get all skills with calculated bonuses
   * @param {Object} characterData - Character data
   * @returns {Array} Array of skill objects with calculated totals
   */
  static calculateAllSkills(characterData) {
    return DerivedStatsCalculator.calculateAllSkills(characterData, {
      AbilityCalculator
    });
  }

  /**
   * Calculate saving throw bonuses
   * @param {Object} characterData - Character data
   * @returns {Array} Array of saving throw objects
   */
  static calculateSavingThrows(characterData) {
    return DerivedStatsCalculator.calculateSavingThrows(characterData, {
      AbilityCalculator
    });
  }

  /**
   * Calculate spell save DC
   * @param {Object} options - Options
   * @returns {number} Spell save DC
   */
  static calculateSpellSaveDC(options) {
    return DerivedStatsCalculator.calculateSpellSaveDC(options);
  }

  /**
   * Calculate spell attack bonus
   * @param {Object} options - Options
   * @returns {number} Spell attack bonus
   */
  static calculateSpellAttackBonus(options) {
    return DerivedStatsCalculator.calculateSpellAttackBonus(options);
  }

  /**
   * Calculate carrying capacity
   * @param {number} strScore - Strength score
   * @returns {number} Carrying capacity in pounds
   */
  static calculateCarryingCapacity(strScore) {
    return DerivedStatsCalculator.calculateCarryingCapacity(strScore);
  }

  /**
   * Check if character is encumbered
   * @param {number} currentWeight - Current carrying weight
   * @param {number} strScore - Strength score
   * @returns {Object} Encumbrance status
   */
  static checkEncumbrance(currentWeight, strScore) {
    return DerivedStatsCalculator.checkEncumbrance(currentWeight, strScore);
  }

  /**
   * Get ability score array with modifiers
   * @param {Object} abilities - Abilities object
   * @returns {Array} Array of ability objects
   */
  static getAbilityScoresArray(abilities) {
    return DerivedStatsCalculator.getAbilityScoresArray(abilities, {
      AbilityCalculator
    });
  }
}

