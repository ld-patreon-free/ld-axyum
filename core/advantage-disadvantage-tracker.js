/**
 * LD Axyum Advantage/Disadvantage System
 * Tracks advantage/disadvantage on rolls with sources and durations
 * Supports ability checks, saves, attacks, skill checks
 */

class AdvantageDisadvantageTracker {
  /**
   * Add advantage to an actor
   */
  static async addAdvantage(actor, details) {
    try {
      const advantages = actor.getFlag('ld-axyum', 'advantages') || [];
      
      const advantage = {
        id: foundry.utils.randomID(),
        source: details.source || 'Unknown Source',
        reason: details.reason || '',
        type: details.type || 'general', // general, ability, save, attack, skill
        targetType: details.targetType, // ability check, strength save, dexterity attack, acrobatics skill, etc.
        appliesTo: details.appliesTo || [], // ['attacks', 'saves', 'checks', 'skills']
        duration: details.duration || null, // null = permanent, number = rounds, or {type: 'until', condition: 'end of turn'}
        createdAt: new Date().toISOString(),
        isTemporary: details.isTemporary || false
      };

      advantages.push(advantage);
      await actor.setFlag('ld-axyum', 'advantages', advantages);
      
      ui.notifications?.notify?.(`Advantage added: ${advantage.source}`);
      return advantage;
    } catch (err) {
      console.error('LD Axyum | Failed to add advantage:', err);
      return null;
    }
  }

  /**
   * Add disadvantage to an actor
   */
  static async addDisadvantage(actor, details) {
    try {
      const disadvantages = actor.getFlag('ld-axyum', 'disadvantages') || [];
      
      const disadvantage = {
        id: foundry.utils.randomID(),
        source: details.source || 'Unknown Source',
        reason: details.reason || '',
        type: details.type || 'general',
        targetType: details.targetType,
        appliesTo: details.appliesTo || [],
        duration: details.duration || null,
        createdAt: new Date().toISOString(),
        isTemporary: details.isTemporary || false
      };

      disadvantages.push(disadvantage);
      await actor.setFlag('ld-axyum', 'disadvantages', disadvantages);
      
      ui.notifications?.notify?.(`Disadvantage added: ${disadvantage.source}`);
      return disadvantage;
    } catch (err) {
      console.error('LD Axyum | Failed to add disadvantage:', err);
      return null;
    }
  }

  /**
   * Remove advantage by ID
   */
  static async removeAdvantage(actor, advantageId) {
    try {
      const advantages = (actor.getFlag('ld-axyum', 'advantages') || []).filter(a => a.id !== advantageId);
      await actor.setFlag('ld-axyum', 'advantages', advantages);
      ui.notifications?.notify?.('Advantage removed');
      return true;
    } catch (err) {
      console.error('LD Axyum | Failed to remove advantage:', err);
      return false;
    }
  }

  /**
   * Remove disadvantage by ID
   */
  static async removeDisadvantage(actor, disadvantageId) {
    try {
      const disadvantages = (actor.getFlag('ld-axyum', 'disadvantages') || []).filter(d => d.id !== disadvantageId);
      await actor.setFlag('ld-axyum', 'disadvantages', disadvantages);
      ui.notifications?.notify?.('Disadvantage removed');
      return true;
    } catch (err) {
      console.error('LD Axyum | Failed to remove disadvantage:', err);
      return false;
    }
  }

  /**
   * Get active advantages for a roll type
   */
  static getActiveAdvantages(actor, rollType = 'general') {
    const all = actor.getFlag('ld-axyum', 'advantages') || [];
    
    return all.filter(adv => {
      // Check if expired
      if (adv.duration && typeof adv.duration === 'number' && adv.duration <= 0) {
        return false;
      }

      // Check if applies to roll type
      if (rollType === 'general') return adv.type === 'general' || adv.appliesTo.includes('all');
      return adv.type === rollType || adv.appliesTo.includes(rollType);
    });
  }

  /**
   * Get active disadvantages for a roll type
   */
  static getActiveDisadvantages(actor, rollType = 'general') {
    const all = actor.getFlag('ld-axyum', 'disadvantages') || [];
    
    return all.filter(disadv => {
      // Check if expired
      if (disadv.duration && typeof disadv.duration === 'number' && disadv.duration <= 0) {
        return false;
      }

      // Check if applies to roll type
      if (rollType === 'general') return disadv.type === 'general' || disadv.appliesTo.includes('all');
      return disadv.type === rollType || disadv.appliesTo.includes(rollType);
    });
  }

