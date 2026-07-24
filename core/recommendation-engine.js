/**
 * RecommendationEngine
 * 
 * Provides intelligent recommendations for character creation:
 * - Role → Class suggestions with explanations
 * - Class → Race/Species recommendations with compatibility scores
 * - Background suggestions based on role/class choices
 * - Ability score optimization with contextual guidance
 * 
 * All recommendations include scores (0-100), explanations, and pros/cons
 */
import {
  ROLE_CLASS_MAP,
  CLASS_RACE_MAP,
  BACKGROUND_MAP,
  CLASS_ABILITY_MAP,
  CLASS_PROS,
  CLASS_CONS
} from './recommendation-data.js';

class RecommendationEngine {
  constructor(compendiumLoader) {
    this.compendiumLoader = compendiumLoader;
    this.cache = {
      roleClassMap: null,
      classRaceMap: null,
      backgroundMap: null,
      abilityGuideMap: null
    };
  }

  /**
   * Get class recommendations based on selected role
   * Returns array of {class, score, explanation, pros, cons, isRecommended}
   */
  async getRoleToClassRecommendations(role) {
    const recommendations = [];
    const roleData = ROLE_CLASS_MAP[role?.toLowerCase()] || ROLE_CLASS_MAP['warrior'];

    try {
      const allClasses = await this.compendiumLoader.loadClasses();

      for (const classData of allClasses) {
        const className = classData.name?.toLowerCase() || '';
        let score = 0;
        let tierExplanation = '';
        let isRecommended = false;

        if (roleData.primary.includes(className)) {
          score = 95;
          tierExplanation = `Perfect fit for ${role}`;
          isRecommended = true;
        } else if (roleData.secondary.includes(className)) {
          score = 75;
          tierExplanation = `Good option for ${role}`;
        } else {
          score = 50;
          tierExplanation = `Can work as ${role}`;
        }

        recommendations.push({
          id: classData.id,
          name: classData.name,
          score: score,
          explanation: tierExplanation,
          roleAlignment: roleData.explanation,
          pros: CLASS_PROS[className] || ['Unique abilities', 'Class features'],
          cons: CLASS_CONS[className] || ['Limited features', 'Specific role'],
          isRecommended: isRecommended,
          source: classData.source || 'Core Rules'
        });
      }

      recommendations.sort((a, b) => b.score - a.score);
      return recommendations;
    } catch (err) {
      console.warn('RecommendationEngine | Failed to get role-to-class recommendations', err);
      return [];
    }
  }

  /**
   * Get race/species recommendations based on selected class
   * Returns array of {race, score, explanation, abilities, traits}
   */
  async getClassToRaceRecommendations(className) {
    const recommendations = [];
    const classData = CLASS_RACE_MAP[className?.toLowerCase()] || CLASS_RACE_MAP['fighter'];

    try {
      const allRaces = await this.compendiumLoader.loadRaces();

      for (const raceData of allRaces) {
        const raceName = raceData.name?.toLowerCase() || '';
        let score = 0;

        if (classData.primary.includes(raceName)) {
          score = 90;
        } else {
          score = 60;
        }

        recommendations.push({
          id: raceData.id,
          name: raceData.name,
          score: score,
          explanation: classData.explanation,
          abilityBonuses: raceData.abilityBonuses || {},
          racialTraits: raceData.racialTraits || [],
          speedModifier: raceData.speed || 30,
          isRecommended: score >= 85,
          source: raceData.source || 'Core Rules'
        });
      }

      recommendations.sort((a, b) => b.score - a.score);
      return recommendations;
    } catch (err) {
      console.warn('RecommendationEngine | Failed to get class-to-race recommendations', err);
      return [];
    }
  }

