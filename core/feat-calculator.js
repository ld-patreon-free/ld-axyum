/**
 * Feat Calculator
 * D&D 5e ASI (Ability Score Improvement) and feat selection mechanics
 */

export class FeatCalculator {
  /**
   * Get Ability Score Improvement (ASI) levels for a class
   * D&D 5e grants ASI at levels 4, 8, 12, 16, 19
   * @param {string} className - Class name
   * @returns {Array<number>} Levels where ASI is granted
   */
  static getASILevels(className) {
    return [4, 8, 12, 16, 19];
  }

  /**
   * Check if a character gets an ASI at a specific level
   * @param {string} className - Class name
   * @param {number} level - Character level
   * @returns {boolean} True if ASI is granted at this level
   */
  static hasASIAtLevel(className, level) {
    return this.getASILevels(className).includes(level);
  }

  /**
   * Get total number of ASIs available by a given level
   * @param {number} level - Character level
   * @returns {number} Total ASIs available
   */
  static countASIsByLevel(level) {
    const asiLevels = [4, 8, 12, 16, 19];
    return asiLevels.filter(l => l <= level).length;
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
    const {
      featName = '',
      characterLevel = 1,
      abilityScores = {},
      selectedFeats = []
    } = options;

    if (!featName) {
      return { valid: false, message: 'Feat name required' };
    }

    // Check if feat is already selected
    if (selectedFeats.includes(featName)) {
      return { valid: false, message: `${featName} already selected` };
    }

    // In full implementation, would check prerequisites here
    // For now, just validate basic constraints

    return { valid: true, message: 'Feat selection valid' };
  }

  /**
   * Get feats available for a character at a given level
   * @param {number} characterLevel - Character level
   * @param {Array} classes - Character classes array (optional)
   * @param {Array} selectedFeats - Already selected feats to exclude
   * @returns {Array} Available feats for selection
   */
  static getAvailableFeats(characterLevel, classes = [], selectedFeats = []) {
    // This would typically be called from CompendiumLoader
    // which provides the full feat list. This just filters based on rules.
    
    return {
      asiCount: this.countASIsByLevel(characterLevel),
      level: characterLevel,
      availableForSelection: true
    };
  }

  /**
   * Calculate if character can apply ASI improvements instead of feat
   * @param {string} className - Class name
   * @param {number} level - Character level  
   * @returns {boolean} True if character can choose ASI instead of feat
   */
  static canChooseASI(className, level) {
    // ASI is always available when a feat would be granted
    return this.hasASIAtLevel(className, level);
  }

  /**
   * Apply feat effects to character (placeholder for Phase 3c enhancement)
   * @param {string} featName - Feat name
   * @param {Object} character - Character object
   * @returns {Object} Modified character
   */
  static applyFeat(featName, character) {
    // In Phase 3c, this would apply ability modifiers, bonuses, etc.
    if (!character.feats) {
      character.feats = [];
    }
    character.feats.push(featName);
    return character;
  }

  /**
   * Remove feat from character (placeholder)
   * @param {string} featName - Feat name
   * @param {Object} character - Character object
   * @returns {Object} Modified character
   */
  static removeFeat(featName, character) {
    if (character.feats) {
      character.feats = character.feats.filter(f => f !== featName);
    }
    return character;
  }
}

export default FeatCalculator;
