/**
 * Ability Score Calculator
 * D&D 5e ability modifier and proficiency bonus calculations
 */

export class AbilityCalculator {
  /**
   * Get ability score modifier from ability score
   * @param {number} abilityScore - Ability score (3-20)
   * @returns {number} Ability modifier
   */
  static getAbilityModifier(abilityScore) {
    return Math.floor((abilityScore - 10) / 2);
  }

  /**
   * Get all ability modifiers from ability scores object
   * @param {Object} abilities - Object with str, dex, con, int, wis, cha scores
   * @returns {Object} Object with str, dex, con, int, wis, cha modifiers
   */
  static getAbilityModifiers(abilities) {
    if (!abilities) {
      return { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };
    }
    return {
      str: this.getAbilityModifier(abilities.str || 10),
      dex: this.getAbilityModifier(abilities.dex || 10),
      con: this.getAbilityModifier(abilities.con || 10),
      int: this.getAbilityModifier(abilities.int || 10),
      wis: this.getAbilityModifier(abilities.wis || 10),
      cha: this.getAbilityModifier(abilities.cha || 10)
    };
  }

  /**
   * Get proficiency bonus based on character level
   * @param {number} level - Character level (1-20)
   * @returns {number} Proficiency bonus
   */
  static getProficiencyBonus(level) {
    const level_ranges = [
      [1, 4, 2],
      [5, 8, 3],
      [9, 12, 4],
      [13, 16, 5],
      [17, 20, 6]
    ];
    
    for (const [min, max, bonus] of level_ranges) {
      if (level >= min && level <= max) {
        return bonus;
      }
    }
    
    return 2; // Default to lowest
  }
}

export default AbilityCalculator;