  /**
   * Get background recommendations based on role and/or class choices
   * Returns array of {background, score, explanation, traits}
   */
  async getBackgroundRecommendations(role, className) {
    const recommendations = [];

    try {
      const allBackgrounds = await this.compendiumLoader.loadBackgrounds();
      const suggestedBackgrounds = BACKGROUND_MAP[className?.toLowerCase()] || [];

      for (const backgroundData of allBackgrounds) {
        const bgName = backgroundData.name?.toLowerCase() || '';
        let score = 0;

        if (suggestedBackgrounds.some(bg => bgName.includes(bg))) {
          score = 85;
        } else {
          score = 60;
        }

        recommendations.push({
          id: backgroundData.id,
          name: backgroundData.name,
          score: score,
          explanation: `Fits well with ${className}`,
          traits: backgroundData.traits || [],
          skillBonus: backgroundData.skillBonus || {},
          personalityTraits: backgroundData.personalityTraits || [],
          ideals: backgroundData.ideals || [],
          bonds: backgroundData.bonds || [],
          flaws: backgroundData.flaws || [],
          isRecommended: score >= 80,
          source: backgroundData.source || 'Core Rules'
        });
      }

      recommendations.sort((a, b) => b.score - a.score);
      return recommendations;
    } catch (err) {
      console.warn('RecommendationEngine | Failed to get background recommendations', err);
      return [];
    }
  }

  /**
   * Get ability score optimization guidance for a specific class
   * Returns per-ability recommendations with scores, bonuses, and "watch fors"
   */
  async getAbilityScoreRecommendations(className, level = 1) {
    const guidelines = {
      'strength': { label: 'Strength', icon: '⚔️' },
      'dexterity': { label: 'Dexterity', icon: '💨' },
      'constitution': { label: 'Constitution', icon: '❤️' },
      'intelligence': { label: 'Intelligence', icon: '🧠' },
      'wisdom': { label: 'Wisdom', icon: '👁️' },
      'charisma': { label: 'Charisma', icon: '✨' }
    };

    const classData = CLASS_ABILITY_MAP[className?.toLowerCase()] || CLASS_ABILITY_MAP['fighter'];
    const recommendations = [];
    const abilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];

    for (const ability of abilities) {
      let priority = 'tertiary';
      let score = 40;
      let guidance = '';
      let putHighestHere = false;
      let watchFor = '';

      if (ability === classData.primary) {
        priority = 'primary';
        score = 95;
        putHighestHere = true;
        guidance = this._getPrimaryAbilityGuidance(className, ability);
        watchFor = this._getPrimaryAbilityWatchFor(className, ability);
      } else if (ability === classData.secondary) {
        priority = 'secondary';
        score = 80;
        guidance = this._getSecondaryAbilityGuidance(className, ability);
        watchFor = this._getSecondaryAbilityWatchFor(className, ability);
      } else {
        priority = 'dump';
        score = 50;
        guidance = this._getTertiaryAbilityGuidance(className, ability);
        watchFor = this._getTertiaryAbilityWatchFor(className, ability);
      }

      recommendations.push({
        ability: ability,
        label: guidelines[ability].label,
        icon: guidelines[ability].icon,
        priority: priority,
        score: score,
        putHighestHere: putHighestHere,
        guidance: guidance,
        watchFor: watchFor,
        minRecommended: priority === 'primary' ? 16 : priority === 'secondary' ? 14 : 10,
        modifierBonus: this._getAbilityModifier(priority),
        classContext: className,
        level: level,
        asiAvailable: this._checkASIAvailable(level)
      });
    }

