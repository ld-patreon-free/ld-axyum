/**
 * LD Axyum - Character Ability Score Utilities
 * 
 * Utilities for ability scores, modifiers, and generation methods.
 * Extracted from character-model.js for LD protocol compliance.
 */

export class AbilityScoreUtils {
  /**
   * Calculate ability modifier from ability score
   * @param {number} abilityScore - Ability score (3-20)
   * @returns {number} Ability modifier (-4 to +5)
   */
  static getAbilityModifier(abilityScore) {
    return Math.floor((abilityScore - 10) / 2);
  }

  /**
   * Get all ability modifiers for a character
   * @param {Object} abilities - Character abilities object
   * @returns {Object} Object with modifier for each ability
   */
  static getAbilityModifiers(abilities) {
    return {
      str: this.getAbilityModifier(abilities.str),
      dex: this.getAbilityModifier(abilities.dex),
      con: this.getAbilityModifier(abilities.con),
      int: this.getAbilityModifier(abilities.int),
      wis: this.getAbilityModifier(abilities.wis),
      cha: this.getAbilityModifier(abilities.cha)
    };
  }

  /**
   * Generate ability scores using specified method
   * @param {string} method - 'standard', 'pointbuy', or 'roll'
   * @returns {Object} Ability scores object
   */
  static generateAbilityScores(method = 'standard') {
    const abilities = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };

    switch (method) {
      case 'standard':
        return {
          str: 15,
          dex: 14,
          con: 13,
          int: 12,
          wis: 10,
          cha: 8
        };

      case 'pointbuy':
        // Point buy: 27 points, can allocate to abilities
        // Min 8, Max 15 before racial bonuses
        return {
          str: 8,
          dex: 8,
          con: 8,
          int: 8,
          wis: 8,
          cha: 8
        };

      case 'roll':
        // Roll 4d6, drop lowest, 6 times
        const rolls = [];
        for (let i = 0; i < 6; i++) {
          const dice = [];
          for (let j = 0; j < 4; j++) {
            dice.push(Math.floor(Math.random() * 6) + 1);
          }
          dice.sort((a, b) => b - a);
          rolls.push(dice[0] + dice[1] + dice[2]); // Drop lowest
        }
        rolls.sort((a, b) => b - a);
        return {
          str: rolls[0],
          dex: rolls[1],
          con: rolls[2],
          int: rolls[3],
          wis: rolls[4],
          cha: rolls[5]
        };

      default:
        return abilities;
    }
  }
}