  /**
   * Check if advantage overrides disadvantage
   */
  static hasAdvantageOverDisadvantage(actor, rollType = 'general') {
    const adv = this.getActiveAdvantages(actor, rollType);
    const disadv = this.getActiveDisadvantages(actor, rollType);

    // Advantage cancels out disadvantage
    if (adv.length > 0 && disadv.length > 0) {
      return 'neutral'; // Roll normally
    }

    if (adv.length > 0) return 'advantage';
    if (disadv.length > 0) return 'disadvantage';
    return 'neutral';
  }

  /**
   * Decrement duration for temporary advantage/disadvantage
   * Call this after rolls that consume the effect
   */
  static async decrementDurations(actor) {
    try {
      const advantages = actor.getFlag('ld-axyum', 'advantages') || [];
      const disadvantages = actor.getFlag('ld-axyum', 'disadvantages') || [];

      // Decrement advantage durations
      const updatedAdv = advantages.map(adv => {
        if (adv.duration && typeof adv.duration === 'number') {
          return { ...adv, duration: adv.duration - 1 };
        }
        return adv;
      }).filter(adv => !adv.duration || adv.duration > 0);

      // Decrement disadvantage durations
      const updatedDisadv = disadvantages.map(disadv => {
        if (disadv.duration && typeof disadv.duration === 'number') {
          return { ...disadv, duration: disadv.duration - 1 };
        }
        return disadv;
      }).filter(disadv => !disadv.duration || disadv.duration > 0);

      await actor.setFlag('ld-axyum', 'advantages', updatedAdv);
      await actor.setFlag('ld-axyum', 'disadvantages', updatedDisadv);

      return { advantages: updatedAdv, disadvantages: updatedDisadv };
    } catch (err) {
      console.error('LD Axyum | Failed to decrement durations:', err);
      return null;
    }
  }

  /**
   * Clear all temporary effects
   */
  static async clearTemporaryEffects(actor) {
    try {
      const advantages = (actor.getFlag('ld-axyum', 'advantages') || []).filter(a => !a.isTemporary);
      const disadvantages = (actor.getFlag('ld-axyum', 'disadvantages') || []).filter(d => !d.isTemporary);

      await actor.setFlag('ld-axyum', 'advantages', advantages);
      await actor.setFlag('ld-axyum', 'disadvantages', disadvantages);

      ui.notifications?.notify?.('Temporary advantage/disadvantage effects cleared');
      return true;
    } catch (err) {
      console.error('LD Axyum | Failed to clear temporary effects:', err);
      return false;
    }
  }

  /**
   * Get summary of advantages/disadvantages for display
   */
  static getSummary(actor) {
    const advantages = actor.getFlag('ld-axyum', 'advantages') || [];
    const disadvantages = actor.getFlag('ld-axyum', 'disadvantages') || [];

    const advSources = advantages.map(a => ({
      source: a.source,
      reason: a.reason,
      duration: a.duration,
      id: a.id
    }));

    const disadvSources = disadvantages.map(d => ({
      source: d.source,
      reason: d.reason,
      duration: d.duration,
      id: d.id
    }));

    return {
      totalAdvantages: advantages.length,
      totalDisadvantages: disadvantages.length,
      advantages: advSources,
      disadvantages: disadvSources,
      resultingState: advantages.length > 0 && disadvantages.length > 0 ? 'neutral' 
                     : advantages.length > 0 ? 'advantage'
                     : disadvantages.length > 0 ? 'disadvantage'
                     : 'neutral'
    };
  }

  /**
   * Apply common conditions that grant advantage
   */
  static getConditionAdvantage(condition) {
    const conditionMap = {
      'blinded': { applies: ['attacks'], type: 'attack' },
      'frightened': { applies: ['attacks', 'saves'], type: 'special' },
      'grappled': { applies: ['movement'], type: 'movement' },
      'incapacitated': { applies: [], type: 'incapacitated' },
      'invisible': { applies: ['attacks'], type: 'attack' },
      'paralyzed': { applies: ['attacks', 'saves'], type: 'special' },
      'petrified': { applies: ['attacks', 'saves'], type: 'special' },
      'prone': { applies: ['melee-attacks'], type: 'attack' },
      'restrained': { applies: ['attacks', 'dexterity-saves'], type: 'special' },
      'stunned': { applies: ['attacks', 'saves'], type: 'special' },
      'unconscious': { applies: [], type: 'unconscious' },
      'deafened': { applies: [], type: 'deafened' },
      'exhaustion': { applies: ['all-ability-checks', 'attack-rolls', 'saving-throws'], type: 'general' }
    };

    return conditionMap[condition.toLowerCase()] || null;
  }
}

// ES Module export
export { AdvantageDisadvantageTracker };