    recommendations.sort((a, b) => b.score - a.score);
    return recommendations;
  }

  /**
   * Get detailed guidance for primary ability
   */
  _getPrimaryAbilityGuidance(className, ability) {
    const guidance = {
      'strength': 'Your primary attack stat. Affects melee damage, carrying capacity, and climbing ability.',
      'dexterity': 'Your primary attack stat. Affects AC, initiative, and most ranged attacks.',
      'constitution': 'Affects HP, concentration checks, and endurance in harsh conditions.',
      'intelligence': 'Your primary spellcasting stat. Affects spell attacks, spell save DC, and knowledge checks.',
      'wisdom': 'Your primary spellcasting stat. Affects spell attacks, spell save DC, and perception.',
      'charisma': 'Your primary spellcasting stat. Affects spell attacks, spell save DC, and persuasion.'
    };
    return guidance[ability] || 'This is your primary ability score.';
  }

  /**
   * Get detailed "watch for" guidance for primary ability
   */
  _getPrimaryAbilityWatchFor(className, ability) {
    const watchFor = {
      'strength': 'Remember: Heavy armor requires STR 15 if you want to move at full speed.',
      'dexterity': 'Remember: You cannot wear heavy armor. Medium armor caps your DEX modifier at +2.',
      'constitution': 'Remember: This is the only ability that directly affects HP. Do not dump this!',
      'intelligence': 'Remember: Dump this only if you don\'t mind failing knowledge checks.',
      'wisdom': 'Remember: Low WIS means you\'ll fail perception and might act rashly in combat.',
      'charisma': 'Remember: Low CHA makes social interactions difficult but does not affect combat for most classes.'
    };
    return watchFor[ability] || 'Pay attention to this ability.';
  }

  /**
   * Get detailed guidance for secondary ability
   */
  _getSecondaryAbilityGuidance(className, ability) {
    const guidance = {
      'strength': 'Helpful for combat and saves. Important if you use weapons that scale with STR.',
      'dexterity': 'Helpful for AC and initiative. Improves your ability to dodge attacks.',
      'constitution': 'Helps survivability. Every +1 modifier gives you +level hit points.',
      'intelligence': 'Helpful for certain skills. Some subclasses use this for secondary effects.',
      'wisdom': 'Helps with perception and saves. Improves your awareness and instincts.',
      'charisma': 'Helpful for social situations and certain saves. Improves persuasion and deception.'
    };
    return guidance[ability] || 'This is a useful secondary ability.';
  }

  /**
   * Get detailed "watch for" guidance for secondary ability
   */
  _getSecondaryAbilityWatchFor(className, ability) {
    const watchFor = {
      'strength': 'You don\'t need maximum STR, but a +2 modifier is reasonable for most builds.',
      'dexterity': 'Medium armor caps your DEX bonus. Check your armor choice.',
      'constitution': 'Every modifier point is +1 HP per level. This matters over time.',
      'intelligence': 'Dump this only if you never need to recall information.',
      'wisdom': 'This affects Perception checks. Low WIS can make you vulnerable.',
      'charisma': 'Affects save DC if you have any spells with CHA saves.'
    };
    return watchFor[ability] || 'Keep an eye on this secondary ability.';
  }

  /**
   * Get detailed guidance for tertiary/dump stats
   */
  _getTertiaryAbilityGuidance(className, ability) {
    return `This ability is less important for ${className}. You can safely lower this score.`;
  }

  /**
   * Get detailed "watch for" guidance for dump stats
   */
  _getTertiaryAbilityWatchFor(className, ability) {
    return `Be aware: Very low scores (-2 to -3) can cause problems in unexpected situations.`;
  }

  /**
   * Get modifier bonus description for priority level
   */
  _getAbilityModifier(priority) {
    const modifiers = {
      'primary': '+3 to +4 recommended (16-18 starting score)',
      'secondary': '+2 to +3 recommended (14-16 starting score)',
      'tertiary': '+0 to +2 acceptable (10-14 starting score)',
      'dump': 'Can go negative (-1 to +1 acceptable, 8-12 starting score)'
    };
    return modifiers[priority] || '+0 acceptable';
  }

  /**
   * Check if ASI (Ability Score Improvement) is available at current level
   */
  _checkASIAvailable(level) {
    const asiLevels = [4, 8, 12, 16, 19];
    return asiLevels.includes(level);
  }
}

// Export for use in axyum.mjs
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RecommendationEngine;
}
