/**
 * Combat Calculator
 * D&D 5e hit points and armor class calculations
 */

export class CombatCalculator {
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
    const {
      className = 'Fighter',
      level = 1,
      conModifier = 0,
      useMaxAtFirst = true
    } = options;

    const hitDie = this.getHitDie(className);
    let hp = 0;

    for (let i = 0; i < level; i++) {
      if (i === 0 && useMaxAtFirst) {
        hp += hitDie;
      } else {
        // Average: ceil(hitDie / 2) + 1
        hp += Math.ceil(hitDie / 2) + 1;
      }
    }

    // Add constitution modifier per level
    hp += conModifier * level;

    return Math.max(1, hp); // Minimum 1 HP
  }

  /**
   * Get hit die for a class
   * @param {string} className - Class name
   * @returns {number} Hit die (d6, d8, d10, d12)
   */
  static getHitDie(className) {
    const hitDies = {
      'barbarian': 12,
      'bard': 8,
      'cleric': 8,
      'druid': 8,
      'fighter': 10,
      'monk': 8,
      'paladin': 10,
      'ranger': 10,
      'rogue': 8,
      'sorcerer': 6,
      'warlock': 8,
      'wizard': 6
    };

    if (!className) return 8;
    return hitDies[String(className).toLowerCase()] || 8;
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
    const {
      armorType = 'none',
      armorAC = 10,
      dexModifier = 0,
      shieldBonus = 0,
      acBonus = 0
    } = options;

    let ac = 10;

    if (armorAC) {
      ac = armorAC;
    }

    // Add dexterity modifier based on armor type
    const armorTypeLower = armorType ? String(armorType).toLowerCase() : 'none';
    switch (armorTypeLower) {
      case 'light':
        ac += dexModifier;
        break;
      case 'medium':
        ac += Math.min(dexModifier, 2); // Max +2 DEX
        break;
      case 'heavy':
        // No dexterity modifier
        break;
      case 'none':
        ac = 10 + dexModifier;
        break;
    }

    return ac + shieldBonus + acBonus;
  }
}

export default CombatCalculator;
